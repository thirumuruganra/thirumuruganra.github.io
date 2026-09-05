const tags = ["Java · Python · C", "React · TypeScript", "Gen AI · ML", "SQL"];

export function BioCard() {
  return (
    <div>
      <div className="font-display text-xs tracking-[0.1em] text-[color:var(--pixel-kicker)]">// HELLO WORLD</div>
      <h1 className="font-display text-3xl sm:text-[36px] font-semibold leading-[1.1] mt-2.5">
        I build software that
        <br />
        feels like a nice place.
      </h1>
      <p className="text-lg leading-snug mt-4 max-w-[54ch]">
        CSE undergrad at SSN, Chennai, top 5% of my batch. I spend my days on web apps, a bit of
        Gen AI, and far too long nudging pixels one at a time. Ex-SWE Intern @ Barclays, Value AI
        Labs.
      </p>
      <div className="flex flex-wrap gap-2.5 mt-5">
        {tags.map((tag) => (
          <span
            key={tag}
            className="px-3.5 py-1 border-2 border-[color:var(--color-accent-2-600)] bg-[color:var(--color-accent-2-100)] text-[color:var(--color-accent-2-800)] rounded-full text-sm font-semibold"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-3 mt-6 flex-wrap">
        <a
          href="mailto:thirumuruganra@gmail.com"
          className="inline-flex items-center gap-2.5 px-5 py-3 bg-pixel-accent text-[#fff8f2] pixel-border rounded-full font-display text-lg no-underline press-tap hover:translate-x-0.5 hover:translate-y-0.5 transition-transform"
        >
          Mail — say hi
        </a>
        <a
          href="https://github.com/thirumuruganra"
          className="inline-flex items-center px-5 py-2.5 pixel-border rounded-full bg-[color:var(--pixel-surface-2)] font-display text-base no-underline text-foreground press-tap hover:translate-x-0.5 hover:translate-y-0.5 transition-transform"
        >
          GitHub
        </a>
        <a
          href="https://www.linkedin.com/in/thirumuruganra"
          className="inline-flex items-center px-5 py-2.5 pixel-border rounded-full bg-[color:var(--pixel-surface-2)] font-display text-base no-underline text-foreground press-tap hover:translate-x-0.5 hover:translate-y-0.5 transition-transform"
        >
          LinkedIn
        </a>
        <span className="font-sticky text-lg text-pixel-muted">
          ↖ replies within a day, promise
        </span>
      </div>
    </div>
  );
}
