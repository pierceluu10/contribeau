"use client";

import { useRef, useCallback, useState } from "react";
import { toPng } from "html-to-image";
import { Download, X, Share2 } from "lucide-react";
import { ShareCard } from "./share-card";

interface ShareButtonProps {
  displayName: string;
  days: { date: string; totalMs: number }[];
  totalTracks: number;
  totalMinutes: number;
  activeDays: number;
}

export function ShareButton({
  displayName,
  days,
  totalTracks,
  totalMinutes,
  activeDays,
}: ShareButtonProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [timeRange] = useState("short_term");
  const [topArtists, setTopArtists] = useState<string[]>([]);
  const [topTracks, setTopTracks] = useState<string[]>([]);

  const handlePreview = useCallback(async () => {
    if (!cardRef.current) return;
    setLoading(true);
    try {
      // Fetch top artists + tracks for the card
      const [artistRes, trackRes] = await Promise.all([
        fetch(`/api/spotify/top?type=artists&time_range=${timeRange}`),
        fetch(`/api/spotify/top?type=tracks&time_range=${timeRange}`),
      ]);
      if (!artistRes.ok || !trackRes.ok) throw new Error("Failed to fetch");
      const artistData = await artistRes.json();
      const trackData = await trackRes.json();

      const artists: string[] = (artistData.items ?? []).slice(0, 5).map(
        (a: { name: string }) => a.name
      );
      const tracks: string[] = (trackData.items ?? []).slice(0, 5).map(
        (t: { name: string }) => t.name
      );

      setTopArtists(artists);
      setTopTracks(tracks);

      // Wait a tick for React to re-render with the new data before capturing
      await new Promise((r) => setTimeout(r, 100));

      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
      });
      setPreview(dataUrl);
    } catch {
      /* non-critical, fail silently */
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  const handleDownload = useCallback(() => {
    if (!preview) return;
    const link = document.createElement("a");
    link.download = `contribeau-${displayName.toLowerCase().replace(/\s+/g, "-")}.png`;
    link.href = preview;
    link.click();
  }, [preview, displayName]);

  return (
    <>
      <button
        onClick={handlePreview}
        disabled={loading}
        className="inline-flex items-center justify-center h-8 w-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors disabled:opacity-50"
        title="Share stats"
      >
        <Share2 className="h-4 w-4" />
      </button>

      {/* offscreen share card — always in DOM for capture */}
      <div className="fixed left-[-9999px] top-0">
        <ShareCard
          ref={cardRef}
          displayName={displayName}
          days={days}
          totalTracks={totalTracks}
          totalMinutes={totalMinutes}
          activeDays={activeDays}
          topArtists={topArtists}
          topTracks={topTracks}
          timeRange={timeRange}
        />
      </div>

      {/* preview modal */}
      {preview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setPreview(null)}
        >
          <div
            className="relative max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={preview}
              alt="Share card preview"
              className="rounded-lg shadow-2xl max-w-full"
              style={{ maxHeight: "80vh" }}
            />
            <div className="flex gap-2 mt-3 justify-end">
              <button
                onClick={() => setPreview(null)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-sm hover:bg-accent transition-colors"
              >
                <X className="h-4 w-4" />
                close
              </button>
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#1db954] text-white text-sm hover:bg-[#1aa34a] transition-colors"
              >
                <Download className="h-4 w-4" />
                download
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
