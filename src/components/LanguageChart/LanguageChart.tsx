import "./LanguageChart.scss";
import type { LanguageStats } from "@/lib/github";
import { getLangColor } from "@/lib/language-colors";

interface LanguageChartProps {
  stats: LanguageStats;
}

export function LanguageChart({ stats }: LanguageChartProps) {
  const sorted = Object.entries(stats).sort((a, b) => b[1] - a[1]);
  const total = sorted.reduce((s, [, c]) => s + c, 0);
  const topLangs = sorted.slice(0, 8);

  return (
    <div className="lang-chart-card">
      <h3 className="section-title">Top Languages</h3>
      <div className="lang-bar">
        {topLangs.map(([lang, count]) => (
          <div
            key={lang}
            className="lang-bar-segment"
            style={{
              width: `${(count / total) * 100}%`,
              backgroundColor: getLangColor(lang),
            }}
            title={`${lang}: ${count} repos`}
          />
        ))}
      </div>
      <div className="lang-legend">
        {topLangs.map(([lang, count]) => (
          <div key={lang} className="lang-legend-item">
            <span
              className="lang-dot"
              style={{ backgroundColor: getLangColor(lang) }}
            />
            <span className="lang-label">{lang}</span>
            <span className="lang-pct">
              {((count / total) * 100).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
