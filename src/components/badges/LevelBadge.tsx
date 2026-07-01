import type { Level } from "@/lib/modules";
import type { LevelStatus } from "@/lib/track-progress";

interface Props {
  level: Level;
  name: string;
  status: LevelStatus;
  percent: number;
}

const LEVEL_COLORS: Record<Level, { main: string; dark: string }> = {
  1: { main: "#c9a876", dark: "#9c8258" }, // bronze
  2: { main: "#b8c4cc", dark: "#8a97a1" }, // silver
  3: { main: "#e0b84a", dark: "#b8933a" }, // gold
  4: { main: "#7c5c3e", dark: "#4a3728" }, // mocha (platinum-equivalent, brand color)
};

export default function LevelBadge({ level, name, status, percent }: Props) {
  const colors = LEVEL_COLORS[level];
  const earned = status === "earned";
  const locked = status === "locked";

  return (
    <div className="flex flex-col items-center gap-1.5 w-20 text-center">
      <div className="relative">
        <svg width="56" height="64" viewBox="0 0 56 64" style={{ opacity: locked ? 0.35 : 1 }}>
          <path
            d="M28 2 L52 12 V32 C52 46 42 56 28 62 C14 56 4 46 4 32 V12 Z"
            fill={earned ? colors.main : "var(--cream-dark)"}
            stroke={earned ? colors.dark : "var(--border-dark)"}
            strokeWidth="2"
          />
          <text
            x="28"
            y="34"
            textAnchor="middle"
            fontSize="20"
            fontWeight="bold"
            fill={earned ? "white" : "var(--text-muted)"}
          >
            {level}
          </text>
        </svg>
        {earned && (
          <div className="absolute -bottom-1 -left-1 w-5 h-5 rounded-full flex items-center justify-center text-xs"
            style={{ background: "#5ea15e", color: "white", border: "2px solid var(--surface)" }}>
            ✓
          </div>
        )}
        {locked && (
          <div className="absolute inset-0 flex items-center justify-center text-lg">
            🔒
          </div>
        )}
      </div>
      <div>
        <p className="text-xs font-bold" style={{ color: locked ? "var(--text-muted)" : "var(--mocha-dark)" }}>
          {name}
        </p>
        {!locked && (
          <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>{percent}%</p>
        )}
      </div>
    </div>
  );
}
