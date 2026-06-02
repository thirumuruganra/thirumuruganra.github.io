import { createFileRoute, Link } from "@tanstack/react-router";
import { ProjectDetail } from "@/components/pixel-os/windows/ProjectDetail";
import { usePinnedRepos } from "@/components/pixel-os/hooks/usePinnedRepos";

export const Route = createFileRoute("/projects/$repo")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.repo} — Thirumurugan RA` },
      { name: "description", content: `${params.repo} — project by Thirumurugan RA.` },
      { property: "og:title", content: `${params.repo} — Thirumurugan RA` },
      {
        property: "og:description",
        content: `${params.repo} — project by Thirumurugan RA.`,
      },
    ],
  }),
  component: ProjectRoute,
});

function ProjectRoute() {
  const { repo } = Route.useParams();
  const { repos, loading } = usePinnedRepos();

  const found = repos?.find((r) => r.name.toLowerCase() === repo.toLowerCase());

  const fallback = {
    name: repo,
    description: "",
    language: null,
    html_url: `https://github.com/thirumuruganra/${repo}`,
    stars: 0,
    forks: 0,
  };

  return (
    <div className="min-h-screen p-4 sm:p-8 overflow-auto">
      <div className="max-w-3xl mx-auto">
        <Link
          to="/"
          className="inline-block mb-4 pixel-border-2 pixel-shadow-sm px-3 py-1 bg-pixel-window hover:bg-pixel-titlebar text-sm"
        >
          ← Back to Desktop
        </Link>
        <div className="pixel-border pixel-shadow-lg bg-pixel-window p-4 sm:p-6">
          {loading && !found ? (
            <div className="font-display text-xs animate-pulse">Loading…</div>
          ) : (
            <ProjectDetail repo={found ?? fallback} />
          )}
        </div>
      </div>
    </div>
  );
}
