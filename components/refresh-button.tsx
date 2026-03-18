"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";

export function RefreshButton() {
  const router = useRouter();
  const [syncing, setSyncing] = useState(false);

  const handleRefresh = useCallback(async () => {
    if (syncing) return;
    setSyncing(true);
    try {
      await fetch("/api/spotify/sync", { method: "POST" });
      router.refresh();
    } catch {
      /* non-critical, fail silently */
    } finally {
      setSyncing(false);
    }
  }, [syncing, router]);

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
