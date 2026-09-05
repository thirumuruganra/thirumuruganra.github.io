import { useEffect, useState } from "react";

function SunHorizon({ dir }: { dir: "rise" | "set" }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="square"
      shapeRendering="crispEdges"
      aria-hidden="true"
      className="shrink-0"
    >
      <path d="M12 3v2M5.5 6.5l1.5 1.5M18.5 6.5l-1.5 1.5M3 13h2M19 13h2" />
      <path d="M7 15a5 5 0 0 1 10 0z" fill="currentColor" stroke="none" />
      {dir === "rise" ? <path d="M2 19 12 15 22 19" /> : <path d="M2 15h20M4 19h6M14 19h6" />}
    </svg>
  );
}

export function WeatherCard() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const fmt = (opts: Intl.DateTimeFormatOptions) =>
    now ? new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", ...opts }).format(now) : "";

  return (
    <div
      className="hidden lg:block fixed z-[1] right-11 top-[220px] w-[246px] p-4 bg-pixel-window pixel-border rounded-[16px] anim-pop-in"
      style={{ animationDelay: "100ms" }}
    >
      <div className="flex items-baseline justify-between">
        <div className="font-display text-sm tracking-wider text-pixel-muted">CHENNAI, IN</div>
        <div className="text-xs text-pixel-muted">GMT+5:30</div>
      </div>
      <div className="font-display text-[42px] font-semibold leading-none mt-1.5">
        {fmt({ hour: "2-digit", minute: "2-digit", hour12: false })}
      </div>
      <div className="flex items-center gap-2.5 mt-2.5">
        <div
          className="w-8 h-8 rounded-full border-2 border-black"
          style={{
            background: "var(--pixel-accent)",
            boxShadow: "inset -8px -4px 0 0 rgba(0,0,0,.15)",
          }}
        />
        <div>
          <div className="font-display text-lg leading-none">32°C</div>
          <div className="text-xs text-pixel-muted">humid, as always</div>
        </div>
      </div>
      <div className="h-[2px] bg-black/10 dark:bg-white/10 my-3 rounded-full" />
      <div className="flex items-center justify-between text-xs text-pixel-muted">
        <span className="flex items-center gap-1">
          <SunHorizon dir="rise" /> 06:04
        </span>
        <span className="flex items-center gap-1">
          <SunHorizon dir="set" /> 18:22
        </span>
        <span>{fmt({ weekday: "short", month: "short", day: "numeric" })}</span>
      </div>
    </div>
  );
}
