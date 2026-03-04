import "./StatsOverview.scss";
import type { GitHubRepo } from "@/lib/github";

interface StatsOverviewProps {
  repos: GitHubRepo[];
}

export function StatsOverview({ repos }: StatsOverviewProps) {
  const totalStars = repos.reduce((s, r) => s + r.stargazers_count, 0);
  const totalForks = repos.reduce((s, r) => s + r.forks_count, 0);
  const nonForkRepos = repos.filter((r) => !r.fork);

  const items = [
    { label: "Stars earned", value: totalStars },
    { label: "Forks", value: totalForks },
    { label: "Public repos", value: nonForkRepos.length },
  ];

  return (
    <div className="stats-overview">
      {items.map((item) => (
        <div key={item.label} className="stats-card">
          <span className="stats-value">{item.value.toLocaleString()}</span>
          <span className="stats-label">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
