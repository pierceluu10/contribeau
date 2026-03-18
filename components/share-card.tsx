"use client";

import { forwardRef } from "react";

function getShareHeatmapColor(totalMs: number): string {
  if (totalMs === 0) return "#161b22";
  const minutes = totalMs / 60_000;
  if (minutes < 15) return "#0e4429";
  if (minutes < 60) return "#006d32";
  if (minutes < 120) return "#26a641";
  return "#1db954";
}

const TIME_RANGE_LABELS: Record<string, string> = {
  short_term: "4 weeks",
  medium_term: "6 months",
  long_term: "all time",
};

interface ShareCardProps {
  displayName: string;
  days: { date: string; totalMs: number }[];
  totalTracks: number;
  totalMinutes: number;
  activeDays: number;
  topArtists: string[];
  topTracks: string[];
  timeRange: string;
}

export const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(
  function ShareCard(
    {
      displayName,
      days,
      totalTracks,
      totalMinutes,
      activeDays,
      topArtists,
      topTracks,
      timeRange,
    },
    ref
  ) {
    // build mini heatmap: last 20 weeks
    const today = new Date();
    const dayMap = new Map(days.map((d) => [d.date, d.totalMs]));
    const weeks: { date: string; totalMs: number }[][] = [];

    const start = new Date(today);
    start.setDate(start.getDate() - (20 * 7 + today.getDay()));

    for (let week = 0; week < 21; week++) {
      const column: { date: string; totalMs: number }[] = [];
      for (let day = 0; day < 7; day++) {
        const current = new Date(start);
        current.setDate(current.getDate() + week * 7 + day);
        if (current > today) {
          column.push({ date: "", totalMs: -1 });
        } else {
          const dateStr = current.toISOString().slice(0, 10);
          column.push({ date: dateStr, totalMs: dayMap.get(dateStr) ?? 0 });
        }
      }
      weeks.push(column);
    }

    const timeLabel = TIME_RANGE_LABELS[timeRange] ?? timeRange;

    return (
      <div
        ref={ref}
        style={{
          width: 1200,
          height: 630,
          background: "linear-gradient(135deg, #0d1117 0%, #161b22 100%)",
          color: "#e6edf3",
          fontFamily: "system-ui, -apple-system, sans-serif",
          padding: 56,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          boxSizing: "border-box",
        }}
      >
        {/* TOP ROW: title left | lists right */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          {/* Title */}
          <div>
            <div style={{ fontSize: 38, fontWeight: 700, textTransform: "lowercase", lineHeight: 1.1 }}>
              {displayName}&apos;s listening activity
            </div>
            <div style={{ fontSize: 14, color: "#8b949e", marginTop: 6, textTransform: "lowercase" }}>
              {timeLabel}
            </div>
          </div>

          {/* Top artists + tracks columns */}
          <div style={{ display: "flex", gap: 48, textAlign: "left" }}>
            {/* Top artists */}
            <div>
              <div style={{ fontSize: 12, color: "#8b949e", marginBottom: 10, textTransform: "lowercase", letterSpacing: "0.05em" }}>
                top artists
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {topArtists.slice(0, 5).map((name, i) => (
                  <div key={i} style={{ fontSize: 15, textTransform: "lowercase", display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: "#8b949e", width: 14, textAlign: "right", fontSize: 12 }}>{i + 1}</span>
                    {name}
                  </div>
                ))}
              </div>
            </div>
            {/* Top tracks */}
            <div>
              <div style={{ fontSize: 12, color: "#8b949e", marginBottom: 10, textTransform: "lowercase", letterSpacing: "0.05em" }}>
                top tracks
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {topTracks.slice(0, 5).map((name, i) => (
                  <div key={i} style={{ fontSize: 15, textTransform: "lowercase", display: "flex", alignItems: "center", gap: 8, maxWidth: 260 }}>
                    <span style={{ color: "#8b949e", width: 14, textAlign: "right", fontSize: 12, flexShrink: 0 }}>{i + 1}</span>
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* MIDDLE: mini heatmap */}
        <div style={{ display: "flex", gap: 4, alignSelf: "flex-start" }}>
          {weeks.map((week, wi) => (
            <div key={wi} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {week.map((day, di) => (
                <div
                  key={di}
                  style={{
                    width: 13,
                    height: 13,
                    borderRadius: 2,
                    backgroundColor:
                      day.totalMs === -1 ? "transparent" : getShareHeatmapColor(day.totalMs),
                  }}
                />
              ))}
            </div>
          ))}
        </div>

        {/* BOTTOM ROW: stats left | branding right */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          {/* Stats bottom-left */}
          <div style={{ display: "flex", gap: 40 }}>
            <div>
              <div style={{ fontSize: 32, fontWeight: 700 }}>{totalTracks.toLocaleString()}</div>
              <div style={{ fontSize: 12, color: "#8b949e", textTransform: "lowercase" }}>tracks</div>
            </div>
            <div>
              <div style={{ fontSize: 32, fontWeight: 700 }}>{totalMinutes.toLocaleString()}</div>
              <div style={{ fontSize: 12, color: "#8b949e", textTransform: "lowercase" }}>minutes</div>
            </div>
            <div>
              <div style={{ fontSize: 32, fontWeight: 700 }}>{activeDays}</div>
              <div style={{ fontSize: 12, color: "#8b949e", textTransform: "lowercase" }}>days</div>
            </div>
          </div>

          {/* Branding bottom-right */}
          <div style={{ fontSize: 22, fontWeight: 700, color: "#1db954", textTransform: "lowercase" }}>
            contribeau
          </div>
        </div>
      </div>
    );
  }
);
