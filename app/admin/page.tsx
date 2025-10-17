"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Calendar, TrendingUp, Users, Mail } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [overview, setOverview] = useState<any>(null);
  const [msgs, setMsgs] = useState<any[]>([]);

  useEffect(() => {
    if (!session?.user) return;
    const load = async () => {
      const [o, m] = await Promise.all([
        fetch(`${API_URL}/admin/overview`, { cache: "no-store" }).then((r) =>
          r.json()
        ),
        fetch(`${API_URL}/admin/messages`, { cache: "no-store" }).then((r) =>
          r.json()
        ),
      ]);
      setOverview(o);
      setMsgs(m.messages || []);
    };
    load();
  }, [session]);

  if (!session?.user || (session.user as any).role !== "admin") {
    return (
      <div className="container mx-auto min-h-screen p-8">
        <p className="text-muted-foreground">Not authorized</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto min-h-screen p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your platform and monitor performance
        </p>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview?.users ?? 0}</div>
            <p className="text-xs text-muted-foreground">
              G:{overview?.guests ?? 0} H:{overview?.hosts ?? 0} A:
              {overview?.admins ?? 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Properties</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overview?.properties ?? 0}
            </div>
            <p className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              Overview
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview?.bookings ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview?.messages ?? 0}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Platform Overview</CardTitle>
              <CardDescription>Key counts at a glance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[150px] w-full rounded-lg bg-muted/50" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Support Threads</CardTitle>
              <CardDescription>Latest messages</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {msgs.map((m) => (
                  <li key={m.id} className="rounded-md border p-2">
                    <span className="font-medium">{m.fromUserId}</span> →{" "}
                    {m.toUserId}
                    <div className="text-muted-foreground">{m.text}</div>
                  </li>
                ))}
                {msgs.length === 0 && (
                  <div className="text-muted-foreground">No messages</div>
                )}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
