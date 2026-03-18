import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getValidToken, getRecentlyPlayed } from "@/lib/spotify";

export const fetchCache = "force-no-store";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { data: users, error } = await supabase
    .from("users")
    .select("*");

  if (error || !users) {
    return NextResponse.json({ error: "failed to fetch users" }, { status: 500 });
  }

  let totalInserted = 0;

  for (const user of users) {
    try {
      const token = await getValidToken(user);
      const data = await getRecentlyPlayed(token, user.last_polled_cursor);

      if (!data.items?.length) continue;

      const rows = data.items.map((item: {
        track: {
          id: string;
          name: string;
          artists: { name: string }[];
          album: { name: string; images: { url: string }[] };
          duration_ms: number;
        };
        played_at: string;
      }) => ({
        user_id: user.id,
        track_id: item.track.id,
        track_name: item.track.name,
        artist_name: item.track.artists.map((a: { name: string }) => a.name).join(", "),
        album_name: item.track.album.name,
        album_image_url: item.track.album.images?.[0]?.url ?? null,
        duration_ms: item.track.duration_ms,
        played_at: item.played_at,
      }));

      const { error: insertError } = await supabase
        .from("listening_history")
        .upsert(rows, { onConflict: "user_id,played_at", ignoreDuplicates: true });

      if (insertError) {
        console.error(`Insert error for user ${user.id}:`, insertError);
        continue;
      }

      totalInserted += rows.length;

      // update cursor to the latest played_at timestamp
      const latestMs = Math.max(
        ...data.items.map((i: { played_at: string }) =>
          new Date(i.played_at).getTime()
        )
      );

      await supabase
        .from("users")
        .update({ last_polled_cursor: latestMs })
        .eq("id", user.id);
    } catch (err) {
      console.error(`Error polling user ${user.id}:`, err);
    }
  }

  return NextResponse.json({ polled: users.length, inserted: totalInserted });
}
