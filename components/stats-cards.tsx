"use client";

import { ShinyCard } from "@/components/animata/card/shiny-card";
import { useTimeRange } from "./time-range-provider";

const TIME_RANGE_LABELS: Record<string, string> = {
  short_term: "4 weeks",
  medium_term: "6 months",
  long_term: "all time",
};

export function StatsCards() {
  const { timeRange, totalTracks, totalMinutes, activeDays } = useTimeRange();

  return (
    <>
      <ShinyCard className="px-3 py-2">
        <p className="text-xs text-muted-foreground lowercase">
          tracks played · {TIME_RANGE_LABELS[timeRange] ?? timeRange}
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
