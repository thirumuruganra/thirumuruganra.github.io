const tags = ["Based in Chennai, India"];
const arsenal: Array<[string, string]> = [
  ["Programming", "Java, Python, C"],
  ["Web", "TypeScript, React, JavaScript, HTML, CSS, FastAPI"],
  ["Data & AI", "Gen AI, Local LLMs, Machine Learning, Data Analysis"],
  ["Database", "Oracle SQL, MySQL"],
];

export function AboutWindow() {
  return (
    <div className="space-y-5">
      <h2 className="font-display text-base">Profile.app</h2>
      <p className="leading-snug text-lg">
        Hi, I'm Thirumurugan — an enthusiastic and detail-oriented Computer Science student with a
        solid foundation in software development and web technologies. Ranked in the top 3% of my
        batch, I am an adept problem-solver eager to apply technical skills to tackle real-world
        challenges.
      </p>
      <div className="flex flex-wrap gap-2">
        {tags.map((t) => (
          <span key={t} className="pixel-border-2 pixel-shadow-sm px-2 py-1 text-sm bg-pixel-titlebar">
            [{t}]
          </span>
        ))}
      </div>
      <div>
        <h3 className="font-display text-xs mb-3">// TECHNICAL ARSENAL</h3>
        <ul className="space-y-2">
          {arsenal.map(([k, v]) => (
            <li key={k} className="pixel-border-2 pixel-shadow-sm p-2 bg-pixel-window flex flex-col sm:flex-row sm:gap-3">
              <span className="font-display text-[10px] sm:w-32 text-pixel-accent">{k}</span>
              <span className="text-lg">{v}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
