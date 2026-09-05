import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { Backdrop } from "./Backdrop";
import { BootSequence } from "./BootSequence";
import { BioCard } from "./BioCard";
import { CurrentlyCard } from "./CurrentlyCard";
import { Dock } from "./Dock";
import { MenuBar } from "./MenuBar";
import { PortraitCard } from "./PortraitCard";
import { WeatherCard } from "./WeatherCard";
import { PixelWindow, type WindowState } from "./Window";
import { AboutWindow } from "./windows/AboutWindow";
import { ContactWindow } from "./windows/ContactWindow";
import { ResumeWindow } from "./windows/ResumeWindow";
import { WorkWindow } from "./windows/WorkWindow";

const WINDOW_IDS = ["vanakkam", "work", "about", "contact", "resume"] as const;
export type WindowId = (typeof WINDOW_IDS)[number];

const initial: Record<WindowId, WindowState> = {
  vanakkam: { open: true, minimized: false, maximized: false, z: 2 },
  work: { open: false, minimized: false, maximized: false, z: 1 },
  about: { open: false, minimized: false, maximized: false, z: 1 },
  contact: { open: false, minimized: false, maximized: false, z: 1 },
  resume: { open: false, minimized: false, maximized: false, z: 1 },
};

const titles: Record<WindowId, string> = {
  vanakkam: "Vanakkam",
  work: "Work — Finder",
  about: "About — Profile",
  contact: "Contact — Mail",
  resume: "Resume.pdf — Preview",
};

const sizes: Partial<Record<WindowId, { width: number; height: number }>> = {
  vanakkam: { width: 660, height: 470 },
};

function getInitialTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem("pixel-theme");
  if (stored === "light" || stored === "dark") return stored;
  return "light";
}

function shouldSkipBoot(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isMobile(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 1023px)").matches;
}

export function PixelDesktop() {
  const [windows, setWindows] = useState(() =>
    isMobile() ? { ...initial, vanakkam: { ...initial.vanakkam, open: false } } : initial,
  );
  const [zTop, setZTop] = useState(10);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [booted, setBooted] = useState<boolean>(() => shouldSkipBoot());

  useEffect(() => {
    setTheme(getInitialTheme());
  }, []);

  const finishBoot = useCallback(() => setBooted(true), []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("pixel-theme", theme);
  }, [theme]);

  const focus = useCallback(
    (id: WindowId) => {
      setWindows((w) => {
        if (w[id].z === zTop) return w;
        return { ...w, [id]: { ...w[id], z: zTop + 1 } };
      });
      setZTop((z) => z + 1);
    },
    [zTop],
  );

  const open = useCallback(
    (id: WindowId) => {
      setZTop((z) => z + 1);
      setWindows((w) => ({
        ...w,
        [id]: { ...w[id], open: true, minimized: false, z: zTop + 1 },
      }));
    },
    [zTop],
  );

  const close = useCallback((id: WindowId) => {
    setWindows((w) => ({ ...w, [id]: { ...w[id], open: false } }));
  }, []);
  const minimize = useCallback((id: WindowId) => {
    setWindows((w) => ({ ...w, [id]: { ...w[id], minimized: true } }));
  }, []);
  const maximize = useCallback((id: WindowId) => {
    setWindows((w) => ({ ...w, [id]: { ...w[id], maximized: !w[id].maximized } }));
  }, []);
  const initials = useMemo(() => {
    const vw = typeof window !== "undefined" ? window.innerWidth : 1024;
    const mobile = vw < 640;
    const originX = mobile ? 10 : Math.max(40, vw / 2 - 360);
    const originY = mobile ? 52 : 72;
    const sx = mobile ? 6 : 28;
    const sy = mobile ? 20 : 26;
    // cascade so windows stack like cards with corners peeking, not at random spots
    return Object.fromEntries(
      WINDOW_IDS.map((id, i) => [id, { x: originX + i * sx, y: originY + i * sy }]),
    ) as Record<WindowId, { x: number; y: number }>;
  }, []);

  const bodies: Record<WindowId, ReactNode> = {
    vanakkam: <BioCard />,
    work: <WorkWindow />,
    about: <AboutWindow />,
    contact: <ContactWindow />,
    resume: <ResumeWindow />,
  };

  return (
    <div className="relative z-10 w-screen h-screen overflow-hidden text-foreground">
      {!booted && <BootSequence onDone={finishBoot} />}
      <Backdrop />
      <MenuBar
        theme={theme}
        toggleTheme={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
      />
      <PortraitCard />
      {/* mobile: stack cards just above the dock; desktop: cards self-position */}
      <div className="fixed inset-x-4 bottom-[128px] z-[1] flex flex-col gap-3 lg:contents">
        <WeatherCard />
        <CurrentlyCard />
      </div>

      {WINDOW_IDS.map((id) => (
        <PixelWindow
          key={id}
          title={titles[id]}
          state={windows[id]}
          onClose={() => close(id)}
          onMinimize={() => minimize(id)}
          onMaximize={() => maximize(id)}
          onFocus={() => focus(id)}
          initial={initials[id]}
          {...sizes[id]}
        >
          {bodies[id]}
        </PixelWindow>
      ))}

      <Dock onOpen={open} onHome={() => open("vanakkam")} />
    </div>
  );
}
