"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { StaggerList, StaggerItem } from "@/components/motion-wrappers";
import type { SpotifyArtist } from "@/lib/types";

export function TopArtists({
  artists,
  loading,
}: {
  artists: SpotifyArtist[];
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-32" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <StaggerList
      className="space-y-2"
      listKey={artists.map((a) => a.id).join(",")}
    >
      {artists.map((artist, i) => (
        <StaggerItem key={artist.id} className="flex items-center gap-2.5">
          <span className="text-xs text-muted-foreground w-4 text-right shrink-0">
            {i + 1}
          </span>
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarImage src={artist.images?.[2]?.url ?? artist.images?.[0]?.url} />
            <AvatarFallback className="text-xs lowercase">
              {artist.name.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm lowercase truncate">{artist.name}</span>
        </StaggerItem>
      ))}
    </StaggerList>
  );
}
