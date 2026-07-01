import Link from "next/link";
import { getModules } from "@/lib/modules";

export default function ManagersTrackPage() {
  const modules = getModules("managers");

  return (
    <main className="min-h-screen px-6 py-16" style={{ background: "var(--cream)" }}>
      <div className="max-w-2xl mx-auto space-y-10">

        {/* Header */}
        <div className="text-right">
          <Link href="/" className="text-sm transition-colors"
            style={{ color: "var(--text-muted)" }}>
            חזרה לדף הבית ←
          </Link>
          <div className="mt-6">
            <span className="text-xs font-semibold tracking-widest uppercase px-3 py-1.5 rounded-full"
              style={{ background: "var(--cream-dark)", color: "var(--mocha)" }}>
              AWARE Level
            </span>
          </div>
          <h1 className="text-4xl font-bold mt-3" style={{ color: "var(--mocha-dark)" }}>
            מסלול מנהלים
          </h1>
          <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
            {modules.length} מודולים · Cloud Managers
          </p>
          <div className="mt-5 h-px" style={{ background: "var(--border)" }} />
        </div>

        {/* Module list */}
        <div className="space-y-3">
          {modules.map((mod, index) => (
            <Link
              key={mod.id}
              href={`/track/managers/${mod.slug}`}
              className="group flex items-center gap-5 p-5 rounded-2xl transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: "var(--surface)",
                border: "1.5px solid var(--border)",
                boxShadow: "0 1px 6px rgba(124,92,62,0.05)"
              }}
            >
              {/* Arrow */}
              <div className="text-lg transition-colors" style={{ color: "var(--border-dark)" }}>←</div>

              {/* Content */}
              <div className="flex-1 text-right">
                <h2 className="font-semibold transition-colors"
                  style={{ color: "var(--mocha-dark)" }}>
                  {mod.title}
                </h2>
                <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
                  {mod.estimatedTime}
                </p>
              </div>

              {/* Number badge */}
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                style={{ background: "var(--cream-dark)", color: "var(--mocha)" }}>
                {index}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
