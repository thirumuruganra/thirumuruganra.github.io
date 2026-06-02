import { useRef } from "react";
import { useDraggable } from "./hooks/useDraggable";

export function StickyNote({ initial }: { initial: { x: number; y: number } }) {
  const ref = useRef<HTMLDivElement>(null);
  const { position, dragHandleProps } = useDraggable(initial, {
    getSize: () => {
      const r = ref.current?.getBoundingClientRect();
      return { w: r?.width ?? 180, h: r?.height ?? 120 };
    },
  });
  return (
    <div
      ref={ref}
      {...dragHandleProps}
      className="fixed z-[1] w-40 sm:w-44 p-3 pixel-border pixel-shadow cursor-grab active:cursor-grabbing select-none font-sticky anim-pop-in"
      style={{
        left: position.x,
        top: position.y,
        transform: "rotate(-6deg)",
        background: "var(--pixel-sticky)",
        color: "var(--pixel-sticky-ink)",
        touchAction: "none",
        animationDelay: "200ms",
        ["--rot" as never]: "-6deg",
      }}
    >
      <div className="text-[11px] opacity-70 mb-1" style={{ fontFamily: "var(--font-pixel)" }}>sticky.txt</div>
      <div className="text-lg leading-tight font-semibold">Vanakkam!! ✨</div>
      <div className="mt-2 text-sm">— Thirumurugan ♡</div>
    </div>
  );
}
