"use client";

import { useEffect, useState } from "react";
import {
  NEXT_PUBLIC_API_URL as API_URL,
  NEXT_PUBLIC_SUPPORT_EMAIL,
} from "@/lib/env.loader";
import { buildApiUrl } from "@/lib/api";

export function ApiStatusGate({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<"checking" | "ok" | "missing" | "down">(
    "checking"
  );

  useEffect(() => {
    if (!API_URL) {
      setStatus("missing");
      return;
    }

    let aborted = false;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);

    const check = async () => {
      const url = buildApiUrl("/health");
      if (!url) {
        if (!aborted) setStatus("missing");
        return;
      }
      try {
        const res = await fetch(url, {
          method: "GET",
          cache: "no-store",
          signal: controller.signal,
        });
        if (!aborted) setStatus(res.ok ? "ok" : "down");
      } catch {
        if (!aborted) setStatus("down");
      } finally {
        clearTimeout(timeout);
      }
    };

    check();
    return () => {
      aborted = true;
      clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  if (status === "ok") return <>{children}</>;

  if (status === "checking") {
    return (
      <div className="container mx-auto flex min-h-screen items-center justify-center p-8">
        <div className="text-center text-muted-foreground">Cargando…</div>
      </div>
    );
  }

  const email = NEXT_PUBLIC_SUPPORT_EMAIL || "soporte@example.com";
  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center p-8">
      <div className="max-w-md rounded-lg border p-6 text-center">
        <h1 className="mb-2 text-2xl font-semibold">Servicio no disponible</h1>
        <p className="mb-4 text-sm text-muted-foreground">
          Nuestro servidor está fuera de servicio temporalmente. Por favor,
          intenta nuevamente más tarde.
        </p>
        <p className="text-sm">
          ¿Necesitas ayuda? Escríbenos a{" "}
          <a className="text-primary underline" href={`mailto:${email}`}>
            {email}
          </a>
        </p>
      </div>
    </div>
  );
}
