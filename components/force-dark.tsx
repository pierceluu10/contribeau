"use client";

import { useEffect } from "react";

// Forces dark mode on <html> for this page only.
// Saves the previous class state and restores it on unmount.
export function ForceDark() {
  useEffect(() => {
    const html = document.documentElement;
    const wasDark = html.classList.contains("dark");
    html.classList.add("dark");

    return () => {
      if (!wasDark) {
        html.classList.remove("dark");
      }
    };
  }, []);

  return null;
}
