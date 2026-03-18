"use client";

import { useEffect, useRef } from "react";

interface VantaEffect {
  destroy: () => void;
}

interface VantaGlobal {
  BIRDS: (opts: Record<string, unknown>) => VantaEffect;
}

const DARK_CONFIG = {
  backgroundColor: 0x001100,
  color1: 0x1ca723,
  color2: 0x70aaaf,
  birdSize: 0.7,
  wingSpan: 24.0,
  speedLimit: 3.0,
  separation: 100.0,
  alignment: 26.0,
  cohesion: 75.0,
  quantity: 2.5,
};

const LIGHT_CONFIG = {
  backgroundColor: 0xf1f5f1,
  color1: 0x1ca723,
  color2: 0x70aaaf,
  birdSize: 0.7,
  wingSpan: 24.0,
  speedLimit: 3.0,
  separation: 100.0,
  alignment: 26.0,
  cohesion: 75.0,
  quantity: 2.5,
};

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve();
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

export function VantaBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const effectRef = useRef<VantaEffect | null>(null);

  useEffect(() => {
    let destroyed = false;

    async function init() {
      // Load THREE r134 then Vanta — same as the original CDN snippet
      await loadScript(
        "https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"
      );
      await loadScript(
        "https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.birds.min.js"
      );

      if (destroyed || !containerRef.current) return;

      const isDark = document.documentElement.classList.contains("dark");
      const config = isDark ? DARK_CONFIG : LIGHT_CONFIG;

      const vanta = (window as unknown as { VANTA: VantaGlobal }).VANTA;
      effectRef.current = vanta.BIRDS({
        el: containerRef.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200,
        minWidth: 200,
        scale: 1.0,
        scaleMobile: 1.0,
        ...config,
      });
    }

    init();

    // Re-init on theme toggle
    const observer = new MutationObserver(() => {
      effectRef.current?.destroy();
      effectRef.current = null;

      if (!containerRef.current) return;
      const isDark = document.documentElement.classList.contains("dark");
      const config = isDark ? DARK_CONFIG : LIGHT_CONFIG;

      const vanta = (window as unknown as { VANTA: VantaGlobal }).VANTA;
      effectRef.current = vanta.BIRDS({
        el: containerRef.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200,
        minWidth: 200,
        scale: 1.0,
        scaleMobile: 1.0,
        ...config,
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      destroyed = true;
      observer.disconnect();
      effectRef.current?.destroy();
      effectRef.current = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
