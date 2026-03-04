import "./EmptyState.scss";
import { Search, BarChart3, GitFork, Activity, Sparkles } from "lucide-react";

export function EmptyState() {
  return (
    <div className="empty-hero fade-in">
      <Search className="empty-icon" strokeWidth={1.5} />
      <h2 className="empty-title">Look up any GitHub developer</h2>
      <p className="empty-text">
        Enter a username to see their profile, repositories, language usage, and
        contribution activity — all from the public GitHub API.
      </p>

      <div className="empty-features">
        <div className="empty-feature">
          <BarChart3 size={18} />
          <div className="empty-feature-text">
            <span className="empty-feature-label">Stats & languages</span>
            <span className="empty-feature-desc">
              Stars, forks, and top programming languages at a glance
            </span>
          </div>
        </div>
        <div className="empty-feature">
          <Activity size={18} />
          <div className="empty-feature-text">
            <span className="empty-feature-label">Activity heatmap</span>
            <span className="empty-feature-desc">
              Contribution patterns visualized over the last year
            </span>
          </div>
        </div>
        <div className="empty-feature">
          <GitFork size={18} />
          <div className="empty-feature-text">
            <span className="empty-feature-label">Repositories</span>
            <span className="empty-feature-desc">
              Browse, filter, and sort all public repos
            </span>
          </div>
        </div>
        <div className="empty-feature">
          <Search size={18} />
          <div className="empty-feature-text">
            <span className="empty-feature-label">No login needed</span>
            <span className="empty-feature-desc">
              Works with any public GitHub profile, no auth required
            </span>
          </div>
        </div>
        <div className="empty-feature ai-feature">
          <Sparkles size={18} className="ai-icon-empty" />
          <div className="empty-feature-text">
            <span className="empty-feature-label">AI Insights</span>
            <span className="empty-feature-desc">
              Instant developer persona and technical repo summaries powered by
              AI
            </span>
          </div>
        </div>
      </div>

      <p className="empty-hint">
        Try searching for <strong>torvalds</strong>, <strong>gaearon</strong>,
        or <strong>sindresorhus</strong>
      </p>
    </div>
  );
}
