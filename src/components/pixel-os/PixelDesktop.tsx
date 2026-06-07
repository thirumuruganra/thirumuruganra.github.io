import { useCallback, useEffect, useMemo, useState } from "react";
import { Backdrop } from "./Backdrop";
import { Dock } from "./Dock";
import { MenuBar } from "./MenuBar";
import { StickyNote } from "./StickyNote";
import { PixelWindow, type WindowState } from "./Window";
import { AboutWindow } from "./windows/AboutWindow";
import { ContactWindow } from "./windows/ContactWindow";
import { ResumeWindow } from "./windows/ResumeWindow";
import { WorkWindow } from "./windows/WorkWindow";

export type WindowId = "work" | "about" | "contact" | "resume";

const initial: Record<WindowId, WindowState> = {
  work: { open: false, minimized: false, maximized: false, z: 1 },
  about: { open: false, minimized: false, maximized: false, z: 1 },
  contact: { open: false, minimized: false, maximized: false, z: 1 },
  resume: { open: false, minimized: false, maximized: false, z: 1 },
};

const titles: Record<WindowId, string> = {
  work: "Work — Finder",
  about: "About — Profile.app",
  contact: "Contact — Mail.app",
  resume: "Resume.pdf — Preview",
};

function getInitialTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem("pixel-theme");
  if (stored === "light" || stored === "dark") return stored;
  return "light";
}

export function PixelDesktop() {
  const [windows, setWindows] = useState(initial);
  const [zTop, setZTop] = useState(10);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    setTheme(getInitialTheme());
  }, []);

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
  const minimizeAll = useCallback(() => {
    setWindows((w) => {
      const next = { ...w };
      (Object.keys(next) as WindowId[]).forEach((k) => {
        next[k] = { ...next[k], minimized: true };
      });
      return next;
    });
  }, []);

  const initials = useMemo(() => {
    const baseX = typeof window !== "undefined" ? Math.max(40, window.innerWidth / 2 - 360) : 80;
    return {
      work: { x: baseX, y: 80 },
      about: { x: baseX + 40, y: 120 },
      contact: { x: baseX + 80, y: 160 },
      resume: { x: baseX + 120, y: 100 },
    };
  }, []);

  const stickyInitial = useMemo(() => {
    if (typeof window === "undefined") return { x: 40, y: 80 };
    const isMobile = window.innerWidth < 768;
    return isMobile ? { x: 16, y: 60 } : { x: window.innerWidth - 260, y: 80 };
  }, []);

  return (
    <div className="relative z-10 w-screen h-screen overflow-hidden text-foreground">
      <Backdrop />
      <MenuBar
        theme={theme}
        toggleTheme={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
      />
      <StickyNote initial={stickyInitial} />

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

      <Dock onOpen={open} onHome={minimizeAll} />
    </div>
  );
}
