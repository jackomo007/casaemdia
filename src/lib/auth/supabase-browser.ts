"use client";

import { createBrowserClient } from "@supabase/ssr";

import { requireSupabaseConfig } from "@/lib/auth/supabase-config";

export function createSupabaseBrowserClient() {
  const config = requireSupabaseConfig();
  return createBrowserClient(config.url, config.anonKey);
}
