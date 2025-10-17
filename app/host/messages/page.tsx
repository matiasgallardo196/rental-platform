"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function HostMessagesPage() {
  const { data: session } = useSession();
  const [conversations, setConversations] = useState<any[]>([]);
  const [propertyOptions, setPropertyOptions] = useState<
    { id: string; title: string }[]
  >([]);
  const [propertyId, setPropertyId] = useState<string>("");
  const [activeBookingId, setActiveBookingId] = useState<string>("");
  const [threadMessages, setThreadMessages] = useState<any[]>([]);
  const [input, setInput] = useState<string>("");
  const [typing, setTyping] = useState<boolean>(false);
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const load = async () => {
      if (!session?.user || (session.user as any).role !== "host") return;
      const hostId = (session.user as any).id;
      const res = await fetch(`${API_URL}/hosts/${hostId}/messages`, {
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        setConversations(data.conversations || []);
      }
      // load properties for filter
      const propsRes = await fetch(`${API_URL}/hosts/${hostId}/properties`, {
        cache: "no-store",
      });
      if (propsRes.ok) {
        const pdata = await propsRes.json();
        setPropertyOptions(
          (pdata.properties || []).map((p: any) => ({
            id: p.id,
            title: p.title,
          }))
        );
      }
    };
    load();
  }, [session]);

  // Preserve selection across filters: do nothing; selected state persists

  useEffect(() => {
    const loadThread = async () => {
      if (
        !session?.user ||
        (session.user as any).role !== "host" ||
        !activeBookingId
      )
        return;
      const hostId = (session.user as any).id;
      await fetch(
        `${API_URL}/hosts/${hostId}/messages/${activeBookingId}/read`,
        { method: "PATCH" }
      );
      const res = await fetch(
        `${API_URL}/hosts/${hostId}/messages/${activeBookingId}`,
        { cache: "no-store" }
      );
      if (res.ok) {
        const data = await res.json();
        setThreadMessages(data.messages || []);
      }
    };
    loadThread();

    // Simulated typing indicator and periodic refresh
    let typingTimer: any;
    let refreshTimer: any;
    if (activeBookingId) {
      typingTimer = setTimeout(() => setTyping(true), 800);
      refreshTimer = setInterval(async () => {
        const hostId = (session?.user as any)?.id;
        if (!hostId) return;
        const res = await fetch(
          `${API_URL}/hosts/${hostId}/messages/${activeBookingId}`,
          { cache: "no-store" }
        );
        if (res.ok) {
          const data = await res.json();
          setThreadMessages(data.messages || []);
        }
      }, 5000);
    }
    return () => {
      setTyping(false);
      if (typingTimer) clearTimeout(typingTimer);
      if (refreshTimer) clearInterval(refreshTimer);
    };
  }, [session, activeBookingId]);

  const activeConversation = useMemo(
    () => conversations.find((c) => c.bookingId === activeBookingId),
    [conversations, activeBookingId]
  );

  // Auto-scroll to bottom when threadMessages changes
  useEffect(() => {
    const container = document.querySelector(
      "[data-chat-scroll-container]"
    ) as HTMLDivElement | null;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [threadMessages]);

  if (!session?.user || (session.user as any).role !== "host") {
    return (
      <div className="container mx-auto p-8">
        <p className="text-muted-foreground">Not authorized</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <div className="mb-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/host/listings">Host</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Messages</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <h1 className="mb-2 text-3xl font-bold">Messages</h1>
      <div className="mb-4 flex items-center gap-3">
        <div className="max-w-xs">
          <Select
            value={propertyId}
            onValueChange={(v) => setPropertyId(v === "all" ? "" : v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All properties" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All properties</SelectItem>
              {propertyOptions.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <button
          className="rounded-md border px-3 py-2 text-sm disabled:opacity-50"
          onClick={() => {
            const visible = conversations.filter((c) =>
              propertyId ? c.propertyId === propertyId : true
            );
            const allSelected = visible.every((c) => selected[c.bookingId]);
            const next: Record<string, boolean> = { ...selected };
            for (const c of visible) next[c.bookingId] = !allSelected;
            setSelected(next);
          }}
        >
          Toggle select visible
        </button>
        <button
          className="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground disabled:opacity-50"
          disabled={Object.values(selected).every((v) => !v)}
          onClick={async () => {
            const bookingIds = Object.entries(selected)
              .filter(([, v]) => v)
              .map(([k]) => k);
            if (bookingIds.length === 0) return;
            const hostId = (session!.user as any).id;
            await fetch(`${API_URL}/hosts/${hostId}/messages/read`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ bookingIds }),
            });
            // Optimistic update
            setConversations((prev) =>
              prev.map((c) =>
                bookingIds.includes(c.bookingId) ? { ...c, unreadCount: 0 } : c
              )
            );
            setSelected({});
          }}
        >
          Mark as read
        </button>
        <button
          className="rounded-md border px-3 py-2 text-sm disabled:opacity-50"
          disabled={Object.values(selected).every((v) => !v)}
          onClick={async () => {
            const bookingIds = Object.entries(selected)
              .filter(([, v]) => v)
              .map(([k]) => k);
            if (bookingIds.length === 0) return;
            const hostId = (session!.user as any).id;
            await fetch(`${API_URL}/hosts/${hostId}/messages/unread`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ bookingIds }),
            });
            // Optimistic: set unreadCount to at least 1 to reflect unread
            setConversations((prev) =>
              prev.map((c) =>
                bookingIds.includes(c.bookingId)
                  ? { ...c, unreadCount: Math.max(1, c.unreadCount || 1) }
                  : c
              )
            );
            setSelected({});
          }}
        >
          Mark as unread
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="md:col-span-1 rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking</TableHead>
                <TableHead>Unread</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {conversations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="h-24 text-center">
                    No messages
                  </TableCell>
                </TableRow>
              ) : (
                conversations
                  .filter((c) =>
                    propertyId ? c.propertyId === propertyId : true
                  )
                  .sort((a, b) => {
                    const ua = (a.unreadCount || 0) > 0 ? 1 : 0;
                    const ub = (b.unreadCount || 0) > 0 ? 1 : 0;
                    if (ub !== ua) return ub - ua; // unread first
                    const ta = a.lastAt ? new Date(a.lastAt).getTime() : 0;
                    const tb = b.lastAt ? new Date(b.lastAt).getTime() : 0;
                    return tb - ta; // newest first
                  })
                  .map((c) => (
                    <TableRow
                      key={c.bookingId}
                      className={
                        activeBookingId === c.bookingId
                          ? "bg-muted/50 cursor-pointer"
                          : "cursor-pointer"
                      }
                      onClick={() => setActiveBookingId(c.bookingId)}
                    >
                      <TableCell className="w-10 align-top">
                        <input
                          type="checkbox"
                          checked={!!selected[c.bookingId]}
                          onChange={(e) =>
                            setSelected((prev) => ({
                              ...prev,
                              [c.bookingId]: e.target.checked,
                            }))
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex flex-col">
                            <span
                              className={
                                c.unreadCount ? "font-semibold" : "font-medium"
                              }
                            >
                              {c.propertyTitle || c.bookingId}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {c.bookingId}
                            </span>
                          </div>
                          {c.unreadCount ? (
                            <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                              Unread
                            </span>
                          ) : null}
                        </div>
                      </TableCell>
                      <TableCell>{c.unreadCount ?? 0}</TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="md:col-span-2 flex flex-col rounded-md border">
          <div className="border-b p-4">
            <div className="text-sm text-muted-foreground">Booking</div>
            <div className="text-lg font-semibold">
              {activeConversation?.bookingId || "Select a thread"}
            </div>
          </div>
          <div
            className="flex-1 space-y-3 overflow-y-auto p-4"
            style={{ minHeight: 360 }}
            data-chat-scroll-container
          >
            {activeBookingId && threadMessages.length === 0 && (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No messages
                </CardContent>
              </Card>
            )}
            {threadMessages.map((m) => (
              <div key={m.id} className="flex flex-col gap-1">
                <div className="text-xs text-muted-foreground">{m.at}</div>
                <div
                  className={
                    m.fromUserId === (session!.user as any).id
                      ? "ml-auto max-w-[80%] rounded-lg bg-primary px-3 py-2 text-primary-foreground"
                      : "mr-auto max-w-[80%] rounded-lg bg-muted px-3 py-2"
                  }
                >
                  {m.text}
                </div>
              </div>
            ))}
            {typing && activeBookingId && (
              <div className="mr-auto max-w-[80%] rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
                typing...
              </div>
            )}
          </div>
          <div className="border-t p-3">
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!activeBookingId || !input.trim()) return;
                const hostId = (session!.user as any).id;
                // For mock, send to guest inferred from last message (or guest-1 fallback)
                const last = threadMessages[threadMessages.length - 1];
                const toUserId =
                  last && last.fromUserId !== hostId
                    ? last.fromUserId
                    : last?.toUserId || "guest-1";
                const res = await fetch(
                  `${API_URL}/hosts/${hostId}/messages/${activeBookingId}`,
                  {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ text: input, toUserId }),
                  }
                );
                if (res.ok) {
                  setInput("");
                  const data = await res.json();
                  setThreadMessages((prev) => [...prev, data.message]);
                }
              }}
              className="flex items-center gap-2"
            >
              <input
                className="flex-1 rounded-md border px-3 py-2 text-sm outline-none"
                placeholder={
                  activeBookingId ? "Write a message" : "Select a conversation"
                }
                disabled={!activeBookingId}
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button
                type="submit"
                className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-50"
                disabled={!activeBookingId || !input.trim()}
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
