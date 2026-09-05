import { lazy, Suspense, useState } from "react";
import { FolderIcon } from "../icons";
import { usePinnedRepos, type Repo } from "../hooks/usePinnedRepos";
import { getRepoCategory, getRepoMeta } from "../repoIcons";

// Split out react-markdown/remark-gfm (~40kB gzip) so it loads only when a project is opened.
const ProjectDetail = lazy(() =>
  import("./ProjectDetail").then((m) => ({ default: m.ProjectDetail })),
);

function RepoIcon({ name }: { name: string }) {
  const icon = getRepoMeta(name).icon;
  if (!icon) return <FolderIcon className="w-10 h-10 text-pixel-accent" />;
  const rounded = name.toLowerCase() !== "clg-clubs";
  return (
    <div className={`w-10 h-10 overflow-hidden ${rounded ? "rounded-[8px]" : ""}`}>
      <img
        src={icon}
        alt=""
        width={40}
        height={40}
        loading="lazy"
        decoding="async"
        className={`w-full h-full block object-cover ${rounded ? "rounded-[8px]" : ""}`}
        style={{ imageRendering: "pixelated" }}
      />
    </div>
  );
}

export function WorkWindow() {
  const { repos, loading, error } = usePinnedRepos();
  const [selected, setSelected] = useState<Repo | null>(null);

  if (selected) {
    return (
      <Suspense
        fallback={<div className="text-pixel-accent font-display text-sm animate-pulse">Loading…</div>}
      >
        <ProjectDetail repo={selected} onBack={() => setSelected(null)} />
      </Suspense>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="font-display text-lg sm:text-xl">Projects</h2>
      {loading && (
        <div className="text-pixel-accent font-display text-sm animate-pulse">Loading…</div>
      )}
      {error && !loading && (
        <div className="pixel-border-2 rounded-[12px] p-3 text-sm">
          Couldn't load projects. Try refreshing.
        </div>
      )}
      {repos && (
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {repos.map((r, i) => (
            <button
              key={r.name}
              onClick={() => setSelected(r)}
              className="text-left p-3 sm:p-4 pixel-border-2 rounded-[14px] bg-pixel-window hover:bg-pixel-titlebar press-tap anim-fade-up flex flex-col items-start gap-2 transition-colors"
              style={{ animationDelay: `${Math.min(i, 12) * 40}ms` }}
            >
              <RepoIcon name={r.name} />
              <div className="font-display text-sm sm:text-base font-semibold truncate w-full">
                {r.name}
              </div>
              <div className="text-sm text-pixel-muted truncate w-full">
                {getRepoCategory(r.name, r.language)}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
