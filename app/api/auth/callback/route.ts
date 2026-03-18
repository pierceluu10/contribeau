import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForTokens, getSpotifyProfile } from "@/lib/spotify";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  if (!code) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  let tokens;
  try {
    tokens = await exchangeCodeForTokens(code);
  } catch (e) {
    console.error("Token exchange failed:", e);
    return NextResponse.redirect(new URL("/", req.url));
  }

  const profile = await getSpotifyProfile(tokens.access_token);
  const expiresAt = new Date(
    Date.now() + tokens.expires_in * 1000
  ).toISOString();

  const { data, error } = await supabase
    .from("users")
    .upsert(
      {
        spotify_id: profile.id,
        display_name: profile.display_name?.toLowerCase() ?? profile.id,
        avatar_url: profile.images?.[0]?.url ?? null,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        token_expires_at: expiresAt,
      },
      { onConflict: "spotify_id" }
    )
    .select("id")
    .single();

  if (error || !data) {
    console.error("Supabase upsert error:", error);
    return NextResponse.redirect(new URL("/", req.url));
  }

  const host = req.headers.get("host") || "127.0.0.1:3000";
  const protocol = req.headers.get("x-forwarded-proto") || "http";
  const origin = `${protocol}://${host}`;

  const response = NextResponse.redirect(new URL("/dashboard", origin));
  response.cookies.set("user_id", data.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });

  return response;
}
