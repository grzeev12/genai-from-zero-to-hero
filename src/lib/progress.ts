export interface ModuleProgress {
  moduleId: string;
  completedAt: string;
  score?: number;
}

export interface TrackProgress {
  track: string;
  modules: ModuleProgress[];
}

const STORAGE_KEY = "genai_progress";

export function getProgress(): TrackProgress[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function markModuleComplete(track: string, moduleId: string, score?: number) {
  const progress = getProgress();
  let trackProgress = progress.find((p) => p.track === track);

  if (!trackProgress) {
    trackProgress = { track, modules: [] };
    progress.push(trackProgress);
  }

  const existing = trackProgress.modules.find((m) => m.moduleId === moduleId);
  if (!existing) {
    trackProgress.modules.push({
      moduleId,
      completedAt: new Date().toISOString(),
      score,
    });
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function isModuleComplete(track: string, moduleId: string): boolean {
  const progress = getProgress();
  const trackProgress = progress.find((p) => p.track === track);
  return !!trackProgress?.modules.find((m) => m.moduleId === moduleId);
}

export function getTrackCompletion(track: string, totalModules: number): number {
  const progress = getProgress();
  const trackProgress = progress.find((p) => p.track === track);
  if (!trackProgress) return 0;
  return Math.round((trackProgress.modules.length / totalModules) * 100);
}
