import Link from "next/link";
import { getModule, getModules } from "@/lib/modules";
import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import DeliverableForm from "@/components/modules/DeliverableForm";

export async function generateStaticParams() {
  const modules = getModules("managers");
  return modules.map((m) => ({ slug: m.slug }));
}

export default async function ModulePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const mod = getModule("managers", slug);
  if (!mod) notFound();

  const allModules = getModules("managers");
  const currentIndex = allModules.findIndex((m) => m.slug === slug);
  const nextModule = allModules[currentIndex + 1] ?? null;

  return (
    <main className="min-h-screen bg-gray-950 text-white px-6 py-16">
      <div className="max-w-2xl mx-auto space-y-10">
        <div className="space-y-1 text-right">
          <Link href="/track/managers" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
            מסלול מנהלים →
          </Link>
          <div className="flex items-center gap-3 mt-4 flex-row-reverse justify-end">
            <span className="text-xs font-medium bg-blue-900 text-blue-300 px-3 py-1 rounded-full">
              מודול {mod.order}
            </span>
            <span className="text-gray-500 text-sm">{mod.estimatedTime}</span>
          </div>
          <h1 className="text-3xl font-bold mt-2">{mod.title}</h1>
        </div>

        <article className="prose prose-invert prose-blue max-w-none
          prose-headings:font-bold prose-headings:text-white prose-headings:text-right
          prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:border-b prose-h2:border-gray-800 prose-h2:pb-2
          prose-p:text-gray-300 prose-p:leading-relaxed prose-p:text-right
          prose-li:text-gray-300 prose-li:text-right
          prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
          prose-strong:text-white
          prose-table:text-sm prose-th:text-gray-300 prose-td:text-gray-400
          prose-blockquote:text-gray-400">
          <MDXRemote source={mod.content} />
        </article>

        <DeliverableForm moduleId={mod.id} track="managers" nextSlug={nextModule?.slug ?? null} />
      </div>
    </main>
  );
}
