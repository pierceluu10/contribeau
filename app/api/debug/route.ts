import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function GET() {
  const checks: Record<string, unknown> = {};

  // 1. Check cookie
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;
  checks.cookie = userId ? `present (${userId.slice(0, 8)}...)` : "MISSING";

  // 2. Check env vars (existence only, not values)
  checks.env = {
    NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    SPOTIFY_CLIENT_ID: !!process.env.SPOTIFY_CLIENT_ID,
    SPOTIFY_CLIENT_SECRET: !!process.env.SPOTIFY_CLIENT_SECRET,
    SPOTIFY_REDIRECT_URI: process.env.SPOTIFY_REDIRECT_URI,
    NODE_ENV: process.env.NODE_ENV,
  };

  // 3. Check Supabase connectivity
  if (userId) {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("id, display_name")
        .eq("id", userId)
        .single();
      checks.supabase = error
        ? { status: "ERROR", error: error.message }
        : { status: "OK", user: data?.display_name };
    } catch (e) {
      checks.supabase = { status: "EXCEPTION", error: String(e) };
    }

    // 4. Check history count
    try {
      const { count, error } = await supabase
        .from("listening_history")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);
      checks.history = error
        ? { status: "ERROR", error: error.message }
        : { status: "OK", count };
    } catch (e) {
      checks.history = { status: "EXCEPTION", error: String(e) };
    }
  }

  return NextResponse.json(checks, {
    headers: { "Cache-Control": "no-store" },
  });
}
