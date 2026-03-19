"use client";

import { createContext, useContext, useState, useMemo, type ReactNode } from "react";
import { toESTDateString } from "@/lib/utils";
import type { HeatmapDay } from "@/lib/types";

interface TimeRangeContextValue {
  timeRange: string;
  setTimeRange: (v: string) => void;
  filteredDays: HeatmapDay[];
  totalTracks: number;
  totalMinutes: number;
  activeDays: number;
}

const TimeRangeContext = createContext<TimeRangeContextValue>({
  timeRange: "short_term",
  setTimeRange: () => {},
  filteredDays: [],
  totalTracks: 0,
  totalMinutes: 0,
  activeDays: 0,
});

function filterDaysByRange(days: HeatmapDay[], range: string): HeatmapDay[] {
  if (range === "long_term") return days;
  const now = new Date();
  const cutoff = new Date(now);
  if (range === "short_term") {
    cutoff.setDate(cutoff.getDate() - 28);
  } else {
    cutoff.setMonth(cutoff.getMonth() - 6);
  }
  const cutoffStr = toESTDateString(cutoff);
  return days.filter((d) => d.date >= cutoffStr);
}

export function TimeRangeProvider({
  days,
  children,
}: {
  days: HeatmapDay[];
  children: ReactNode;
}) {
  const [timeRange, setTimeRange] = useState("short_term");

  const filteredDays = useMemo(
    () => filterDaysByRange(days, timeRange),
    [days, timeRange]
  );
  const totalTracks = useMemo(
    () => filteredDays.reduce((sum, d) => sum + d.trackCount, 0),
    [filteredDays]
  );
  const totalMinutes = useMemo(
    () =>
      Math.round(
        filteredDays.reduce((sum, d) => sum + d.totalMs, 0) / 60000
      ),
    [filteredDays]
  );
  const activeDays = filteredDays.length;

  return (
    <TimeRangeContext.Provider
      value={{
        timeRange,
        setTimeRange,
        filteredDays,
        totalTracks,
        totalMinutes,
        activeDays,
      }}
    >
      {children}
    </TimeRangeContext.Provider>
  );
}

export function useTimeRange() {
  return useContext(TimeRangeContext);
}
