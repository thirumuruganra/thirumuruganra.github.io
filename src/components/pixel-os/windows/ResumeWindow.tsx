const experience = [
  {
    role: "Technology Intern",
    company: "Barclays",
    period: "June 2026 — July 2026",
    desc: "Led containerization of the Model Services CoE microservices with Docker, Kubernetes, and AWS. Worked in a cross-functional corporate team.",
  },
  {
    role: "SWE Intern",
    company: "Value AI Labs",
    period: "Dec 2025 — Feb 2026",
    desc: "Automated WordPress blog publishing and built automated regression testing for client websites.",
  },
  {
    role: "SWE Intern",
    company: "Value AI Labs",
    period: "June 2025",
    desc: "Key contributor for BOREX, a web app for borrower verification in real estate. Built frontend UI and backend AI components.",
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
          className="pixel-border-2 rounded-full px-5 py-2.5 bg-pixel-accent text-black font-display text-xs"
        >
          Download PDF
        </a>
      </div>

      <section>
        <h3 className="font-display text-xs mb-3">// EXPERIENCE</h3>
        <ul className="space-y-3">
          {experience.map((e, i) => (
            <li key={i} className="pixel-border-2 rounded-[12px] p-3 bg-pixel-window">
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
        <div className="pixel-border-2 rounded-[12px] p-3 bg-pixel-window">
          <div className="font-display text-[11px]">B.E. Computer Science and Engineering</div>
          <div className="text-lg text-pixel-accent">Sri Sivasubramaniya Nadar College of Engineering</div>
          <div className="text-base mt-1">2023 — 2027 · CGPA 8.85 (till 6th sem) · Ranked 9th / 180</div>
        </div>
      </section>
    </div>
  );
}
