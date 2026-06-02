// Map repo name (case-insensitive) -> { emoji or image URL, category subtitle }
// Examples:
//   "my-cool-repo": { icon: "🚀", category: "Website Design" },
//   "portfolio":    { icon: "/icons/portfolio.png", category: "Web App" },

export type RepoMeta = { icon?: string; category?: string };

export const repoIcons: Record<string, RepoMeta> = {
  // add your icons here
};

export function getRepoMeta(name: string): RepoMeta {
  const key = name.toLowerCase();
  for (const k of Object.keys(repoIcons)) {
    if (k.toLowerCase() === key) return repoIcons[k];
  }
  return {};
}

export function getRepoIcon(name: string): string | null {
  return getRepoMeta(name).icon ?? null;
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
