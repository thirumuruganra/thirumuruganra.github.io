import { useCallback, useEffect, useState, type ReactNode } from "react";
import { useDraggable } from "./hooks/useDraggable";

export type WindowState = {
  open: boolean;
  minimized: boolean;
  maximized: boolean;
  z: number;
};

type Props = {
  title: string;
  state: WindowState;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
  initial: { x: number; y: number };
  width?: number;
  height?: number;
  children: ReactNode;
};

function useViewport() {
  const [vp, setVp] = useState({ w: 1024, h: 768 });
  useEffect(() => {
    const update = () => setVp({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);
  return vp;
}

export function PixelWindow({
  title,
  state,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  initial,
  width = 720,
  height = 520,
  children,
}: Props) {
  const { w: vw, h: vh } = useViewport();
  const isMobile = vw < 640;
  const winW = isMobile ? Math.min(vw - 20, 520) : Math.min(width, vw - 32);
  const winH = isMobile ? Math.min(vh - 210, 560) : Math.min(height, vh - 120);
  const getSize = useCallback(() => ({ w: winW, h: winH }), [winW, winH]);
  const { position, setPosition, dragHandleProps } = useDraggable(initial, {
    disabled: state.maximized,
    getSize,
    topInset: 48,
    bottomInset: 100,
  });
  if (!state.open || state.minimized) return null;

  const left = position.x;
  const top = position.y;

  const style: React.CSSProperties = state.maximized
    ? {
        left: 8,
        top: 48,
        width: "calc(100vw - 16px)",
        height: "calc(100vh - 140px)",
        zIndex: state.z,
      }
    : {
        left,
        top,
        width: winW,
        height: winH,
        zIndex: state.z,
      };

  return (
    <div
      className="fixed bg-pixel-window text-foreground pixel-border rounded-[18px] overflow-hidden flex flex-col anim-window-in"
      style={style}
      onPointerDown={onFocus}
    >
      <div
        {...dragHandleProps}
        className="flex items-center gap-3 px-3.5 py-2.5 bg-pixel-titlebar text-[color:var(--pixel-titlebar-ink)] border-b-2 border-[color:var(--pixel-border)] select-none cursor-grab active:cursor-grabbing"
        onDoubleClick={() => {
          onMaximize();
          if (!state.maximized) setPosition({ x: 8, y: 48 });
        }}
      >
        <div className="flex gap-1.5">
          <button
            aria-label="Close"
            onClick={onClose}
            className="w-[15px] h-[15px] rounded-full bg-[#d8624b] border-2 border-black press-tap hover:brightness-110 transition-all"
          />
          <button
            aria-label="Minimize"
            onClick={onMinimize}
            className="w-[15px] h-[15px] rounded-full bg-[#e6a740] border-2 border-black press-tap hover:brightness-110 transition-all"
          />
          <button
            aria-label="Maximize"
            onClick={onMaximize}
            className="w-[15px] h-[15px] rounded-full bg-[#8fa073] border-2 border-black press-tap hover:brightness-110 transition-all"
          />
        </div>
        <div className="flex-1 text-center font-display text-xs tracking-wider truncate">
          {title}
        </div>
        <div className="w-[62px]" />
      </div>
      <div
        className="flex-1 overflow-auto overscroll-contain p-4 sm:p-6 anim-fade-up"
        style={{ animationDelay: "80ms" }}
      >
        {children}
      </div>
    </div>
  );
}
