import "./CommitFeed.scss";
import type { CommitInfo } from "@/lib/github";
import { GitCommitHorizontal } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CommitFeedProps {
  commits: CommitInfo[];
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

export function CommitFeed({ commits }: CommitFeedProps) {
  if (!commits.length) {
    return (
      <div className="commit-feed-card">
        <h3 className="section-title">Recent Commits</h3>
        <p className="empty-state">No recent push events found.</p>
      </div>
    );
  }

  return (
    <div className="commit-feed-card">
      <h3 className="section-title">Recent Commits</h3>
      <ScrollArea className="commit-scroll">
        <div className="commit-list">
          {commits.map((c, i) => (
            <div key={`${c.sha}-${i}`} className="commit-item">
              <div className="commit-icon-wrapper">
                <GitCommitHorizontal size={14} />
              </div>
              <div className="commit-content">
                <p className="commit-message">{c.message.split("\n")[0]}</p>
                <div className="commit-meta">
                  <span className="commit-repo">{c.repo.split("/")[1]}</span>
                  <span className="commit-time">{relativeTime(c.date)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
