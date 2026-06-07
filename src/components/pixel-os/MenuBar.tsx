import { useEffect, useState } from "react";
import {
  BatteryIcon,
  BellIcon,
  MoonIcon,
  SearchIcon,
  SignalIcon,
  SunIcon,
  WifiIcon,
} from "./icons";

type Props = { theme: "light" | "dark"; toggleTheme: () => void };


export function MenuBar({ theme, toggleTheme }: Props) {
  const [now, setNow] = useState<Date | null>(null);
  const [battery, setBattery] = useState(0.98);

  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    type BatteryManager = {
      level: number;
      addEventListener: (type: string, listener: () => void) => void;
      removeEventListener: (type: string, listener: () => void) => void;
    };
    const nav = navigator as Navigator & { getBattery?: () => Promise<BatteryManager> };
    if (!nav.getBattery) return;
    let battery: BatteryManager | null = null;
    const update = () => battery && setBattery(battery.level);
    nav.getBattery().then((b) => {
      battery = b;
      update();
      b.addEventListener("levelchange", update);
    }).catch(() => {});
    return () => {
      battery?.removeEventListener("levelchange", update);
    };
  }, []);

  const time = now ? now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false }) : "";
  const date = now ? now.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" }) : "";

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-9 sm:h-10 px-2 sm:px-4 flex items-center justify-between gap-2 bg-pixel-dock pixel-border-2 border-t-0 border-x-0 anim-fade-in">
      <div className="font-pixel text-[11px] sm:text-base tracking-wider whitespace-nowrap shrink-0">
        THIRUMURUGAN RA
      </div>
      <div className="flex items-center gap-1.5 sm:gap-4 text-xs sm:text-base min-w-0">
        <button aria-label="Search" className="p-0.5 hidden xs:inline-flex sm:inline-flex">
          <SearchIcon className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <button aria-label="Notifications" className="p-0.5">
          <BellIcon className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <SignalIcon className="w-4 h-4 sm:w-5 sm:h-5 sm:hidden" />
        <WifiIcon className="w-4 h-4 sm:w-5 sm:h-5 hidden sm:block" />
        <div className="flex items-center gap-0.5 sm:gap-1">
          <BatteryIcon className="w-5 h-4 sm:w-6 sm:h-5" />
          <span>{Math.round(battery * 100)}%</span>
        </div>

        <div className="hidden md:block">{date}</div>
        <div className="font-semibold whitespace-nowrap">{time}</div>
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="p-0.5 hover:bg-pixel-titlebar shrink-0 press-tap transition-colors"
        >
          {theme === "dark" ? <SunIcon className="w-4 h-4 sm:w-5 sm:h-5" /> : <MoonIcon className="w-4 h-4 sm:w-5 sm:h-5" />}
        </button>
      </div>
    </div>
  );
}
