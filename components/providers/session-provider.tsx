"use client";

import { useMemo } from "react";
import type React from "react";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { createSupabaseBrowser } from "@/lib/supabase-browser";

export function Providers({ children }: { children: React.ReactNode }) {
  const supabase = useMemo(() => createSupabaseBrowser(), []);
  return (
    <SessionContextProvider supabaseClient={supabase}>
      {children}
    </SessionContextProvider>
  );
}
