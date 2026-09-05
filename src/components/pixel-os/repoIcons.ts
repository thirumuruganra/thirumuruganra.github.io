// Map lowercase repo name -> { image URL, category subtitle }
// Example:
//   "portfolio": { icon: "/icons/portfolio.png", category: "Web App" },

export type RepoMeta = { icon?: string; category?: string };

export const repoIcons: Record<string, RepoMeta> = {
  "note-it": { icon: "/project-icons/note-it.png", category: "VSC Extension" },
  truetone: { icon: "/project-icons/truetone.png" },
  "clg-clubs": { icon: "/project-icons/clg-clubs.png" },
  phishtank: { icon: "/project-icons/PhishTank.png", category: "Cybersecurity & AI" },
  "pacman-using-c-and-raylib": {
    icon: "/project-icons/PACMAN-using-C-and-RAYLIB.png",
    category: "Game",
  },
  paisa: { icon: "/project-icons/paisa.png" },
};

export function getRepoMeta(name: string): RepoMeta {
  return repoIcons[name.toLowerCase()] ?? {};
}

// Pick a friendly category label, falling back to language → category map
const langToCategory: Record<string, string> = {
  TypeScript: "Web App",
  JavaScript: "Web App",
  HTML: "Website Design",
  CSS: "Website Design",
  Python: "Data & AI",
  Jupyter: "Data & AI",
  Java: "Software",
  C: "Systems",
  "C++": "Systems",
};

export function getRepoCategory(name: string, language: string | null): string {
  const meta = getRepoMeta(name);
  if (meta.category) return meta.category;
  if (language && langToCategory[language]) return langToCategory[language];
  return "Project";
}
