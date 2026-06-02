import { Home } from "pixelarticons/react/Home";
import { Briefcase } from "pixelarticons/react/Briefcase";
import { User } from "pixelarticons/react/User";
import { Mail } from "pixelarticons/react/Mail";
import { File } from "pixelarticons/react/File";
import type { ComponentType, SVGProps } from "react";
import type { WindowId } from "./PixelDesktop";

type Props = {
  onOpen: (id: WindowId) => void;
  onHome: () => void;
};

type Item = {
  id: WindowId | "home";
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
};

const items: Item[] = [
  { id: "home", label: "Home", Icon: Home },
  { id: "work", label: "Work", Icon: Briefcase },
  { id: "about", label: "About", Icon: User },
  { id: "contact", label: "Contact", Icon: Mail },
  { id: "resume", label: "Resume", Icon: File },
];

export function Dock({ onOpen, onHome }: Props) {
  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-[9998]">
      <div
        className="flex items-end gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 pixel-border"
        style={{
          background: "color-mix(in oklab, var(--pixel-dock) 80%, transparent)",
          backdropFilter: "blur(10px)",
          borderRadius: 14,
        }}
      >
        {items.map(({ id, label, Icon }, i) => (
          <button
            key={id}
            onClick={() => (id === "home" ? onHome() : onOpen(id))}
            className="flex flex-col items-center justify-center px-0.5 press-tap anim-dock-in hover:-translate-y-0.5 transition-transform"
            style={{ animationDelay: `${i * 60}ms` }}
            aria-label={label}
          >
            <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-foreground" />
            <span className="font-display text-[9px] sm:text-[10px] mt-0">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
