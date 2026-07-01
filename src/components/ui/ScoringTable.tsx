interface BreakdownItem {
  criterion: string;
  score: number;
  weight: number;
  feedback: string;
}

export default function ScoringTable({ breakdown, total, summary }: {
  breakdown: BreakdownItem[];
  total: number;
  summary: string;
}) {
  const color = total >= 80 ? "#2d6a2d" : total >= 60 ? "#7c5c3e" : "#8b3a3a";
  const bg = total >= 80 ? "#f0f7f0" : total >= 60 ? "#faf7f2" : "#fdf0f0";

  return (
    <div className="mt-4 rounded-2xl overflow-hidden"
      style={{ border: "1.5px solid var(--border)" }}>

      {/* ציון כולל */}
      <div className="flex items-center justify-between px-5 py-4 flex-row-reverse"
        style={{ background: bg, borderBottom: "1.5px solid var(--border)" }}>
        <div className="text-right">
          <p className="text-xs font-semibold" style={{ color }}>ציון כולל</p>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>{summary}</p>
        </div>
        <span className="text-3xl font-bold" style={{ color }}>{total}</span>
      </div>

      {/* פירוט */}
      <div style={{ background: "var(--surface)" }}>
        {breakdown.map((item, i) => (
          <div key={i}
            className="flex items-start gap-4 px-5 py-3.5 flex-row-reverse"
            style={{
              borderBottom: i < breakdown.length - 1 ? "1px solid var(--border)" : "none"
            }}>
            {/* ציון */}
            <div className="text-center shrink-0 w-12">
              <span className="text-lg font-bold" style={{ color: "var(--mocha)" }}>{item.score}</span>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>{item.weight}%</p>
            </div>
            {/* תוכן */}
            <div className="flex-1 text-right">
              <p className="font-semibold text-sm" style={{ color: "var(--mocha-dark)" }}>
                {item.criterion}
              </p>
              <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>
                {item.feedback}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
