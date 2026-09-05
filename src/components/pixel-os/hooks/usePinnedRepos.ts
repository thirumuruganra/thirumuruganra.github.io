import { useEffect, useState } from "react";

export type Repo = {
  name: string;
  description: string;
  language: string | null;
  html_url: string;
  stars: number;
  forks: number;
};

const USERNAME = "thirumuruganra";

type PinnedRaw = Array<{
  author?: string;
  name?: string;
  repo?: string;
  description?: string | null;
  language?: string | null;
  link?: string;
  url?: string;
  stars?: number;
  forks?: number;
}>;

async function fetchStatic(): Promise<Repo[]> {
  const res = await fetch("/repos.json", { cache: "no-cache" });
  if (!res.ok) throw new Error("repos.json missing");
  const data: PinnedRaw = await res.json();
  if (!Array.isArray(data) || data.length === 0) throw new Error("repos.json empty");
  return data.map((r) => {
    const name = r.name ?? r.repo ?? "";
    const author = r.author ?? USERNAME;
    return {
      name,
      description: r.description ?? "",
      language: r.language ?? null,
      html_url: r.link ?? r.url ?? `https://github.com/${author}/${name}`,
      stars: r.stars ?? 0,
      forks: r.forks ?? 0,
    };
  });
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
