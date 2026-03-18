import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase";
import { getValidToken, getTopItems } from "@/lib/spotify";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (!user) {
    return NextResponse.json({ error: "user not found" }, { status: 404 });
  }

  const type = req.nextUrl.searchParams.get("type") as "artists" | "tracks";
  const timeRange = (req.nextUrl.searchParams.get("time_range") ?? "short_term") as
    "short_term" | "medium_term" | "long_term";

  if (type !== "artists" && type !== "tracks") {
    return NextResponse.json({ error: "invalid type" }, { status: 400 });
  }

  const token = await getValidToken(user);
  const data = await getTopItems(token, type, timeRange);

  return NextResponse.json(data, {
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}
