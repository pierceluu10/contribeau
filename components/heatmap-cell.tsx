"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { HeatmapDay } from "@/lib/types";
import { formatMs, getHeatmapColor } from "@/lib/utils";

export function HeatmapCell({ day }: { day: HeatmapDay | null }) {
  if (!day) {
    return <div className="w-[18px] h-[18px]" />;
  }

  return (
    <Tooltip>
      <TooltipTrigger>
        <div
          className="w-[18px] h-[18px] rounded-[2px] cursor-pointer transition-opacity hover:opacity-80"
          style={{ backgroundColor: getHeatmapColor(day.totalMs) }}
        />
      </TooltipTrigger>
      <TooltipContent className="lowercase text-xs">
        <p className="font-medium">{day.date}</p>
        {day.totalMs > 0 ? (
          <>
            <p>{formatMs(day.totalMs)} listened</p>
            <p>{day.trackCount} tracks</p>
            {day.topArtist && <p>top: {day.topArtist}</p>}
          </>
        ) : (
          <p>no listening data</p>
        )}
      </TooltipContent>
    </Tooltip>
  );
}
