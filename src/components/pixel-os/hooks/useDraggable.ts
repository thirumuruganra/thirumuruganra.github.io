import { useCallback, useEffect, useRef, useState } from "react";

export type Position = { x: number; y: number };

export function useDraggable(
  initial: Position,
  opts?: {
    margin?: number;
    disabled?: boolean;
    getSize?: () => { w: number; h: number };
    topInset?: number;
    bottomInset?: number;
  },
) {
  const [position, setPosition] = useState<Position>(initial);
  const dragging = useRef(false);
  const start = useRef({ pointerX: 0, pointerY: 0, x: 0, y: 0 });
  const margin = opts?.margin ?? 8;
  const topInset = opts?.topInset ?? margin;
  const bottomInset = opts?.bottomInset ?? margin;
  const getSize = opts?.getSize;

  const clamp = useCallback(
    (x: number, y: number) => {
      if (typeof window === "undefined") return { x, y };
      const size = getSize?.() ?? { w: 80, h: 40 };
      const maxX = Math.max(margin, window.innerWidth - margin - size.w);
      const maxY = Math.max(topInset, window.innerHeight - bottomInset - size.h);
      return {
        x: Math.min(Math.max(margin, x), maxX),
        y: Math.min(Math.max(topInset, y), maxY),
      };
    },
    [margin, topInset, bottomInset, getSize],
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (opts?.disabled) return;
      // Don't start drag on interactive children
      const target = e.target as HTMLElement;
      if (target.closest("button, a, input, textarea, select")) return;
      dragging.current = true;
      start.current = {
        pointerX: e.clientX,
        pointerY: e.clientY,
        x: position.x,
        y: position.y,
      };
      (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
      e.preventDefault();
    },
    [position.x, position.y, opts?.disabled],
  );

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!dragging.current) return;
      const dx = e.clientX - start.current.pointerX;
      const dy = e.clientY - start.current.pointerY;
      setPosition(clamp(start.current.x + dx, start.current.y + dy));
    };
    const onUp = () => {
      dragging.current = false;
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [clamp]);

  // Re-clamp on resize
  useEffect(() => {
    const onResize = () => setPosition((p) => clamp(p.x, p.y));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [clamp]);

  return {
    position,
    setPosition,
    dragHandleProps: { onPointerDown, style: { touchAction: "none" as const } },
  };
}
