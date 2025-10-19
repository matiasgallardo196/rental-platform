"use client";

import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";

export const createSupabaseBrowser = () => createPagesBrowserClient();
