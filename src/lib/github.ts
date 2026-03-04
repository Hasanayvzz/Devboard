const BASE = "https://api.github.com";

export interface GitHubUser {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  bio: string | null;
  company: string | null;
  location: string | null;
  blog: string | null;
  twitter_username: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  fork: boolean;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string | null;
  topics: string[];
  created_at: string;
  updated_at: string;
  pushed_at: string;
  size: number;
  license: { spdx_id: string; name: string } | null;
}

export interface GitHubEvent {
  id: string;
  type: string;
  created_at: string;
  repo: { name: string };
  payload: {
    commits?: { message: string; sha: string }[];
    action?: string;
    ref?: string;
    ref_type?: string;
  };
}

async function ghFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { Accept: "application/vnd.github+json" },
  });
  if (!res.ok) {
    if (res.status === 404) throw new Error("User not found");
    if (res.status === 403)
      throw new Error("API rate limit exceeded. Try again later.");
    throw new Error(`GitHub API error: ${res.status}`);
  }
  return res.json();
}

export async function fetchUser(username: string): Promise<GitHubUser> {
  return ghFetch<GitHubUser>(`/users/${username}`);
}

export async function fetchRepos(username: string): Promise<GitHubRepo[]> {
  return ghFetch<GitHubRepo[]>(
    `/users/${username}/repos?per_page=100&sort=pushed&direction=desc`
  );
}

export async function fetchEvents(username: string): Promise<GitHubEvent[]> {
  return ghFetch<GitHubEvent[]>(
    `/users/${username}/events/public?per_page=100`
  );
}

export interface LanguageStats {
  [lang: string]: number;
}

export function computeLanguageStats(repos: GitHubRepo[]): LanguageStats {
  const stats: LanguageStats = {};
  for (const r of repos) {
    if (r.language) {
      stats[r.language] = (stats[r.language] || 0) + 1;
    }
  }
  return stats;
}

export interface ActivityDay {
  date: string;
  count: number;
}

export function computeActivityHeatmap(events: GitHubEvent[]): ActivityDay[] {
  const map: Record<string, number> = {};
  for (const e of events) {
    const day = e.created_at.slice(0, 10);
    map[day] = (map[day] || 0) + 1;
  }
  return Object.entries(map)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export interface CommitInfo {
  date: string;
  repo: string;
  message: string;
  sha: string;
}

export function extractRecentCommits(events: GitHubEvent[]): CommitInfo[] {
  const commits: CommitInfo[] = [];
  for (const e of events) {
    if (e.type === "PushEvent" && e.payload.commits) {
      for (const c of e.payload.commits) {
        commits.push({
          date: e.created_at,
          repo: e.repo.name,
          message: c.message,
          sha: c.sha,
        });
      }
    }
  }
  return commits.slice(0, 50);
}
