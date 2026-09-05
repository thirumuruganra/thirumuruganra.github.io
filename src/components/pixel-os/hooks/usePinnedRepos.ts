import { useEffect, useState } from "react";

export type Repo = {
  name: string;
  description: string;
  language: string | null;
  html_url: string;
  stars: number;
  forks: number;
};

// Shape emitted by .github/workflows/refresh-repos.yml (which hard-fails on anything else).
type PinnedRaw = Array<{
  name: string;
  description: string;
  language: string | null;
  link: string;
  stars: number;
  forks: number;
}>;

async function fetchStatic(): Promise<Repo[]> {
  const res = await fetch("/repos.json", { cache: "no-cache" });
  if (!res.ok) throw new Error("repos.json missing");
  const data: PinnedRaw = await res.json();
  if (!Array.isArray(data) || data.length === 0) throw new Error("repos.json empty");
  return data.map(({ link, ...r }) => ({ ...r, html_url: link }));
}

let cache: Repo[] | null = null;

export function usePinnedRepos() {
  const [repos, setRepos] = useState<Repo[] | null>(cache);
  const [loading, setLoading] = useState(!cache);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cache) return;
    let alive = true;
    (async () => {
      try {
        const list = await fetchStatic();
        if (!alive) return;
        cache = list;
        setRepos(list);
      } catch (e) {
        if (!alive) return;
        setError((e as Error).message);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return { repos, loading, error };
}
