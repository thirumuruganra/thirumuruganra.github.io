import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeftIcon, ExternalIcon, FolderIcon, ForkIcon, StarIcon } from "../icons";
import type { Repo } from "../hooks/usePinnedRepos";

type Props = {
  repo: Repo;
  onBack?: () => void;
};

export function ProjectDetail({ repo, onBack }: Props) {
  const [readme, setReadme] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setReadme(null);
    (async () => {
      const branches = ["main", "master", "HEAD"];
      for (const b of branches) {
        try {
          const r = await fetch(
            `https://raw.githubusercontent.com/thirumuruganra/${repo.name}/${b}/README.md`,
          );
          if (r.ok) {
            const txt = await r.text();
            if (alive) {
              setReadme(txt);
              setLoading(false);
            }
            return;
          }
        } catch {
          /* try next */
        }
      }
      if (alive) setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, [repo.name]);

  const branch = "main";
  const rawBase = `https://raw.githubusercontent.com/thirumuruganra/${repo.name}/${branch}/`;
  const repoBase = `https://github.com/thirumuruganra/${repo.name}/blob/${branch}/`;

  return (
    <div className="space-y-4">
      {onBack && (
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 pixel-border-2 pixel-shadow-sm px-2 py-1 bg-pixel-window hover:bg-pixel-titlebar text-sm"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Projects
        </button>
      )}

      <div className="flex items-start gap-3">
        <FolderIcon className="w-10 h-10 text-pixel-accent shrink-0" />
        <div className="min-w-0">
          <h2 className="font-display text-sm sm:text-base break-words">{repo.name}</h2>
          <div className="flex flex-wrap items-center gap-2 mt-2 text-sm">
            {repo.language && (
              <span className="pixel-border-2 px-2 py-0.5 bg-pixel-titlebar">{repo.language}</span>
            )}
            <span className="inline-flex items-center gap-1">
              <StarIcon className="w-4 h-4" /> {repo.stars}
            </span>
            <span className="inline-flex items-center gap-1">
              <ForkIcon className="w-4 h-4" /> {repo.forks}
            </span>
          </div>
        </div>
      </div>

      {repo.description && (
        <p className="text-lg leading-snug pixel-border-2 pixel-shadow-sm p-3 bg-pixel-window">
          {repo.description}
        </p>
      )}

      <a
        href={repo.html_url}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 pixel-border pixel-shadow px-4 py-3 bg-pixel-accent text-black font-display text-[11px] hover:translate-x-0.5 hover:translate-y-0.5 transition-transform"
      >
        Open on GitHub
        <ExternalIcon className="w-4 h-4" />
      </a>

      <div>
        <h3 className="font-display text-[10px] mb-2">// README</h3>
        <div className="pixel-border-2 pixel-shadow-sm p-4 bg-pixel-window min-h-[100px] text-base break-words readme-md">
          {loading && <span className="animate-pulse">Loading README…</span>}
          {!loading && !readme && (
            <span className="text-pixel-muted">No README found for this repo.</span>
          )}
          {!loading && readme && (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              urlTransform={(url) => {
                if (/^(https?:|mailto:|#)/i.test(url)) return url;
                if (url.startsWith("/")) return repoBase + url.slice(1);
                return rawBase + url;
              }}
              components={{
                a: (props) => (
                  <a
                    {...props}
                    target="_blank"
                    rel="noreferrer"
                    className="text-pixel-accent underline"
                  />
                ),
                img: (props) => (
                  <img
                    {...props}
                    className="max-w-full inline-block my-2"
                    loading="lazy"
                    alt={props.alt ?? ""}
                  />
                ),
              }}
            >
              {readme}
            </ReactMarkdown>
          )}
        </div>
      </div>
    </div>
  );
}
