"use client";

import { useEffect, useRef } from "react";

const RADII = [270.65,264.3,257.94,251.58,245.23,238.87,232.52,226.16,219.81,213.45,207.09,200.74,194.38,188.03,181.67,175.31,168.96,162.6,156.25,149.89,143.54,137.18,130.82,124.47,118.11,111.76,105.4,99.05,92.69,86.33,79.98,73.62,67.27,60.91,54.55,48.2,41.84,35.49,29.13,22.78,16.42,10.06];

export function AppPreview() {
  const groupRef = useRef<SVGGElement>(null);
  const gradsRef = useRef<SVGLinearGradientElement[]>([]);

  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;

    const circles = group.querySelectorAll<SVGCircleElement>("circle");
    const grads = gradsRef.current;
    let frame: number;
    let t = 0;

    const animate = () => {
      t += 0.004;

      circles.forEach((circle, i) => {
        const angle = -t * (60 + i * 5.7);
        circle.style.transform = `rotate(${angle}deg)`;
        circle.style.transformOrigin = "400px 300px";
      });

      const offset = Math.sin(t * 0.25) * 300;
      for (const grad of grads) {
        const baseX1 = parseFloat(grad.dataset.x1 || "0");
        const baseX2 = parseFloat(grad.dataset.x2 || "0");
        grad.setAttribute("x1", String(baseX1 + offset));
        grad.setAttribute("x2", String(baseX2 + offset));
      }

      frame = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(frame);
  }, []);

  const gradData = RADII.map((_, i) => {
    const x1 = 128.85 + i * 6.355;
    const x2 = 671.15 - i * 6.355;
    return { id: `rg${i}`, x1, x2 };
  });

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
      <svg
        viewBox="0 0 800 600"
        className="w-[140vw] h-[140vh] max-w-none opacity-[0.12] dark:opacity-[0.2]"
      >
        <defs>
          {gradData.map((g, i) => (
            <linearGradient
              key={g.id}
              id={g.id}
              className="grad"
              x1={g.x1}
              y1="300"
              x2={g.x2}
              y2="300"
              gradientUnits="userSpaceOnUse"
              ref={(el) => { if (el) { el.dataset.x1 = String(g.x1); el.dataset.x2 = String(g.x2); gradsRef.current[i] = el; } }}
            >
              <stop offset="0" stopColor="#f7ffd4" />
              <stop offset=".3" stopColor="#4DE8A0" />
              <stop offset=".83" stopColor="#000" />
            </linearGradient>
          ))}
        </defs>
        <g ref={groupRef} strokeWidth="5">
          {RADII.map((r, i) => (
            <circle
              key={i}
              cx="400"
              cy="300"
              r={r}
              fill="none"
              stroke={`url(#rg${i})`}
              strokeMiterlimit="10"
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
