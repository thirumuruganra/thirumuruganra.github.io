const experience = [
  {
    role: "Engineering Intern",
    company: "Value AI Labs",
    period: "Dec 2025 — Present",
    desc: "Automating WordPress blog publishing and implementing automated regression testing for client websites.",
  },
  {
    role: "Engineering Intern",
    company: "Value AI Labs",
    period: "June 2025",
    desc: "Key contributor for BOREX, a web app for borrower verification. Built UI and backend AI components.",
  },
  {
    role: "Video Editor",
    company: "Freelance",
    period: "Jan 2025 — Present",
    desc: "Edited 30+ brand and product videos for various local businesses.",
  },
];

export function ResumeWindow() {
  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <h2 className="font-display text-base">Résumé — 2026</h2>
        <a
          href="/Thirumurugan_RA_CV.pdf"
          download
          className="pixel-border-2 pixel-shadow-sm px-3 py-2 bg-pixel-accent text-black font-display text-[10px]"
        >
          Download PDF
        </a>
      </div>

      <section>
        <h3 className="font-display text-xs mb-3">// EXPERIENCE</h3>
        <ul className="space-y-3">
          {experience.map((e, i) => (
            <li key={i} className="pixel-border-2 pixel-shadow-sm p-3 bg-pixel-window">
              <div className="flex justify-between gap-2 flex-wrap">
                <div className="font-display text-[11px]">{e.role}</div>
                <div className="text-sm text-pixel-muted">{e.period}</div>
              </div>
              <div className="text-lg text-pixel-accent">{e.company}</div>
              <p className="text-base mt-1 leading-snug">{e.desc}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="font-display text-xs mb-3">// EDUCATION</h3>
        <div className="pixel-border-2 pixel-shadow-sm p-3 bg-pixel-window">
          <div className="font-display text-[11px]">B.E. Computer Science and Engineering</div>
          <div className="text-lg text-pixel-accent">SSN College of Engineering</div>
          <div className="text-base mt-1">Class of 2027 · CGPA 8.849</div>
        </div>
      </section>
    </div>
  );
}
