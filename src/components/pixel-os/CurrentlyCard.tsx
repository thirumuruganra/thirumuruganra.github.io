import { BookOpenIcon, CheckDoubleIcon, MusicIcon } from "./icons";

const items = [
  { Icon: CheckDoubleIcon, label: "Exploring DevOps and Agentic AI" },
  { Icon: BookOpenIcon, label: "Designing Data-Intensive Applications" },
  { Icon: MusicIcon, label: "Anirudh, on repeat" },
];

export function CurrentlyCard() {
  return (
    <div
      className="static w-auto lg:fixed lg:z-[1] lg:right-11 lg:top-[436px] lg:w-[246px] p-3.5 bg-pixel-window pixel-border rounded-[16px] anim-pop-in"
      style={{ animationDelay: "140ms" }}
    >
      <div className="font-display text-sm tracking-wider text-pixel-muted">CURRENTLY</div>
      <div className="grid gap-2.5 mt-3 text-sm">
        {items.map(({ Icon, label }) => (
          <div key={label} className="grid grid-cols-[20px_1fr] gap-2.5 items-start">
            <Icon className="w-[19px] h-[19px] mt-0.5 text-[color:var(--color-accent-2-600)]" />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
