"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Upload, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { buildApiUrl } from "@/lib/api";

interface AvatarUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  name?: string;
}

export function AvatarUploader({ value, onChange, name }: AvatarUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = useSupabaseClient();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      await uploadFile(file);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadFile(file);
    }
  };

  const uploadFile = async (file: File) => {
    setError(null);
    const MAX_BYTES = 5 * 1024 * 1024;
    const allowed = new Set([
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/avif",
    ]);

    if (!allowed.has(file.type)) {
      setError("Formato no permitido. Usa JPG, PNG, WEBP o AVIF.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("El archivo supera 5 MB.");
      return;
    }

    setIsUploading(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) throw new Error("No hay sesión válida. Inicia sesión.");

      const presignUrl = buildApiUrl(`/uploads/avatar/presign`);
      if (!presignUrl) throw new Error("Falta NEXT_PUBLIC_API_URL.");

      const presignRes = await fetch(presignUrl, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ contentType: file.type, size: file.size }),
      });
      if (!presignRes.ok) {
        const txt = await presignRes.text().catch(() => "");
        throw new Error(txt || "No se pudo firmar la URL");
      }
      const { url, key } = (await presignRes.json()) as {
        url: string;
        key: string;
        publicUrl: string;
      };

      const putRes = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!putRes.ok) throw new Error("Fallo al subir a R2");

      const confirmUrl = buildApiUrl(`/profile/avatar/confirm`);
      if (!confirmUrl) throw new Error("Falta NEXT_PUBLIC_API_URL.");
      const confirmRes = await fetch(confirmUrl, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ key }),
      });
      if (!confirmRes.ok) throw new Error("No se pudo confirmar el avatar");
      const { publicUrl } = (await confirmRes.json()) as {
        ok: boolean;
        publicUrl: string;
      };
      const finalUrl = `${publicUrl}?t=${Date.now()}`;
      onChange(finalUrl);
      try {
        window.dispatchEvent(
          new CustomEvent("avatar-updated", { detail: { url: finalUrl } })
        );
      } catch {}
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : "Error subiendo imagen");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    onChange("");
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className={cn(
          "relative",
          isDragging && "ring-2 ring-primary ring-offset-2"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Avatar className="h-32 w-32">
          <AvatarImage
            src={value || "/placeholder.svg"}
            alt={name}
            referrerPolicy="no-referrer"
            onError={(e) => {
              const img = e.currentTarget as HTMLImageElement;
              if (img.src.endsWith("/placeholder.svg")) return;
              img.src = "/placeholder.svg";
            }}
          />
          <AvatarFallback className="text-2xl">
            {getInitials(name)}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          <Upload className="mr-2 h-4 w-4" />
          {isUploading ? "Subiendo..." : "Subir foto"}
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />

      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : (
        <p className="text-xs text-muted-foreground">
          Arrastra y suelta o haz clic para subir
        </p>
      )}
    </div>
  );
}
