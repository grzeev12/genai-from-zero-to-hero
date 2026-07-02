export const dynamic = "force-dynamic";

import Link from "next/link";
import { getModule, getModules } from "@/lib/modules";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getCompletedModuleIds, getLatestSubmission } from "@/lib/db";
import { firstIncompleteIndex } from "@/lib/track-progress";
import DeliverableForm from "@/components/modules/DeliverableForm";
import QuizForm from "@/components/modules/QuizForm";
import ReadOnlyQuestions from "@/components/modules/ReadOnlyQuestions";
import AnsweredQuizView from "@/components/modules/AnsweredQuizView";
import { Table, Thead, Th, Tbody, Tr, Td } from "@/components/ui/MdxTable";

export async function generateStaticParams() {
  const modules = getModules("managers");
  return modules.map((m) => ({ slug: m.slug }));
}

export default async function ModulePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const mod = getModule("managers", slug);
  if (!mod) notFound();

  const session = await auth();
  if (!session?.user) redirect("/login");

  const allModules = getModules("managers");
  const currentIndex = allModules.findIndex((m) => m.slug === slug);
  const nextModule = allModules[currentIndex + 1] ?? null;

  const isAdmin = session.user.role === "admin";
  const completedIds = await getCompletedModuleIds(session.user.id, "managers");
  const unlockedIndex = firstIncompleteIndex(allModules, completedIds);
  const isLocked = currentIndex > unlockedIndex;
  if (isLocked && !isAdmin) {
    redirect(`/track/managers/${allModules[unlockedIndex]?.slug ?? ""}`);
  }

  const alreadyAnswered = completedIds.has(mod.id);
  const ownSubmission = alreadyAnswered && mod.questions?.length
    ? await getLatestSubmission(session.user.id, mod.id, "managers")
    : null;

  return (
    <main className="min-h-screen px-6 py-16" style={{ background: "var(--cream)" }}>
      <div className="max-w-2xl mx-auto space-y-10">

        <div className="text-right">
          <Link href="/track/managers"
            className="text-sm transition-colors"
            style={{ color: "var(--text-muted)" }}>
            ‹ מסלול מנהלים
          </Link>

          <div className="flex items-center gap-3 mt-5 flex-row-reverse justify-end">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full"
              style={{ background: "var(--cream-dark)", color: "var(--mocha)" }}>
              רמה {mod.level}
            </span>
            <span className="text-sm" style={{ color: "var(--text-muted)" }}>
              {mod.estimatedTime}
            </span>
          </div>

          <h1 className="text-4xl font-bold mt-3" style={{ color: "var(--mocha-dark)" }}>
            {mod.title}
          </h1>
          <div className="mt-5 h-px" style={{ background: "var(--border)" }} />
        </div>

        <div className="rounded-3xl p-8"
          style={{
            background: "var(--surface)",
            border: "1.5px solid var(--border)",
            boxShadow: "0 4px 24px rgba(124,92,62,0.07)"
          }}>
          <article className="prose max-w-none">
            <MDXRemote
              source={mod.content}
              options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
              components={{ table: Table, thead: Thead, th: Th, tbody: Tbody, tr: Tr, td: Td }}
            />
          </article>
        </div>

        {isLocked ? (
          <ReadOnlyQuestions questions={mod.questions ?? []} />
        ) : ownSubmission && mod.questions?.length ? (
          <AnsweredQuizView
            moduleId={mod.id}
            moduleTitle={mod.title}
            questions={mod.questions}
            deliverable={ownSubmission.deliverable}
            score={ownSubmission.score}
            scoreBreakdown={ownSubmission.score_breakdown}
            scoreSummary={ownSubmission.score_summary}
            track="managers"
            nextSlug={nextModule?.slug ?? null}
          />
        ) : mod.questions?.length ? (
          <QuizForm
            moduleId={mod.id}
            track="managers"
            moduleTitle={mod.title}
            questions={mod.questions}
            nextSlug={nextModule?.slug ?? null}
          />
        ) : (
          <DeliverableForm moduleId={mod.id} track="managers" nextSlug={nextModule?.slug ?? null} />
        )}
      </div>
    </main>
  );
}
