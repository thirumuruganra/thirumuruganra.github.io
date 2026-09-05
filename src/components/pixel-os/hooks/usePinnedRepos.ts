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
  const data = await res.json();
  if (!Array.isArray(data) || data.length === 0) throw new Error("repos.json empty");
  return mapPinned(data);
}

async function fetchPinned(): Promise<Repo[]> {
  const res = await fetch(`https://pinned.berrysauce.dev/get/${USERNAME}`);
  if (!res.ok) throw new Error("pinned api failed");
  return mapPinned(await res.json());
}

function mapPinned(data: PinnedRaw): Repo[] {
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

async function fetchFallback(): Promise<Repo[]> {
  const res = await fetch(
    `https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=30`,
  );
  if (!res.ok) throw new Error("github api failed");
  const data: Array<{
    name: string;
    description: string | null;
    language: string | null;
    html_url: string;
    stargazers_count: number;
    forks_count: number;
    fork: boolean;
  }> = await res.json();
  return data
    .filter((r) => !r.fork)
    .slice(0, 6)
    .map((r) => ({
      name: r.name,
      description: r.description ?? "",
      language: r.language,
      html_url: r.html_url ?? `https://github.com/${USERNAME}/${r.name}`,
      stars: r.stargazers_count,
      forks: r.forks_count,
    }));
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
        const list = await fetchStatic()
          .catch(() => fetchPinned())
          .catch(() => fetchFallback());
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
