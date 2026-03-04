import "./RepoCard.scss";
import type { GitHubRepo } from "@/lib/github";
import {
  Star,
  GitFork,
  Circle,
  ExternalLink,
  Sparkles,
  Loader2,
} from "lucide-react";
import { getLangColor } from "@/lib/language-colors";
import { generateRepoSummary } from "@/lib/gemini";
import { useState } from "react";
interface RepoCardProps {
  repo: GitHubRepo;
}
function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}
export function RepoCard({ repo }: RepoCardProps) {
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const handleGenerateSummary = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isGenerating) return;
    setIsGenerating(true);
    try {
      const summary = await generateRepoSummary(repo);
      setAiSummary(summary);
    } catch {
      setAiSummary("AI summary unavailable (check API key or limit).");
    } finally {
      setIsGenerating(false);
    }
  };
  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noreferrer"
      className="repo-card"
      id={`repo-${repo.name}`}>
      <div className="repo-card-top">
        <div className="repo-name-row">
          <div className="repo-name-left">
            <h3 className="repo-name">{repo.name}</h3>
            <ExternalLink size={13} className="repo-link-icon" />
          </div>
          <button
            className="ai-analyze-btn"
            onClick={handleGenerateSummary}
            disabled={isGenerating || !!aiSummary}
            title="Generate AI Summary">
            {isGenerating ? (
              <>
                <Loader2
                  size={13}
                  className="animate-spin text-muted-foreground"
                />
                <span className="ai-btn-text">Analyzing...</span>
              </>
            ) : (
              <>
                <Sparkles size={13} />
                <span className="ai-btn-text">Analyze</span>
              </>
            )}
          </button>
        </div>
        {aiSummary ? (
          <div className="repo-ai-summary">
            <Sparkles size={12} className="ai-icon" />
            <p>{aiSummary}</p>
          </div>
        ) : repo.description ? (
          <p className="repo-description">{repo.description}</p>
        ) : null}
      </div>
      <div className="repo-card-bottom">
        <div className="repo-meta-left">
          {repo.language && (
            <span className="repo-lang">
              <Circle
                size={10}
                fill={getLangColor(repo.language)}
                stroke="none"
              />
              {repo.language}
            </span>
          )}
          {repo.stargazers_count > 0 && (
            <span className="repo-stat">
              <Star size={13} /> {repo.stargazers_count}
            </span>
          )}
          {repo.forks_count > 0 && (
            <span className="repo-stat">
              <GitFork size={13} /> {repo.forks_count}
            </span>
          )}
        </div>
        <span className="repo-updated">{timeAgo(repo.pushed_at)}</span>
      </div>
    </a>
  );
}
