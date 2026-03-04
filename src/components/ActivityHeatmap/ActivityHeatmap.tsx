import "./ActivityHeatmap.scss";
import { useState, useRef } from "react";
import type { ActivityDay } from "@/lib/github";

interface ActivityHeatmapProps {
  data: ActivityDay[];
}

function intensityClass(count: number): string {
  if (count === 0) return "heat-0";
  if (count <= 2) return "heat-1";
  if (count <= 4) return "heat-2";
  if (count <= 7) return "heat-3";
  return "heat-4";
}

const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];
const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function formatTooltipDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  const month = MONTH_NAMES[d.getMonth()];
  const day = d.getDate();
  const suffix =
    day === 1 || day === 21 || day === 31
      ? "st"
      : day === 2 || day === 22
      ? "nd"
      : day === 3 || day === 23
      ? "rd"
      : "th";
  return `${month} ${day}${suffix}`;
}

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  text: string;
}

export function ActivityHeatmap({ data }: ActivityHeatmapProps) {
  const dayMap: Record<string, number> = {};
  for (const d of data) dayMap[d.date] = d.count;

  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    text: "",
  });
  const containerRef = useRef<HTMLDivElement>(null);

  const today = new Date();
  const cells: { date: string; count: number; dow: number }[] = [];
  for (let i = 364; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    cells.push({ date: key, count: dayMap[key] || 0, dow: d.getDay() });
  }

  const weeks: (typeof cells)[] = [];
  let currentWeek: typeof cells = [];

  if (cells[0].dow !== 0) {
    for (let i = 0; i < cells[0].dow; i++) {
      currentWeek.push({ date: "", count: -1, dow: i });
    }
  }

  for (const cell of cells) {
    currentWeek.push(cell);
    if (cell.dow === 6) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  if (currentWeek.length) weeks.push(currentWeek);

  const monthLabels: { label: string; col: number }[] = [];
  let lastMonth = -1;
  for (let wi = 0; wi < weeks.length; wi++) {
    for (const cell of weeks[wi]) {
      if (cell.date) {
        const month = new Date(cell.date + "T00:00:00").getMonth();
        if (month !== lastMonth) {
          monthLabels.push({ label: MONTH_NAMES[month], col: wi });
          lastMonth = month;
          break;
        }
      }
    }
  }

  const totalEvents = data.reduce((s, d) => s + d.count, 0);

  const handleCellEnter = (
    e: React.MouseEvent<HTMLDivElement>,
    cell: { date: string; count: number }
  ) => {
    if (!cell.date || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const cellRect = (e.target as HTMLElement).getBoundingClientRect();
    const x = cellRect.left - rect.left + cellRect.width / 2;
    const y = cellRect.top - rect.top - 8;
    const count = cell.count;
    const dateStr = formatTooltipDate(cell.date);
    const text =
      count === 0
        ? `No contributions on ${dateStr}.`
        : `${count} contribution${count !== 1 ? "s" : ""} on ${dateStr}.`;
    setTooltip({ visible: true, x, y, text });
  };

  const handleCellLeave = () => {
    setTooltip((t) => ({ ...t, visible: false }));
  };

  return (
    <div className="heatmap-card" ref={containerRef}>
      <div className="heatmap-header">
        <h3 className="section-title">
          {totalEvents} contributions in the last year
        </h3>
      </div>

      <div className="heatmap-wrapper">
        <div className="heatmap-day-labels">
          {DAY_LABELS.map((label, i) => (
            <span key={i} className="heatmap-day-label">
              {label}
            </span>
          ))}
        </div>

        <div className="heatmap-main">
          <div className="heatmap-month-row">
            {monthLabels.map((m, i) => (
              <span
                key={i}
                className="heatmap-month-label"
                style={{
                  gridColumnStart: m.col + 1,
                }}>
                {m.label}
              </span>
            ))}
          </div>

          <div className="heatmap-grid">
            {weeks.map((week, wi) => (
              <div key={wi} className="heatmap-col">
                {week.map((cell, ci) => (
                  <div
                    key={ci}
                    className={`heatmap-cell ${
                      cell.count < 0 ? "heat-empty" : intensityClass(cell.count)
                    }`}
                    onMouseEnter={(e) => handleCellEnter(e, cell)}
                    onMouseLeave={handleCellLeave}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {tooltip.visible && (
        <div
          className="heatmap-tooltip"
          style={{
            left: tooltip.x,
            top: tooltip.y,
          }}>
          {tooltip.text}
        </div>
      )}

      <div className="heatmap-footer">
        <span className="heatmap-learn-link">
          Learn how we count contributions
        </span>
        <div className="heatmap-legend">
          <span className="heatmap-legend-label">Less</span>
          <div className="heatmap-cell heat-0" />
          <div className="heatmap-cell heat-1" />
          <div className="heatmap-cell heat-2" />
          <div className="heatmap-cell heat-3" />
          <div className="heatmap-cell heat-4" />
          <span className="heatmap-legend-label">More</span>
        </div>
      </div>
    </div>
  );
}
