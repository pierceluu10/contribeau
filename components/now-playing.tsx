"use client";

import { useEffect, useState } from "react";
import { ShinyCard } from "@/components/animata/card/shiny-card";

interface NowPlayingData {
  is_playing: boolean;
  track_name?: string;
  artist_name?: string;
  progress_ms?: number;
  duration_ms?: number;
}

export function NowPlaying() {
  const [data, setData] = useState<NowPlayingData | null>(null);

  async function fetchNowPlaying() {
    try {
      const res = await fetch("/api/spotify/currently-playing", { credentials: "include" });
      if (!res.ok) return;
      const json = await res.json();
      setData(json);
    } catch {
      /* non-critical, fail silently */
    }
  }

  useEffect(() => {
    fetchNowPlaying();
    const interval = setInterval(fetchNowPlaying, 15_000);
    return () => clearInterval(interval);
  }, []);

  const progress =
    data?.is_playing && data.duration_ms
      ? Math.round((data.progress_ms! / data.duration_ms) * 100)
      : 0;

  return (
    <ShinyCard className="px-3 py-2">
      <p className="text-xs text-muted-foreground lowercase">now playing</p>
      {data?.is_playing ? (
        <div className="mt-1">
          <p className="text-sm font-bold lowercase truncate leading-tight">
            {data.track_name}
          </p>
          <p className="text-xs text-muted-foreground lowercase truncate">
            {data.artist_name}
          </p>
          {/* progress bar */}
          <div className="mt-2 h-0.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-[#1db954] transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      ) : (
        <p className="text-sm font-bold lowercase text-muted-foreground">
          not playing
        </p>
      )}
    </ShinyCard>
  );
}
