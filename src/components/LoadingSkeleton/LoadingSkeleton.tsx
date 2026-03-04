import "./LoadingSkeleton.scss";
import { Loader2 } from "lucide-react";

export function LoadingSkeleton() {
  return (
    <div className="loading-skeleton fade-in">
      <div className="skeleton-top">
        <div className="skeleton-profile">
          <div className="skeleton-avatar" />
          <div className="skeleton-lines">
            <div className="skeleton-line skeleton-line-lg" />
            <div className="skeleton-line skeleton-line-md" />
          </div>
        </div>
        <div className="skeleton-right">
          <div className="skeleton-stats">
            <div className="skeleton-stat-block" />
            <div className="skeleton-stat-block" />
            <div className="skeleton-stat-block" />
          </div>
          <div className="skeleton-chart" />
          <div className="skeleton-heatmap" />
        </div>
      </div>
      <div className="skeleton-loading-text">
        <Loader2 className="animate-spin" size={16} />
        <span>Fetching profile data…</span>
      </div>
    </div>
  );
}
