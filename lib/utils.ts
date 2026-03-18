import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { HeatmapDay } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMs(ms: number): string {
  const totalMinutes = Math.floor(ms / 60_000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export function getHeatmapColor(totalMs: number): string {
  if (totalMs === 0) return "var(--heatmap-empty)";
  const minutes = totalMs / 60_000;
  if (minutes < 15) return "var(--heatmap-l1)";
  if (minutes < 60) return "var(--heatmap-l2)";
  if (minutes < 120) return "var(--heatmap-l3)";
  return "var(--heatmap-l4)";
}

export function buildHeatmapGrid(
  days: HeatmapDay[]
): (HeatmapDay | null)[][] {
  const dayMap = new Map(days.map((d) => [d.date, d]));
  const today = new Date();
  const grid: (HeatmapDay | null)[][] = [];

  // go back 52 weeks from today
  const start = new Date(today);
  start.setDate(start.getDate() - (52 * 7 + today.getDay()));

  for (let week = 0; week < 53; week++) {
    const column: (HeatmapDay | null)[] = [];
    for (let day = 0; day < 7; day++) {
      const current = new Date(start);
      current.setDate(current.getDate() + week * 7 + day);
      if (current > today) {
        column.push(null);
      } else {
        const dateStr = current.toISOString().slice(0, 10);
        column.push(
          dayMap.get(dateStr) ?? {
            date: dateStr,
            totalMs: 0,
            trackCount: 0,
            topArtist: null,
          }
        );
      }
    }
    grid.push(column);
  }
  return grid;
}

export function getMonthLabels(): { label: string; col: number }[] {
  const today = new Date();
  const start = new Date(today);
  start.setDate(start.getDate() - (52 * 7 + today.getDay()));

  const labels: { label: string; col: number }[] = [];
  const months = [
    "jan", "feb", "mar", "apr", "may", "jun",
    "jul", "aug", "sep", "oct", "nov", "dec",
  ];
  let lastMonth = -1;

  for (let week = 0; week < 53; week++) {
    const d = new Date(start);
    d.setDate(d.getDate() + week * 7);
    if (d.getMonth() !== lastMonth) {
      lastMonth = d.getMonth();
      labels.push({ label: months[lastMonth], col: week });
    }
  }
  return labels;
}
