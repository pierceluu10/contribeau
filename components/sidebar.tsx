"use client";

import { useEffect, useState, useCallback } from "react";
import { CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ShinyCard } from "@/components/animata/card/shiny-card";
import { TimeRangeTabs } from "./time-range-tabs";
import { TopArtists } from "./top-artists";
import { TopTracks } from "./top-tracks";
import type { SpotifyArtist, SpotifyTrack } from "@/lib/types";

export function Sidebar() {
  const [timeRange, setTimeRange] = useState("short_term");
  const [artists, setArtists] = useState<SpotifyArtist[]>([]);
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async (range: string) => {
    setLoading(true);
    try {
      const [artistRes, trackRes] = await Promise.all([
        fetch(`/api/spotify/top?type=artists&time_range=${range}`),
        fetch(`/api/spotify/top?type=tracks&time_range=${range}`),
      ]);
      if (!artistRes.ok || !trackRes.ok) throw new Error("Failed to fetch");
      const artistData = await artistRes.json();
      const trackData = await trackRes.json();
      setArtists(artistData.items ?? []);
      setTracks(trackData.items ?? []);
    } catch {
      /* non-critical, fail silently */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(timeRange);
  }, [timeRange, fetchData]);

  return (
    <ShinyCard>
      <div className="px-3 pt-3">
        <TimeRangeTabs value={timeRange} onChange={setTimeRange} />
      </div>
      <Tabs defaultValue="artists">
        <div className="px-3 pt-2">
          <TabsList className="w-auto">
            <TabsTrigger value="artists" className="lowercase text-xs px-4">
              artists
            </TabsTrigger>
            <TabsTrigger value="tracks" className="lowercase text-xs px-4">
              tracks
            </TabsTrigger>
          </TabsList>
        </div>
        <CardContent className="pt-2 pb-3">
          <TabsContent value="artists" className="mt-0">
            <TopArtists artists={artists} loading={loading} />
          </TabsContent>
          <TabsContent value="tracks" className="mt-0">
            <TopTracks tracks={tracks} loading={loading} />
          </TabsContent>
        </CardContent>
      </Tabs>
    </ShinyCard>
  );
}
