import Link from "next/link";
import { getModules } from "@/lib/modules";

export default function ManagersTrackPage() {
  const modules = getModules("managers");

  return (
    <main className="min-h-screen bg-gray-950 text-white px-6 py-16">
      <div className="max-w-2xl mx-auto space-y-10">
        <div className="space-y-2">
          <Link href="/" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
            ← חזרה
          </Link>
          <h1 className="text-3xl font-bold mt-4">מסלול מנהלים</h1>
          <p className="text-gray-400">Cloud Managers · AWARE Level · {modules.length} מודולים</p>
        </div>

        <div className="space-y-4">
          {modules.map((mod, index) => (
            <Link
              key={mod.id}
              href={`/track/managers/${mod.slug}`}
              className="group flex items-center gap-5 p-5 rounded-2xl border border-gray-800 hover:border-blue-500 bg-gray-900 hover:bg-gray-800 transition-all"
            >
              <div className="w-10 h-10 rounded-full bg-gray-800 group-hover:bg-blue-900 flex items-center justify-center text-sm font-bold text-gray-400 group-hover:text-blue-300 transition-all shrink-0">
                {index}
              </div>
              <div className="flex-1">
                <h2 className="font-semibold text-white group-hover:text-blue-300 transition-colors">
                  {mod.title}
                </h2>
                <p className="text-gray-500 text-sm mt-0.5">{mod.estimatedTime}</p>
              </div>
              <div className="text-gray-600 group-hover:text-blue-400 transition-colors">→</div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
