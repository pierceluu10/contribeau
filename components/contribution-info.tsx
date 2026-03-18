"use client";

import { useState } from "react";

export function ContributionInfo() {
  const [open, setOpen] = useState(false);

  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <span className="underline decoration-dotted underline-offset-4 cursor-default hover:decoration-solid transition-all">
        contributions
      </span>
      {open && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 z-50 w-72 rounded-lg border bg-card p-4 shadow-lg text-left">
          <h3 className="text-sm font-semibold mb-2 lowercase">
            what&apos;s a contribution?
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            on github, a contribution is what it sounds like, activity you
            put toward a project. they show up as green squares
            on your profile, forming a heatmap of your year.
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed mt-2">
            contribeau uses the same idea, but for your spotify listening.
            the color intensity each day shows how much you listened.
          </p>
        </div>
      )}
    </span>
  );
}
