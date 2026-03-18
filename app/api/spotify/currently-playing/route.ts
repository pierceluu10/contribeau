import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase";
import { getValidToken, getCurrentlyPlaying } from "@/lib/spotify";

export async function GET() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: user } = await supabase
    .from("users")
    .select("id, access_token, refresh_token, token_expires_at")
    .eq("id", userId)
    .single();

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  try {
    const token = await getValidToken(user);
    const data = await getCurrentlyPlaying(token);

    if (!data) {
      return NextResponse.json({ is_playing: false });
    }

    const item = data.item;
    if (!item) {
      return NextResponse.json({ is_playing: false });
    }

    return NextResponse.json({
      is_playing: data.is_playing,
      track_name: item.name,
      artist_name: item.artists?.map((a: { name: string }) => a.name).join(", ") ?? "",
      album_image_url: item.album?.images?.[2]?.url ?? item.album?.images?.[0]?.url ?? null,
      progress_ms: data.progress_ms ?? 0,
      duration_ms: item.duration_ms ?? 0,
    });
  } catch (err) {
    console.error("currently-playing error:", err);
    // 403 means missing scope — return gracefully
    return NextResponse.json({ is_playing: false });
  }
}
