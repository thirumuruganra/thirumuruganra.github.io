import { useEffect, useRef, useState } from "react";

const CAPTIONS = ["booting…", "mounting /work", "loading wallpaper", "ready"];
const FILL_MS = 1100;
const HOLD_MS = 250;
const EXIT_MS = 260;

export function BootSequence({ onDone }: { onDone: () => void }) {
  const [caption, setCaption] = useState(0);
  const [exiting, setExiting] = useState(false);
  const done = useRef(false);

  useEffect(() => {
    const finish = () => {
      if (done.current) return;
      done.current = true;
      setExiting(true);
      window.setTimeout(onDone, EXIT_MS);
    };

    const stepTimers = CAPTIONS.map((_, i) =>
      window.setTimeout(() => setCaption(i), (FILL_MS / CAPTIONS.length) * i),
    );
    const endTimer = window.setTimeout(finish, FILL_MS + HOLD_MS);

    const skip = (e: KeyboardEvent) => {
      if (e.key === "Escape") finish();
    };
    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", finish);
    return () => {
      stepTimers.forEach(clearTimeout);
      clearTimeout(endTimer);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", finish);
    };
  }, [onDone]);

  return (
    <div
      role="status"
      aria-label="Loading portfolio"
      className={`fixed inset-0 z-[10000] flex flex-col items-center justify-center gap-6 bg-pixel-window text-foreground ${
        exiting ? "anim-crt-off" : ""
      }`}
    >
      <img
        src="/favicon.ico"
        alt=""
        width={72}
        height={72}
        className="anim-pop-in [image-rendering:pixelated]"
      />
      <div className="w-[220px] anim-fade-in" style={{ animationDelay: "120ms" }}>
        <div className="pixel-border-2 h-4 p-[2px]">
          <div className="anim-boot-bar h-full bg-[color:var(--pixel-accent)]" />
        </div>
        <p className="mt-2 font-pixel text-xs text-[color:var(--pixel-muted)]">
          {CAPTIONS[caption]}
        </p>
      </div>
      <p className="absolute bottom-8 font-pixel text-[10px] text-[color:var(--pixel-muted)] opacity-60">
        tap or press esc to skip
      </p>
    </div>
  );
}
