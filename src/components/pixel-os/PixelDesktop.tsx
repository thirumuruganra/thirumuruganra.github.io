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

export function PixelDesktop() {
  const [windows, setWindows] = useState(initial);
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
    const baseX = typeof window !== "undefined" ? Math.max(40, window.innerWidth / 2 - 360) : 80;
    return {
      vanakkam: { x: baseX + 20, y: 72 },
      work: { x: baseX, y: 80 },
      about: { x: baseX + 40, y: 120 },
      contact: { x: baseX + 80, y: 160 },
      resume: { x: baseX + 120, y: 100 },
    };
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
      <WeatherCard />
      <CurrentlyCard />

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
