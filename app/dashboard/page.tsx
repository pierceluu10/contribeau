import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Heatmap } from "@/components/heatmap";
import { Sidebar } from "@/components/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { VantaBackground } from "@/components/vanta-background";
import { FadeIn } from "@/components/motion-wrappers";
import { ShareButton } from "@/components/share-button";
import { StatsCards } from "@/components/stats-cards";
import { NowPlaying } from "@/components/now-playing";
import { SyncOnLoad } from "@/components/sync-on-load";
import { RefreshButton } from "@/components/refresh-button";
import { TimeRangeProvider } from "@/components/time-range-provider";
import { LogOut } from "lucide-react";
import type { HeatmapDay } from "@/lib/types";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;

  if (!userId) {
    redirect("/");
  }

  const { data: user, error: userError } = await supabase
    .from("users")
    .select("display_name, avatar_url")
    .eq("id", userId)
    .single();

  if (userError) {
    console.error("Dashboard user fetch error:", userError);
  }

  if (!user) {
    redirect("/");
  }

  // fetch listening history aggregated by day
  const { data: history, error: historyError } = await supabase
    .from("listening_history")
    .select("played_at, duration_ms, artist_name")
    .eq("user_id", userId)
    .order("played_at", { ascending: false });

  if (historyError) {
    console.error("Dashboard history fetch error:", historyError);
  }

  // aggregate by day
  const dayMap = new Map<
    string,
    { totalMs: number; trackCount: number; artistCounts: Map<string, number> }
  >();

  for (const row of history ?? []) {
    const date = new Date(row.played_at).toISOString().slice(0, 10);
    const entry = dayMap.get(date) ?? {
      totalMs: 0,
      trackCount: 0,
      artistCounts: new Map(),
    };
    entry.totalMs += row.duration_ms;
    entry.trackCount += 1;
    entry.artistCounts.set(
      row.artist_name,
      (entry.artistCounts.get(row.artist_name) ?? 0) + 1
    );
    dayMap.set(date, entry);
  }

  const days: HeatmapDay[] = Array.from(dayMap.entries()).map(
    ([date, entry]) => {
      let topArtist: string | null = null;
      let maxCount = 0;
      for (const [artist, count] of entry.artistCounts) {
        if (count > maxCount) {
          maxCount = count;
          topArtist = artist;
        }
      }
      return {
        date,
        totalMs: entry.totalMs,
        trackCount: entry.trackCount,
        topArtist,
      };
    }
  );

  const shareDays = days.map((d) => ({ date: d.date, totalMs: d.totalMs }));

  return (
    <TimeRangeProvider days={days}>
      <main className="h-screen flex flex-col overflow-hidden p-4 md:p-6 relative">
        {/* Sync recent tracks on load */}
        <SyncOnLoad />
        {/* Vanta birds background */}
        <VantaBackground />

        {/* content above background */}
        <div className="relative z-10 flex flex-col h-full gap-3">
          {/* header */}
          <FadeIn delay={0}>
            <div className="flex items-center justify-between max-w-screen-2xl mx-auto w-full">
              <div>
                <h1 className="text-2xl font-bold lowercase">
                  {user.display_name}&apos;s listening activity
                </h1>
                <p className="text-xs text-muted-foreground lowercase">
                  keep listening to see more data!!
                </p>
              </div>
              <div className="flex items-center gap-2">
                <RefreshButton />
                <ShareButton
                  displayName={user.display_name}
                  days={shareDays}
                />
                <ThemeToggle />
                <Link
                  href="/api/auth/logout"
                  className="inline-flex items-center justify-center h-8 w-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </FadeIn>

          {/* heatmap — full width */}
          <FadeIn delay={0.15}>
            <div className="max-w-screen-2xl mx-auto w-full">
              <Heatmap days={days} />
            </div>
          </FadeIn>

          {/* sidebar + stats below */}
          <FadeIn delay={0.3} className="flex-1 min-h-0 overflow-hidden">
            <div className="max-w-screen-2xl mx-auto w-full flex flex-col lg:flex-row lg:items-start gap-4 h-full overflow-hidden">
              {/* top artists/tracks — left */}
              <aside className="lg:w-96 shrink-0 overflow-y-auto h-full">
                <Sidebar />
              </aside>

              {/* summary stats — stacked to the right */}
              <div className="flex flex-col gap-3 lg:w-48 shrink-0">
                <StatsCards />
                <NowPlaying />
              </div>
            </div>
          </FadeIn>
        </div>
      </main>
    </TimeRangeProvider>
  );
}
