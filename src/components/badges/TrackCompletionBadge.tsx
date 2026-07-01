interface Props {
  trackName: string;
  icon: string;
}

export default function TrackCompletionBadge({ trackName, icon }: Props) {
  return (
    <div className="rounded-3xl p-6 flex items-center gap-5 flex-row-reverse text-right"
      style={{
        background: "linear-gradient(135deg, #fff9ee 0%, #f5ead0 100%)",
        border: "2px solid #e0b84a",
        boxShadow: "0 6px 28px rgba(224,184,74,0.25)",
      }}>
      <svg width="76" height="88" viewBox="0 0 56 64" className="shrink-0">
        <path
          d="M28 2 L52 12 V32 C52 46 42 56 28 62 C14 56 4 46 4 32 V12 Z"
          fill="#e0b84a"
          stroke="#b8933a"
          strokeWidth="2"
        />
        <text x="28" y="38" textAnchor="middle" fontSize="24">{icon}</text>
      </svg>
      <div>
        <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: "#b8933a" }}>
          מסלול הושלם
        </p>
        <h3 className="text-lg font-bold" style={{ color: "var(--mocha-dark)" }}>
          {trackName} · 100%
        </h3>
        <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
          כל 4 הרמות הושלמו בהצלחה
        </p>
      </div>
    </div>
  );
}
