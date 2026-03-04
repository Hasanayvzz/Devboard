import "./ProfileCard.scss";
import type { GitHubUser } from "@/lib/github";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  MapPin,
  Building2,
  Link as LinkIcon,
  CalendarDays,
} from "lucide-react";

interface ProfileCardProps {
  user: GitHubUser;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
}

export function ProfileCard({ user }: ProfileCardProps) {
  return (
    <div className="profile-card">
      <div className="profile-header">
        <Avatar className="profile-avatar">
          <AvatarImage src={user.avatar_url} alt={user.login} />
          <AvatarFallback>
            {user.login.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="profile-info">
          <h2 className="profile-name">{user.name || user.login}</h2>
          <a
            href={user.html_url}
            target="_blank"
            rel="noreferrer"
            className="profile-handle">
            {user.login}
          </a>
        </div>
      </div>

      {user.bio && <p className="profile-bio">{user.bio}</p>}

      <div className="profile-meta">
        {user.company && (
          <span className="meta-item">
            <Building2 size={16} /> {user.company}
          </span>
        )}
        {user.location && (
          <span className="meta-item">
            <MapPin size={16} /> {user.location}
          </span>
        )}
        {user.blog && (
          <a
            href={
              user.blog.startsWith("http") ? user.blog : `https://${user.blog}`
            }
            target="_blank"
            rel="noreferrer"
            className="meta-item meta-link">
            <LinkIcon size={16} /> {user.blog}
          </a>
        )}
        <span className="meta-item">
          <CalendarDays size={16} /> Joined {formatDate(user.created_at)}
        </span>
      </div>

      <div className="profile-stats-row">
        <div className="stat-box">
          <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
            <path d="M2 5.5a3.5 3.5 0 1 1 5.898 2.549 5.508 5.508 0 0 1 3.034 4.084.75.75 0 1 1-1.482.235 4 4 0 0 0-7.9 0 .75.75 0 0 1-1.482-.236A5.507 5.507 0 0 1 3.102 8.05 3.493 3.493 0 0 1 2 5.5ZM11 4a.75.75 0 1 0 0 1.5 1.5 1.5 0 0 1 .666 2.844.75.75 0 0 0-.416.672v.352a.75.75 0 0 0 .574.73c1.2.289 2.162 1.2 2.522 2.372a.75.75 0 1 0 1.434-.44 5.01 5.01 0 0 0-2.56-3.012A3 3 0 0 0 11 4Z" />
          </svg>
          <span className="stat-value">{user.followers.toLocaleString()}</span>
          <span className="stat-label">followers</span>
          <span className="stat-label"> · </span>
          <span className="stat-value">{user.following.toLocaleString()}</span>
          <span className="stat-label">following</span>
        </div>
      </div>
    </div>
  );
}
