import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-6">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="space-y-3">
          <p className="text-blue-400 text-sm font-medium tracking-widest uppercase">
            Cloud & GenAI Learning
          </p>
          <h1 className="text-5xl font-bold tracking-tight">
            GenAI: From Zero to Hero
          </h1>
          <p className="text-gray-400 text-lg">
            תוכנית לימוד AWARE לענן ו-AI — לומדים איך ללמוד, לא רק תוכן.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          <Link
            href="/track/managers"
            className="group p-6 rounded-2xl border border-gray-800 hover:border-blue-500 bg-gray-900 hover:bg-gray-800 transition-all text-left"
          >
            <div className="text-2xl mb-3">👔</div>
            <h2 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
              מנהלים
            </h2>
            <p className="text-gray-500 text-sm mt-1">Cloud Managers</p>
          </Link>

          <div className="p-6 rounded-2xl border border-gray-800 bg-gray-900 opacity-40 cursor-not-allowed text-left">
            <div className="text-2xl mb-3">⚙️</div>
            <h2 className="font-semibold text-gray-400">DevOps</h2>
            <p className="text-gray-600 text-sm mt-1">בקרוב</p>
          </div>

          <div className="p-6 rounded-2xl border border-gray-800 bg-gray-900 opacity-40 cursor-not-allowed text-left">
            <div className="text-2xl mb-3">📋</div>
            <h2 className="font-semibold text-gray-400">מנהלי פרויקטים</h2>
            <p className="text-gray-600 text-sm mt-1">בקרוב</p>
          </div>
        </div>

        <div className="pt-4">
          <Link
            href="/admin"
            className="text-gray-600 hover:text-gray-400 text-sm transition-colors"
          >
            כניסת מנהל →
          </Link>
        </div>
      </div>
    </main>
  );
}
