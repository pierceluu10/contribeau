"use client";

import { useState, useCallback } from "react";
import { RefreshCw } from "lucide-react";

export function RefreshButton() {
  const [syncing, setSyncing] = useState(false);

  const handleRefresh = useCallback(async () => {
    if (syncing) return;
    setSyncing(true);
    try {
      const res = await fetch("/api/spotify/sync", { method: "POST" });
      if (!res.ok) {
        console.error("Sync failed:", res.status, await res.text());
      }
    } catch (err) {
      console.error("Sync error:", err);
    } finally {
      setSyncing(false);
      // Hard reload instead of router.refresh() — more reliable on Vercel
      window.location.reload();
    }
  }, [syncing]);

  return (
    <button
      onClick={handleRefresh}
      disabled={syncing}
      className="inline-flex items-center justify-center h-8 w-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors disabled:opacity-50"
      title="Sync latest tracks"
    >
      <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
    </button>
  );
}
