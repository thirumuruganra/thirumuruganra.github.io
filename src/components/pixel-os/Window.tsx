import { useEffect, useRef, useState, type ReactNode } from "react";
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
  const winW = isMobile ? Math.min(vw - 16, 520) : Math.min(width, vw - 32);
  const winH = isMobile ? Math.min(vh - 160, 600) : Math.min(height, vh - 120);
  const { position, setPosition, dragHandleProps } = useDraggable(initial, {
    disabled: state.maximized || isMobile,
    getSize: () => ({ w: winW, h: winH }),
    topInset: 48,
    bottomInset: 100,
  });
  const firstOpen = useRef(true);

  useEffect(() => {
    if (state.open && !state.minimized && firstOpen.current) {
      firstOpen.current = false;
    }
  }, [state.open, state.minimized]);

  if (!state.open || state.minimized) return null;

  const left = isMobile ? (vw - winW) / 2 : position.x;
  const top = isMobile ? 56 : position.y;

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
      className="fixed bg-pixel-window text-foreground pixel-border pixel-shadow-lg flex flex-col anim-window-in"
      style={style}
      onPointerDown={onFocus}
    >
      <div
        {...(isMobile ? {} : dragHandleProps)}
        className="flex items-center gap-2 px-3 py-2 bg-pixel-titlebar pixel-border-2 border-t-0 border-x-0 select-none cursor-grab active:cursor-grabbing"
        onDoubleClick={() => {
          onMaximize();
          if (!state.maximized) setPosition({ x: 8, y: 48 });
        }}
      >
        <div className="flex gap-1.5">
          <button
            aria-label="Close"
            onClick={onClose}
            className="w-4 h-4 rounded-full bg-[#ff5f57] border-2 border-black press-tap hover:brightness-110 transition-all"
          />
          <button
            aria-label="Minimize"
            onClick={onMinimize}
            className="w-4 h-4 rounded-full bg-[#febc2e] border-2 border-black press-tap hover:brightness-110 transition-all"
          />
          <button
            aria-label="Maximize"
            onClick={onMaximize}
            className="w-4 h-4 rounded-full bg-[#28c840] border-2 border-black press-tap hover:brightness-110 transition-all"
          />
        </div>
        <div className="flex-1 text-center font-display text-[9px] sm:text-xs tracking-wider text-foreground truncate">
          {title}
        </div>
        <div className="w-14" />
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
