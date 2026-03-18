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
      <TooltipContent className="lowercase text-xs flex flex-col gap-0.5">
        <span className="font-medium">{day.date}</span>
        {day.totalMs > 0 ? (
          <>
            <span>{formatMs(day.totalMs)} listened</span>
            <span>{day.trackCount} tracks</span>
            {day.topArtist && <span>top: {day.topArtist}</span>}
          </>
        ) : (
          <span>no listening data</span>
        )}
      </TooltipContent>
    </Tooltip>
  );
}
