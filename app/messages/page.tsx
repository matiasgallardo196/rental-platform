"use client";

import { useSession } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChatWindow } from "@/components/messaging/chat-window";
import { MessageSquare } from "lucide-react";
import { getJson } from "@/lib/api";

export default function MessagesPage() {
  const session = useSession();
  const [conversation, setConversation] = useState<any | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!session?.user) return;
      const userId = session.user.id;
      const data = await getJson<any | null>(
        `/messages?userId=${encodeURIComponent(userId)}`,
        null
      );
      setConversation(data);
    };
    load();
  }, [session]);

  if (!conversation) {
    return (
      <div className="container mx-auto flex min-h-screen items-center justify-center p-8">
        <Card className="max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageSquare className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="mb-2 text-lg font-medium">
              No hay conversaciones activas
            </p>
            <p className="text-center text-sm text-muted-foreground">
              Los mensajes con anfitriones aparecerán aquí después de hacer una
              reserva
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto min-h-screen p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-3xl font-bold">Mensajes</h1>
        <ChatWindow
          bookingId={conversation.bookingId}
          hostName={conversation.hostName}
        />
      </div>
    </div>
  );
}
