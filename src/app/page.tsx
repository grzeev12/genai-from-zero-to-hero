import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-16"
      style={{ background: "var(--cream)" }}>

      {/* Header */}
      <div className="w-full max-w-2xl text-center mb-16">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4"
          style={{ color: "var(--mocha-light)" }}>
          Cloud & GenAI · תוכנית לימוד
        </p>
        <h1 className="text-5xl font-bold mb-5 leading-tight"
          style={{ color: "var(--mocha-dark)" }}>
          GenAI: From Zero to Hero
        </h1>
        <p className="text-lg leading-relaxed"
          style={{ color: "var(--text-secondary)" }}>
          לומדים איך ללמוד, לא רק תוכן — תוכנית AWARE לענן ו-AI
        </p>
        <div className="mt-6 h-px w-24 mx-auto"
          style={{ background: "var(--border-dark)" }} />
      </div>

      {/* Tracks */}
      <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Link href="/track/managers"
          className="group p-7 rounded-3xl text-right transition-all duration-200 hover:-translate-y-1"
          style={{
            background: "var(--surface)",
            border: "1.5px solid var(--border)",
            boxShadow: "0 2px 12px rgba(124,92,62,0.06)"
          }}>
          <div className="text-3xl mb-4">👔</div>
          <h2 className="font-bold text-lg mb-1 transition-colors"
            style={{ color: "var(--mocha-dark)" }}>
            מנהלים
          </h2>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>Cloud Managers</p>
          <div className="mt-5 text-xs font-semibold px-3 py-1.5 rounded-full inline-block"
            style={{ background: "var(--cream-dark)", color: "var(--mocha)" }}>
            8 מודולים
          </div>
        </Link>

        <div className="p-7 rounded-3xl text-right opacity-40 cursor-not-allowed"
          style={{
            background: "var(--surface)",
            border: "1.5px solid var(--border)"
          }}>
          <div className="text-3xl mb-4">⚙️</div>
          <h2 className="font-bold text-lg mb-1" style={{ color: "var(--text-secondary)" }}>DevOps</h2>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>בקרוב</p>
        </div>

        <div className="p-7 rounded-3xl text-right opacity-40 cursor-not-allowed"
          style={{
            background: "var(--surface)",
            border: "1.5px solid var(--border)"
          }}>
          <div className="text-3xl mb-4">📋</div>
          <h2 className="font-bold text-lg mb-1" style={{ color: "var(--text-secondary)" }}>מנהלי פרויקטים</h2>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>בקרוב</p>
        </div>
      </div>

      {/* Admin link */}
      <div className="mt-16">
        <Link href="/admin"
          className="text-sm transition-colors"
          style={{ color: "var(--text-muted)" }}>
          ← כניסת מנהל מערכת
        </Link>
      </div>
    </main>
  );
}
