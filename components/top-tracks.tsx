"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { StaggerList, StaggerItem } from "@/components/motion-wrappers";
import type { SpotifyTrack } from "@/lib/types";

export function TopTracks({
  tracks,
  loading,
}: {
  tracks: SpotifyTrack[];
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <Skeleton className="h-8 w-8 rounded" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <StaggerList
      className="space-y-2"
      listKey={tracks.map((t) => t.id).join(",")}
    >
      {tracks.map((track, i) => (
        <StaggerItem key={track.id} className="flex items-center gap-2.5">
          <span className="text-xs text-muted-foreground w-4 text-right shrink-0">
            {i + 1}
          </span>
          <Avatar className="h-8 w-8 rounded shrink-0">
            <AvatarImage src={track.album.images?.[2]?.url ?? track.album.images?.[0]?.url} />
            <AvatarFallback className="text-xs lowercase rounded">
              {track.name.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-sm lowercase truncate leading-tight">{track.name}</p>
            <p className="text-xs text-muted-foreground lowercase truncate">
              {track.artists.map((a) => a.name).join(", ")}
            </p>
          </div>
        </StaggerItem>
      ))}
    </StaggerList>
  );
}
