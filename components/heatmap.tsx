"use client";

import type { HeatmapDay } from "@/lib/types";
import { buildHeatmapGrid, getMonthLabels } from "@/lib/utils";
import { HeatmapCell } from "./heatmap-cell";

const DAY_LABELS = ["", "mon", "", "wed", "", "fri", ""];

export function Heatmap({ days }: { days: HeatmapDay[] }) {
  const grid = buildHeatmapGrid(days);
  const months = getMonthLabels();

  return (
    <div className="w-full overflow-x-auto">
      <div className="inline-block min-w-fit">
        {/* month labels */}
        <div className="flex ml-8 mb-1 text-xs text-muted-foreground lowercase relative h-4">
          {months.map((m, i) => (
            <span
              key={i}
              className="absolute"
              style={{ left: m.col * 22 }}
            >
              {m.label}
            </span>
          ))}
        </div>

        <div className="flex gap-1">
          {/* day labels */}
          <div className="flex flex-col gap-[4px] text-xs text-muted-foreground lowercase pr-1">
            {DAY_LABELS.map((label, i) => (
              <div key={i} className="h-[18px] flex items-center">
                {label}
              </div>
            ))}
          </div>

          {/* grid */}
          <div className="flex gap-[4px]">
            {grid.map((week, weekIdx) => (
              <div key={weekIdx} className="flex flex-col gap-[4px]">
                {week.map((day, dayIdx) => (
                  <HeatmapCell key={`${weekIdx}-${dayIdx}`} day={day} />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* legend */}
        <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground lowercase justify-end">
          <span>less</span>
          {[
            "var(--heatmap-empty)",
            "var(--heatmap-l1)",
            "var(--heatmap-l2)",
            "var(--heatmap-l3)",
            "var(--heatmap-l4)",
          ].map((color, i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: color }}
            />
          ))}
          <span>more</span>
        </div>
      </div>
    </div>
  );
}
