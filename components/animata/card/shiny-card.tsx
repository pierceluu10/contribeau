"use client";

import { useCallback, useRef } from "react";
import { useMousePosition } from "@/hooks/use-mouse-position";
import { cn } from "@/lib/utils";

export function ShinyCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const update = useCallback(({ x, y }: { x: number; y: number }) => {
    if (!overlayRef.current) return;
    const { width, height } = overlayRef.current.getBoundingClientRect();
    overlayRef.current.style.setProperty("--x", `${x - width / 2}px`);
    overlayRef.current.style.setProperty("--y", `${y - height / 2}px`);
  }, []);

  useMousePosition(containerRef, update);

  return (
    <div
      ref={containerRef}
      className={cn(
        "group relative overflow-hidden rounded-lg border bg-card",
        className
      )}
    >
      {/* light: spotify-green glow | dark: white glow */}
      <div
        ref={overlayRef}
        className={cn(
          "pointer-events-none absolute h-40 w-40 rounded-full blur-3xl",
          "opacity-0 transition-opacity duration-300",
          "bg-[#1db954] group-hover:opacity-[0.22]",
          "dark:bg-white dark:group-hover:opacity-[0.09]"
        )}
        style={{ transform: "translate(var(--x), var(--y))" }}
      />
      {children}
    </div>
  );
}
