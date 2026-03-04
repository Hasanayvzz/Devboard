import "./RepositoryList.scss";
import { useState, useEffect } from "react";
import { RepoCard } from "@/components/RepoCard/RepoCard";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Sparkles, Loader2 } from "lucide-react";
import type { GitHubRepo, GitHubUser } from "@/lib/github";
import { generateProfileSummary } from "@/lib/gemini";
type SortMode = "stars" | "updated" | "forks" | "name";
const REPOS_PER_PAGE = 10;
function sortRepos(repos: GitHubRepo[], mode: SortMode): GitHubRepo[] {
  const sorted = [...repos];
  switch (mode) {
    case "stars":
      return sorted.sort((a, b) => b.stargazers_count - a.stargazers_count);
    case "forks":
      return sorted.sort((a, b) => b.forks_count - a.forks_count);
    case "name":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "updated":
    default:
      return sorted.sort(
        (a, b) =>
          new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime()
      );
  }
}
interface RepositoryListProps {
  user: GitHubUser;
  repos: GitHubRepo[];
}
export function RepositoryList({ user, repos }: RepositoryListProps) {
  const [profileSummary, setProfileSummary] = useState<string | null>(null);
  const [isGeneratingProfile, setIsGeneratingProfile] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>("stars");
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const filtered = sortRepos(
    repos
      .filter((r) => !r.fork)
      .filter(
        (r) =>
          !filter ||
          r.name.toLowerCase().includes(filter.toLowerCase()) ||
          (r.language &&
            r.language.toLowerCase().includes(filter.toLowerCase()))
      ),
    sortMode
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / REPOS_PER_PAGE));
  const displayed = filtered.slice(
    (currentPage - 1) * REPOS_PER_PAGE,
    currentPage * REPOS_PER_PAGE
  );
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, sortMode]);
  useEffect(() => {
    async function loadSummary() {
      if (!import.meta.env.VITE_GEMINI_API_KEY) return;
      setIsGeneratingProfile(true);
      try {
        const topRepos = sortRepos(
          repos.filter((r) => !r.fork),
          "stars"
        )
          .slice(0, 5)
          .map((r) => `${r.name}: ${r.description || ""}`);
        const languages = Array.from(
          new Set(repos.map((r) => r.language).filter(Boolean))
        ) as string[];
        const summary = await generateProfileSummary(
          user.login,
          user.bio,
          user.public_repos,
          languages.slice(0, 5),
          topRepos
        );
        setProfileSummary(summary);
      } catch {
        setProfileSummary(null);
      } finally {
        setIsGeneratingProfile(false);
      }
    }
    setProfileSummary(null);
    if (user.login) {
      loadSummary();
    }
  }, [user.login, user.bio, user.public_repos, repos]);
  return (
    <div className="bottom-left">
      {isGeneratingProfile ? (
        <div className="profile-ai-summary loading">
          <Loader2
            size={16}
            className="animate-spin"
            style={{ color: "var(--fg-muted)" }}
          />
          <span>Analyzing developer profile...</span>
        </div>
      ) : profileSummary ? (
        <div className="profile-ai-summary">
          <Sparkles size={16} className="ai-icon" />
          <p>{profileSummary}</p>
        </div>
      ) : null}
      <div className="repos-header">
        <h3 className="section-title">
          Repositories
          <span className="repo-count">{filtered.length}</span>
        </h3>
        <div className="repos-controls">
          <input
            type="text"
            placeholder="Find a repository…"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="repo-filter-input"
            id="repo-filter"
          />
          <Tabs
            value={sortMode}
            onValueChange={(v) => setSortMode(v as SortMode)}>
            <TabsList className="sort-tabs">
              <TabsTrigger value="stars">Stars</TabsTrigger>
              <TabsTrigger value="updated">Recent</TabsTrigger>
              <TabsTrigger value="forks">Forks</TabsTrigger>
              <TabsTrigger value="name">Name</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      <div className="repo-grid">
        {displayed.map((r) => (
          <RepoCard key={r.id} repo={r} />
        ))}
        {displayed.length === 0 && (
          <p className="empty-state">No repositories match.</p>
        )}
      </div>
      {filtered.length > REPOS_PER_PAGE && (
        <div className="pagination">
          <Button
            variant="outline"
            size="sm"
            className="pagination-btn"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => p - 1)}>
            <ChevronLeft size={14} />
            Previous
          </Button>
          <div className="pagination-info">
            <span className="pagination-current">{currentPage}</span>
            <span className="pagination-sep">of</span>
            <span className="pagination-total">{totalPages}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="pagination-btn"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}>
            Next
            <ChevronRight size={14} />
          </Button>
        </div>
      )}
    </div>
  );
}
