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
      const nx = (clientX / w) * 2 - 1;
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

const STARS = Array.from({ length: 46 }, (_, i) => {
  const a = Math.sin(i * 12.9898) * 43758.5453;
  const b = Math.sin(i * 78.233) * 12345.6789;
  return {
    x: (a - Math.floor(a)) * 100,
    y: (b - Math.floor(b)) * 58,
    s: (i % 3) + 2,
    dur: 2.4 + (i % 5) * 0.7,
  };
});

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
      {/* Sky */}
      <div
        className="absolute inset-0 dark:hidden"
        style={{
          background:
            "linear-gradient(180deg, #bcd9e8 0%, #dceaea 42%, #f6ead4 78%, #f5ead8 100%)",
        }}
      />
      <div
        className="absolute inset-0 hidden dark:block"
        style={{
          background:
            "linear-gradient(180deg, #1b1a26 0%, #2a2333 40%, #3d2f31 74%, #402d24 100%)",
        }}
      />

      {/* Sun (light) / moon (dark) */}
      <div
        className="absolute top-14 right-4 sm:top-16 sm:right-20 w-14 h-14 sm:w-20 sm:h-20"
        style={parallaxStyle}
        onMouseDown={(e) => e.preventDefault()}
      >
        <div
          className="w-full h-full dark:hidden"
          style={{
            background: "#ffd86b",
            boxShadow: "0 0 0 6px #f6a06b, 0 0 70px 18px rgba(255,216,107,.5)",
          }}
        />
        <div
          className="hidden w-full h-full rounded-full dark:block"
          style={{
            background: "#f5f0d2",
            boxShadow: "0 0 0 6px rgba(245,240,210,.25), 0 0 70px 18px rgba(245,240,210,.28)",
          }}
        />
      </div>

      {/* Clouds (light mode only) */}
      <div className="absolute inset-0 dark:hidden">
        <Cloud className="top-32 left-[10%] sm:top-24 sm:left-[20%]" duration="26s" opacity={0.92} />
        <Cloud className="top-52 left-[45%] sm:top-40 sm:left-[55%]" duration="34s" opacity={0.8} />
        <Cloud className="top-[55%] left-[5%] sm:left-[10%]" duration="30s" opacity={0.7} />
      </div>

      {/* Stars (dark mode only) */}
      <div className="hidden absolute inset-0 dark:block">
        {STARS.map((star, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.s,
              height: star.s,
              background: "#fff6df",
              animation: `pixel-twinkle ${star.dur}s ease-in-out infinite`,
            }}
          />
        ))}
      </div>

      {/* Rolling hills */}
      <div
        className="absolute -left-[180px] -bottom-[300px] w-[1300px] h-[620px] rounded-full dark:hidden"
        style={{ background: "#dfe9c6" }}
      />
      <div
        className="absolute -left-[180px] -bottom-[300px] w-[1300px] h-[620px] rounded-full hidden dark:block"
        style={{ background: "#5f6b48" }}
      />
      <div
        className="absolute -right-[300px] -bottom-[340px] w-[1200px] h-[580px] rounded-full dark:hidden"
        style={{ background: "#ccdbb2" }}
      />
      <div
        className="absolute -right-[300px] -bottom-[340px] w-[1200px] h-[580px] rounded-full hidden dark:block"
        style={{ background: "#56633f" }}
      />
      <div
        className="absolute -left-[220px] -bottom-[260px] w-[1900px] h-[460px] dark:hidden"
        style={{ background: "#aebf92", borderRadius: "50% 50% 0 0 / 100% 100% 0 0" }}
      />
      <div
        className="absolute -left-[220px] -bottom-[260px] w-[1900px] h-[460px] hidden dark:block"
        style={{ background: "#4a5334", borderRadius: "50% 50% 0 0 / 100% 100% 0 0" }}
      />
    </div>
  );
}

function Cloud({
  className = "",
  duration,
  opacity,
}: {
  className?: string;
  duration: string;
  opacity: number;
}) {
  return (
    <div className={`absolute ${className}`} style={{ animation: `pixel-driftx ${duration} ease-in-out infinite alternate` }}>
      <div
        style={{
          width: 80,
          height: 24,
          background: "#ffffff",
          boxShadow: `0 -10px 0 0 rgba(255,255,255,${opacity}), 20px -16px 0 0 rgba(255,255,255,${opacity}), 40px -10px 0 0 rgba(255,255,255,${opacity})`,
          opacity,
        }}
      />
    </div>
  );
}
