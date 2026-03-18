import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";
import { getValidToken, getRecentlyPlayed } from "@/lib/spotify";

export const fetchCache = "force-no-store";

// Syncs recent tracks for the currently logged-in user.
// Called client-side on dashboard load so data is always fresh.
export async function POST() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: user } = await supabase
    .from("users")
    .select("id, access_token, refresh_token, token_expires_at, last_polled_cursor")
    .eq("id", userId)
    .single();

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  try {
    const token = await getValidToken(user);
    const data = await getRecentlyPlayed(token, user.last_polled_cursor);

    const items = data?.items ?? [];
    if (items.length === 0) {
      revalidatePath("/dashboard");
      return NextResponse.json({ inserted: 0 });
    }

    const rows = items.map((item: {
      track: {
        id: string;
        name: string;
        artists: { name: string }[];
        album: { name: string; images: { url: string }[] };
        duration_ms: number;
      };
      played_at: string;
    }) => ({
      user_id: userId,
      track_id: item.track.id,
      track_name: item.track.name,
      artist_name: item.track.artists.map((a: { name: string }) => a.name).join(", "),
      album_name: item.track.album.name,
      album_image_url: item.track.album.images?.[0]?.url ?? null,
      duration_ms: item.track.duration_ms,
      played_at: item.played_at,
    }));

    const { error } = await supabase
      .from("listening_history")
      .upsert(rows, { onConflict: "user_id,played_at" });

    if (error) {
      console.error("Sync upsert error:", error);
    }

    // Update cursor to the most recent played_at
    const latest = items[0]?.played_at;
    if (latest) {
      await supabase
        .from("users")
        .update({ last_polled_cursor: new Date(latest).getTime() })
        .eq("id", userId);
    }

    revalidatePath("/dashboard");
    return NextResponse.json({ inserted: rows.length });
  } catch (err) {
    console.error("Sync error:", err);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}
