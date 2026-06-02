import { ExternalIcon, MailIcon } from "../icons";

export function ContactWindow() {
  return (
    <div className="space-y-5">
      <h2 className="font-display text-base">Mail.app</h2>
      <p className="text-lg leading-snug">
        Let's make something ✨. Currently exploring new opportunities in software engineering, ML,
        and web development. If it sounds fun, send a note.
      </p>
      <a
        href="mailto:thirumuruganra@gmail.com"
        className="flex items-center justify-center gap-3 w-full pixel-border pixel-shadow p-4 bg-pixel-accent text-black font-display text-xs sm:text-sm hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 transition-transform"
      >
        <MailIcon className="w-5 h-5" />
        thirumuruganra@gmail.com
      </a>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <a
          href="https://www.linkedin.com/in/thirumuruganra"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between p-3 pixel-border-2 pixel-shadow-sm bg-pixel-window hover:bg-pixel-titlebar"
        >
          <span className="font-display text-[10px]">LinkedIn</span>
          <ExternalIcon className="w-4 h-4" />
        </a>
        <a
          href="https://github.com/thirumuruganra"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between p-3 pixel-border-2 pixel-shadow-sm bg-pixel-window hover:bg-pixel-titlebar"
        >
          <span className="font-display text-[10px]">GitHub</span>
          <ExternalIcon className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
