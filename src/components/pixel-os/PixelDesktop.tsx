import { useCallback, useEffect, useMemo, useState } from "react";
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

export type WindowId = "vanakkam" | "work" | "about" | "contact" | "resume";

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
    const order: WindowId[] = ["vanakkam", "work", "about", "contact", "resume"];
    return Object.fromEntries(
      order.map((id, i) => [id, { x: originX + i * sx, y: originY + i * sy }]),
    ) as Record<WindowId, { x: number; y: number }>;
  }, []);

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

      <PixelWindow
        title={titles.vanakkam}
        state={windows.vanakkam}
        onClose={() => close("vanakkam")}
        onMinimize={() => minimize("vanakkam")}
        onMaximize={() => maximize("vanakkam")}
        onFocus={() => focus("vanakkam")}
        initial={initials.vanakkam}
        width={660}
        height={470}
      >
        <BioCard />
      </PixelWindow>

      <PixelWindow
        title={titles.work}
        state={windows.work}
        onClose={() => close("work")}
        onMinimize={() => minimize("work")}
        onMaximize={() => maximize("work")}
        onFocus={() => focus("work")}
        initial={initials.work}
      >
        <WorkWindow />
      </PixelWindow>
      <PixelWindow
        title={titles.about}
        state={windows.about}
        onClose={() => close("about")}
        onMinimize={() => minimize("about")}
        onMaximize={() => maximize("about")}
        onFocus={() => focus("about")}
        initial={initials.about}
      >
        <AboutWindow />
      </PixelWindow>
      <PixelWindow
        title={titles.contact}
        state={windows.contact}
        onClose={() => close("contact")}
        onMinimize={() => minimize("contact")}
        onMaximize={() => maximize("contact")}
        onFocus={() => focus("contact")}
        initial={initials.contact}
      >
        <ContactWindow />
      </PixelWindow>
      <PixelWindow
        title={titles.resume}
        state={windows.resume}
        onClose={() => close("resume")}
        onMinimize={() => minimize("resume")}
        onMaximize={() => maximize("resume")}
        onFocus={() => focus("resume")}
        initial={initials.resume}
      >
        <ResumeWindow />
      </PixelWindow>

      <Dock onOpen={open} onHome={() => open("vanakkam")} />
    </div>
  );
}
