import { Hand } from "pixelarticons/react/Hand";
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
  { id: "home", label: "hi!", Icon: Hand },
  { id: "work", label: "Work", Icon: Briefcase },
  { id: "about", label: "About", Icon: User },
  { id: "contact", label: "Contact", Icon: Mail },
  { id: "resume", label: "Resume", Icon: File },
];

export function Dock({ onOpen, onHome }: Props) {
  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-[9998]">
      <div
        className="flex items-center gap-4 sm:gap-[22px] px-4 sm:px-[22px] py-3 pixel-border"
        style={{
          background: "color-mix(in oklab, var(--pixel-dock) 82%, transparent)",
          backdropFilter: "blur(10px)",
          borderRadius: 22,
        }}
      >
        {items.map(({ id, label, Icon }, i) => (
          <button
            key={id}
            onClick={() => (id === "home" ? onHome() : onOpen(id))}
            className="flex flex-col items-center gap-1 w-[52px] press-tap anim-dock-in hover:-translate-y-1.5 transition-transform"
            style={{ animationDelay: `${i * 60}ms` }}
            aria-label={label}
          >
            <span className="grid place-items-center w-[42px] h-[42px] bg-pixel-window pixel-border rounded-[13px]">
              <Icon className="w-6 h-6 text-foreground" />
            </span>
            <span className="font-display text-[11px] sm:text-sm leading-none">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
