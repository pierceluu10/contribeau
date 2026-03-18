"use client";

import { useEffect } from "react";

// Silently syncs the user's recent Spotify history on every dashboard load.
// This ensures the heatmap is always up to date without requiring a cron job.
export function SyncOnLoad() {
  useEffect(() => {
    fetch("/api/spotify/sync", { method: "POST" }).catch(() => {
      // silently ignore — non-critical
    });
  }, []);

  return null;
}
