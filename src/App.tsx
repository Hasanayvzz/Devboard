import { useState } from "react";
import { SearchBar } from "@/components/SearchBar/SearchBar";
import { ProfileCard } from "@/components/ProfileCard/ProfileCard";
import { StatsOverview } from "@/components/StatsOverview/StatsOverview";
import { LanguageChart } from "@/components/LanguageChart/LanguageChart";
import { ActivityHeatmap } from "@/components/ActivityHeatmap/ActivityHeatmap";
import { CommitFeed } from "@/components/CommitFeed/CommitFeed";
import { RepositoryList } from "@/components/RepositoryList/RepositoryList";
import { LoadingSkeleton } from "@/components/LoadingSkeleton/LoadingSkeleton";
import { EmptyState } from "@/components/EmptyState/EmptyState";
import "./App.scss";
import {
  fetchUser,
  fetchRepos,
  fetchEvents,
  computeLanguageStats,
  computeActivityHeatmap,
  extractRecentCommits,
  type GitHubUser,
  type GitHubRepo,
  type GitHubEvent,
} from "@/lib/github";
import { Toaster, toast } from "sonner";

export default function App() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [events, setEvents] = useState<GitHubEvent[]>([]);

  const handleSearch = async (username: string) => {
    setLoading(true);
    try {
      const [u, r, e] = await Promise.all([
        fetchUser(username),
        fetchRepos(username),
        fetchEvents(username),
      ]);
      setUser(u);
      setRepos(r);
      setEvents(e);
    } catch (err) {
      toast.error((err as Error).message || "Something went wrong");
      setUser(null);
      setRepos([]);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const langStats = repos.length ? computeLanguageStats(repos) : {};
  const activityData = events.length ? computeActivityHeatmap(events) : [];
  const recentCommits = events.length ? extractRecentCommits(events) : [];

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "var(--toast-bg)",
            color: "var(--toast-fg)",
            border: "1px solid var(--border-default)",
          },
        }}
      />

      <div className="app-container">
        <header className="app-header">
          <div className="header-content">
            <div className="logo-area">
              <h1 className="logo-text">Devboard</h1>
            </div>
            <SearchBar onSearch={handleSearch} loading={loading} />
          </div>
        </header>

        {user && (
          <main className="dashboard fade-in">
            <div className="dashboard-top">
              <ProfileCard user={user} />
              <div className="dashboard-top-right">
                <StatsOverview repos={repos} />
                <LanguageChart stats={langStats} />
                <ActivityHeatmap data={activityData} />
              </div>
            </div>

            <section className="bottom-section">
              <RepositoryList user={user} repos={repos} />
              <CommitFeed commits={recentCommits} />
            </section>
          </main>
        )}

        {loading && <LoadingSkeleton />}

        {!user && !loading && <EmptyState />}

        <footer className="app-footer">
          <span>Built with GitHub REST API · No authentication required</span>
        </footer>
      </div>
    </>
  );
}
