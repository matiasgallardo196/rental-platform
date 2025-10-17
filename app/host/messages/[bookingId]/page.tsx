"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function HostMessageThreadPage() {
  const { data: session } = useSession();
  const params = useParams();
  const bookingId = String(params?.bookingId || "");
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      if (!session?.user || (session.user as any).role !== "host" || !bookingId)
        return;
      const hostId = (session.user as any).id;
      const res = await fetch(
        `${API_URL}/hosts/${hostId}/messages/${bookingId}`,
        { cache: "no-store" }
      );
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    };
    load();
  }, [session, bookingId]);

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
              <BreadcrumbLink href="/host/messages">Messages</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Booking {bookingId}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <h1 className="mb-4 text-3xl font-bold">Conversation</h1>
      <div className="space-y-3">
        {messages.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No messages
            </CardContent>
          </Card>
        ) : (
          messages.map((m) => (
            <Card key={m.id}>
              <CardHeader>
                <CardTitle className="text-sm">
                  {m.fromUserId} → {m.toUserId}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <div className="text-muted-foreground">{m.at}</div>
                <div>{m.text}</div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

