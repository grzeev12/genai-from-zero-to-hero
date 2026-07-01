export const dynamic = "force-dynamic";

import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import UserMenu from "@/components/auth/UserMenu";
import LevelBadge from "@/components/badges/LevelBadge";
import TrackCompletionBadge from "@/components/badges/TrackCompletionBadge";
import { getTrackProgress, LEVEL_NAMES } from "@/lib/track-progress";

const TRACKS = [
  { track: "managers" as const, href: "/track/managers", icon: "👔", title: "מנהלים", subtitle: "Cloud Managers" },
  { track: "devops" as const, href: "/track/devops", icon: "⚙️", title: "DevOps", subtitle: "DevOps Engineers" },
];

export default async function HomePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const visibleTracks = session.user.role === "admin" || !session.user.track
    ? TRACKS
    : TRACKS.filter((t) => t.track === session.user.track);

  const progress = await Promise.all(visibleTracks.map((t) => getTrackProgress(session.user.id, t.track)));

  return (
    <main className="min-h-screen flex flex-col items-center px-6 py-16"
      style={{ background: "var(--cream)" }}>

      <div className="w-full max-w-2xl flex justify-start mb-6">
        <UserMenu />
      </div>

      {/* Header */}
      <div className="w-full max-w-2xl text-center mb-14">
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
          לומדים איך ללמוד, לא רק תוכן: תוכנית AWARE לענן ו-AI
        </p>
        <div className="mt-6 h-px w-24 mx-auto"
          style={{ background: "var(--border-dark)" }} />
      </div>

      {/* Tracks dashboard */}
      <div className="w-full max-w-2xl space-y-6">
        {visibleTracks.map((t, i) => {
          const p = progress[i];
          const continueHref = p.nextSlug
            ? `/track/${t.track}/${p.nextSlug}`
            : t.href;
          const ctaLabel = p.isComplete ? "עיין במסלול" : p.completedCount > 0 ? "המשך מאיפה שהפסקת" : "התחל את המסלול";

          return (
            <div key={t.track}
              className="rounded-3xl p-7 text-right space-y-5"
              style={{
                background: "var(--surface)",
                border: "1.5px solid var(--border)",
                boxShadow: "0 2px 12px rgba(124,92,62,0.06)"
              }}>

              {p.isComplete && <TrackCompletionBadge trackName={t.title} icon={t.icon} />}

              <div className="flex items-center justify-between flex-row-reverse">
                <div>
                  <div className="text-3xl mb-2">{t.icon}</div>
                  <h2 className="font-bold text-lg" style={{ color: "var(--mocha-dark)" }}>{t.title}</h2>
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>{t.subtitle}</p>
                </div>
                <div className="text-left">
                  <p className="text-3xl font-bold" style={{ color: "var(--mocha)" }}>{p.percent}%</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {p.completedCount} מתוך {p.totalModules} מודולים
                  </p>
                </div>
              </div>

              <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--cream-dark)" }}>
                <div className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${p.percent}%`, background: p.isComplete ? "#5ea15e" : "var(--mocha)" }} />
              </div>

              <div className="flex justify-between flex-row-reverse gap-2">
                {p.byLevel.map((lv) => (
                  <LevelBadge key={lv.level} level={lv.level} name={LEVEL_NAMES[lv.level]} status={lv.status} percent={lv.percent} />
                ))}
              </div>

              <Link href={continueHref}
                className="block text-center px-5 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5"
                style={{ background: "var(--mocha)", color: "white" }}>
                {ctaLabel}
              </Link>
            </div>
          );
        })}
      </div>

    </main>
  );
}
