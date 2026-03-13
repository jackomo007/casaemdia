import "server-only";

import { createServerClient } from "@supabase/ssr";
import type { CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

import { requireSupabaseConfig } from "@/lib/auth/supabase-config";

export async function createSupabaseServerClient() {
  const config = requireSupabaseConfig();
  const cookieStore = await cookies();

  return createServerClient(config.url, config.anonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        cookieStore.set(name, value, options);
      },
      remove(name: string, options: CookieOptions) {
        cookieStore.set(name, "", options);
      },
    },
  });
}
