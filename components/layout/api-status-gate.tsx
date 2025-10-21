"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  NEXT_PUBLIC_API_URL as API_URL,
  NEXT_PUBLIC_SUPPORT_EMAIL,
} from "@/lib/env.loader";
import { buildApiUrl } from "@/lib/api";
// Ilustración inline para un tono más amigable (sin dependencias adicionales)

export function ApiStatusGate({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<"ok" | "missing" | "down">(
    API_URL ? "down" : "missing"
  );
  const [progress, setProgress] = useState(0);
  const [probing, setProbing] = useState(false);
  const [blink, setBlink] = useState(false);
  const RETRY_MS = 10000;
  const PROGRESS_TICK_MS = 100;
  const startRef = useRef<number>(Date.now());

  const probeOnce = useCallback(async (): Promise<boolean> => {
    if (!API_URL) return false;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);
    try {
      const url = buildApiUrl("/health");
      if (!url) return false;
      const res = await fetch(url, {
        method: "GET",
        cache: "no-store",
        signal: controller.signal,
      });
      return res.ok;
    } catch {
      return false;
    } finally {
      clearTimeout(timeout);
      controller.abort();
    }
  }, []);

  useEffect(() => {
    // iniciar ciclo visual
    startRef.current = Date.now();
    setProgress(0);
  }, []);

  // Progreso hacia el próximo intento y reintento automático al llegar al 100%
  useEffect(() => {
    if (status === "ok") return;
    const tick = setInterval(() => {
      const elapsed = Date.now() - startRef.current;
      const pct = Math.max(0, Math.min(100, (elapsed / RETRY_MS) * 100));
      setProgress(pct);
      if (pct >= 100 && !probing) {
        // ejecutar intento sin salir de esta vista
        setProbing(true);
        void (async () => {
          const ok = await probeOnce();
          if (ok) {
            setStatus("ok");
            return;
          }
          // fallo: feedback y reinicio del ciclo
          setBlink(true);
          setTimeout(() => setBlink(false), 400);
          startRef.current = Date.now();
          setProgress(0);
          setProbing(false);
          // seguimos en la vista de espera
        })();
      }
    }, PROGRESS_TICK_MS);
    return () => clearInterval(tick);
  }, [status, probing, probeOnce]);

  // Reiniciar contador cuando entramos en estado no-ok
  useEffect(() => {
    if (status === "down" || status === "missing") {
      startRef.current = Date.now();
      setProgress(0);
    }
  }, [status]);

  if (status === "ok") return <>{children}</>;

  const email = NEXT_PUBLIC_SUPPORT_EMAIL || "soporte@example.com";
  const title =
    status === "missing"
      ? "¡Ups! Falta una cosita"
      : "¡Ups! Tuvimos un problemita";
  const description =
    status === "missing"
      ? "Necesitamos configurar la URL del servidor para continuar."
      : "Estamos haciendo una pequeña pausa. Ya estamos trabajando para volver en breve.";
  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center p-8">
      <div className="w-full max-w-md overflow-hidden rounded-xl border bg-background shadow-sm">
        <div className="flex flex-col items-center gap-3 border-b p-6 text-center">
          <div className="rounded-full bg-[#D21F3C]/10 p-4 text-[#D21F3C] animate-bounce">
            <svg
              width="48"
              height="48"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <rect
                x="8"
                y="26"
                width="48"
                height="28"
                rx="6"
                fill="currentColor"
                opacity="0.2"
              />
              <path
                d="M12 30l20-14 20 14"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <rect
                x="24"
                y="38"
                width="16"
                height="16"
                rx="2"
                fill="currentColor"
              />
              <circle cx="22" cy="46" r="2" fill="currentColor" />
              <circle cx="42" cy="46" r="2" fill="currentColor" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold">{title}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
          <p className="text-xs text-muted-foreground">
            AlojaPy está reintentando conectarse automáticamente…
          </p>
          <div className="mt-1 flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full bg-[#D21F3C] animate-bounce"
              style={{ animationDelay: "0ms" }}
            />
            <span
              className="h-2 w-2 rounded-full bg-[#D21F3C] animate-bounce"
              style={{ animationDelay: "150ms" }}
            />
            <span
              className="h-2 w-2 rounded-full bg-[#D21F3C] animate-bounce"
              style={{ animationDelay: "300ms" }}
            />
          </div>
        </div>
        <div className="space-y-4 p-6 text-center">
          <div className="mx-auto h-2 w-56 overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full rounded-full transition-[width,background-color] duration-100 ease-linear ${
                blink ? "bg-amber-500" : "bg-[#D21F3C]"
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-xs text-muted-foreground">
            ¿Necesitas ayuda? Escríbenos a{" "}
            <a className="text-primary underline" href={`mailto:${email}`}>
              {email}
            </a>
          </div>
          <div className="text-xs text-muted-foreground">
            Gracias por tu paciencia ♥
          </div>
        </div>
      </div>
    </div>
  );
}
