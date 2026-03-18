"use client";

import { ShinyCard } from "@/components/animata/card/shiny-card";
import { useTimeRange } from "./time-range-provider";

export function StatsCards() {
  const { totalTracks, totalMinutes, activeDays } = useTimeRange();

  return (
    <>
      <ShinyCard className="px-3 py-2">
        <p className="text-xs text-muted-foreground lowercase">
          tracks played
        </p>
        <p className="text-xl font-bold">
          {totalTracks.toLocaleString()}
        </p>
      </ShinyCard>
      <ShinyCard className="px-3 py-2">
        <p className="text-xs text-muted-foreground lowercase">
          minutes listened
        </p>
        <p className="text-xl font-bold">
          {totalMinutes.toLocaleString()}
        </p>
      </ShinyCard>
      <ShinyCard className="px-3 py-2">
        <p className="text-xs text-muted-foreground lowercase">
          active days
        </p>
        <p className="text-xl font-bold">{activeDays}</p>
      </ShinyCard>
    </>
  );
}
