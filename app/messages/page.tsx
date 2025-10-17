"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChatWindow } from "@/components/messaging/chat-window";
import { MessageSquare } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function MessagesPage() {
  const { data: session } = useSession();
  const [conversation, setConversation] = useState<any | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!session?.user) return;
      const userId = (session.user as any).id;
      const res = await fetch(
        `${API_URL}/messages?userId=${encodeURIComponent(userId)}`,
        { cache: "no-store" }
      );
      if (res.ok) {
        const data = await res.json();
        setConversation(data);
      }
    };
    load();
  }, [session]);

  if (!conversation) {
    return (
      <div className="container mx-auto flex min-h-screen items-center justify-center p-8">
        <Card className="max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageSquare className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="mb-2 text-lg font-medium">No active conversations</p>
            <p className="text-center text-sm text-muted-foreground">
              Messages with hosts will appear here after you make a booking
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto min-h-screen p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-3xl font-bold">Messages</h1>
        <ChatWindow
          bookingId={conversation.bookingId}
          hostName={conversation.hostName}
        />
      </div>
    </div>
  );
}
