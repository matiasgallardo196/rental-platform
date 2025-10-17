"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send } from "lucide-react";
import { format } from "date-fns";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
  isCurrentUser: boolean;
}

interface ChatWindowProps {
  bookingId: string;
  hostName: string;
  hostAvatar?: string;
}

export function ChatWindow({
  bookingId,
  hostName,
  hostAvatar,
}: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      senderId: "host-1",
      senderName: hostName,
      senderAvatar: hostAvatar,
      content:
        "¡Hola! Bienvenido a mi propiedad. Avísame si tienes alguna pregunta.",
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      isCurrentUser: false,
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: "current-user",
      senderName: "Tú",
      content: newMessage,
      timestamp: new Date().toISOString(),
      isCurrentUser: true,
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage("");

    // In a real app, send via Socket.io
    // socket.emit('send_message', { bookingId, content: newMessage })
  };

  return (
    <Card className="flex h-[600px] flex-col">
      <CardHeader className="border-b">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={hostAvatar || "/placeholder.svg"} />
            <AvatarFallback>
              {hostName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg">{hostName}</CardTitle>
            <p className="text-sm text-muted-foreground">Host</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.isCurrentUser ? "flex-row-reverse" : ""
              }`}
            >
              {!message.isCurrentUser && (
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={message.senderAvatar || "/placeholder.svg"}
                  />
                  <AvatarFallback>
                    {message.senderName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              )}

              <div
                className={`max-w-[70%] space-y-1 ${
                  message.isCurrentUser ? "items-end" : ""
                }`}
              >
                <div
                  className={`rounded-lg px-4 py-2 ${
                    message.isCurrentUser
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
                <p className="px-1 text-xs text-muted-foreground">
                  {format(new Date(message.timestamp), "h:mm a")}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>

      <div className="border-t p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2"
        >
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
}
