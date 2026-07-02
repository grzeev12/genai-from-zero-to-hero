import { getModules, type Track, type Level, type Module } from "@/lib/modules";
import { initDb, getModuleScores, getModuleThresholds } from "@/lib/db";

export type LevelStatus = "locked" | "in-progress" | "earned";
export type ModuleStatus = "passed" | "failed" | "pending" | "not-attempted";

export const DEFAULT_PASSING_SCORE = 70;

export const LEVEL_NAMES: Record<Level, string> = {
  1: "AI Aware",
  2: "AI Practitioner",
  3: "AI Builder",
  4: "AI Specialist",
};

export interface LevelProgress {
  level: Level;
  total: number;
  completed: number;
  percent: number;
  status: LevelStatus;
}

export interface TrackProgress {
  track: Track;
  modules: Module[];
  /** ids of modules the learner has passed (score >= that module's threshold) */
  completedIds: Set<string>;
  moduleStatus: Record<string, ModuleStatus>;
  totalModules: number;
  completedCount: number;
  percent: number;
  byLevel: LevelProgress[];
  /** slug of the next module the learner should do; null if the whole track is done */
  nextSlug: string | null;
  isComplete: boolean;
}

export async function getTrackProgress(userId: string, track: Track): Promise<TrackProgress> {
  await initDb();
  const modules = getModules(track);
  const [scores, thresholds] = await Promise.all([
    getModuleScores(userId, track),
    getModuleThresholds(track),
  ]);

  function statusOf(moduleId: string): ModuleStatus {
    if (!(moduleId in scores)) return "not-attempted";
    const score = scores[moduleId];
    if (score === null) return "pending";
    const passingScore = thresholds[moduleId] ?? DEFAULT_PASSING_SCORE;
    return score >= passingScore ? "passed" : "failed";
  }

  const moduleStatus: Record<string, ModuleStatus> = {};
  for (const m of modules) moduleStatus[m.id] = statusOf(m.id);

  const completedIds = new Set(modules.filter((m) => moduleStatus[m.id] === "passed").map((m) => m.id));

  const totalModules = modules.length;
  const completedCount = completedIds.size;
  const percent = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0;

  const nextIndex = modules.findIndex((m) => !completedIds.has(m.id));
  const nextSlug = nextIndex === -1 ? null : modules[nextIndex].slug;
  const isComplete = nextIndex === -1 && totalModules > 0;

  const levels: Level[] = [1, 2, 3, 4];
  const byLevel: LevelProgress[] = levels.map((level) => {
    const levelModules = modules.filter((m) => m.level === level);
    const levelCompleted = levelModules.filter((m) => completedIds.has(m.id)).length;
    const levelTotal = levelModules.length;
    const levelPercent = levelTotal > 0 ? Math.round((levelCompleted / levelTotal) * 100) : 0;

    let status: LevelStatus = "in-progress";
    if (levelTotal === 0) {
      status = "locked";
    } else if (levelCompleted === levelTotal) {
      status = "earned";
    } else {
      // Locked until every module in every earlier level is completed
      const earlierModules = modules.filter((m) => m.level < level);
      const earlierDone = earlierModules.every((m) => completedIds.has(m.id));
      status = earlierDone ? "in-progress" : "locked";
    }

    return { level, total: levelTotal, completed: levelCompleted, percent: levelPercent, status };
  });

  return {
    track,
    modules,
    completedIds,
    moduleStatus,
    totalModules,
    completedCount,
    percent,
    byLevel,
    nextSlug,
    isComplete,
  };
}

/** Index of the first module the learner hasn't passed yet, in track order. */
export function firstIncompleteIndex(modules: Module[], completedIds: Set<string>): number {
  const idx = modules.findIndex((m) => !completedIds.has(m.id));
  return idx === -1 ? modules.length : idx;
}
