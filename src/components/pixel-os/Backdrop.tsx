import { useEffect, useRef, useState } from "react";

function useParallax(strength = 12) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const tick = () => {
      setOffset((prev) => {
        const nx = prev.x + (target.current.x - prev.x) * 0.08;
        const ny = prev.y + (target.current.y - prev.y) * 0.08;
        return { x: nx, y: ny };
      });
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);

    const updateFromPoint = (clientX: number, clientY: number) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const nx = (clientX / w) * 2 - 1; // -1..1
      const ny = (clientY / h) * 2 - 1;
      target.current = { x: nx * strength, y: ny * strength };
    };

    const onMouse = (e: MouseEvent) => updateFromPoint(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) updateFromPoint(t.clientX, t.clientY);
    };

    window.addEventListener("mousemove", onMouse, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("touchmove", onTouch);
    };
  }, [strength]);

  return offset;
}

export function Backdrop() {
  const offset = useParallax(5);
  const parallaxStyle = {
    transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
    transition: "transform 80ms linear",
    cursor: "default",
    userSelect: "none" as const,
    pointerEvents: "auto" as const,
  };

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Light mode: sun + clouds */}
      <div className="dark:hidden absolute inset-0">
        <div
          className="absolute top-14 right-4 sm:top-16 sm:right-20 w-14 h-14 sm:w-20 sm:h-20"
          style={parallaxStyle}
          onMouseDown={(e) => e.preventDefault()}
        >
          <div
            className="w-full h-full"
            style={{
              background: "#ffd86b",
              boxShadow:
                "0 0 0 4px #ffb347, 8px 0 0 0 #ffd86b, -8px 0 0 0 #ffd86b, 0 8px 0 0 #ffd86b, 0 -8px 0 0 #ffd86b",
              imageRendering: "pixelated",
            }}
          />
        </div>

        <Cloud className="top-32 left-[10%] sm:top-24 sm:left-[20%]" />
        <Cloud className="top-52 left-[45%] sm:top-40 sm:left-[55%]" />
        <Cloud className="top-[55%] left-[5%] sm:left-[10%]" />
        <Cloud className="top-[70%] left-[55%] sm:left-[70%]" />
      </div>
      {/* Dark mode: moon + stars */}
      <div className="hidden dark:block absolute inset-0">
        <div
          className="absolute top-14 right-4 sm:top-16 sm:right-20 w-14 h-14 sm:w-20 sm:h-20"
          style={parallaxStyle}
          onMouseDown={(e) => e.preventDefault()}
        >
          <div
            className="w-full h-full rounded-full"
            style={{
              background: "#f5f3c4",
              boxShadow: "inset -10px -6px 0 0 #cfc98a, 0 0 40px 6px rgba(255,255,200,0.25)",
            }}
          />
        </div>

        {Array.from({ length: 40 }).map((_, i) => (
          <Star key={i} seed={i} />
        ))}
      </div>
    </div>
  );
}

function Cloud({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute ${className}`}>
      <div
        className="relative"
        style={{
          width: 80,
          height: 24,
          background: "#ffffff",
          boxShadow: "0 -10px 0 0 #ffffff, 20px -16px 0 0 #ffffff, 40px -10px 0 0 #ffffff",
          borderRadius: 2,
          opacity: 0.9,
        }}
      />
    </div>
  );
}

function Star({ seed }: { seed: number }) {
  const hash1 = (n: number) => {
    let h = n;
    h = h ^ 61 ^ (h >>> 16);
    h += h << 3;
    h ^= h >>> 4;
    h *= 0x27d4eb2d;
    h ^= h >>> 15;
    return (h >>> 0) / 0xffffffff;
  };
  const hash2 = (n: number) => {
    let h = n * 0x45d9f3b;
    h = ((h >> 16) ^ h) * 0x45d9f3b;
    h = ((h >> 16) ^ h) * 0x45d9f3b;
    return (h >>> 0) / 0xffffffff;
  };

  const x = hash1(seed + 1) * 100;
  const y = hash2(seed + 100) * 100;
  const size = (seed % 3) + 1;
  return (
    <div
      className="absolute"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size * 2,
        height: size * 2,
        background: "#ffffff",
        opacity: 0.7 + (seed % 3) * 0.1,
        boxShadow: "0 0 4px rgba(255,255,255,0.8)",
      }}
    />
  );
}
