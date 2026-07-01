import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type Track = "managers" | "devops";
export type Level = 1 | 2 | 3 | 4;

export interface RubricItem {
  criterion: string;
  description: string;
  weight: number;
}

export interface QuizQuestion {
  text: string;
}

export interface ModuleMeta {
  id: string;
  track: Track;
  level: Level;
  title: string;
  order: number;
  badge: string;
  estimatedTime: string;
  rubric?: RubricItem[];
  questions?: QuizQuestion[];
}

export interface Module extends ModuleMeta {
  content: string;
  slug: string;
}

const contentDir = path.join(process.cwd(), "content");

export function getModules(track: Track, level?: Level): Module[] {
  const trackDir = path.join(contentDir, track);
  if (!fs.existsSync(trackDir)) return [];

  const files = fs.readdirSync(trackDir).filter((f) => f.endsWith(".mdx"));

  const modules = files
    .map((file) => {
      const raw = fs.readFileSync(path.join(trackDir, file), "utf-8");
      const { data, content } = matter(raw);
      return {
        ...(data as ModuleMeta),
        content,
        slug: file.replace(".mdx", ""),
      };
    })
    .filter((m) => (level ? m.level === level : true))
    .sort((a, b) => {
      if (a.level !== b.level) return a.level - b.level;
      return a.order - b.order;
    });

  return modules;
}

export function getModulesByLevel(track: Track): Record<Level, Module[]> {
  const all = getModules(track);
  const result: Record<Level, Module[]> = { 1: [], 2: [], 3: [], 4: [] };
  for (const mod of all) {
    const lv = mod.level ?? 1;
    result[lv as Level].push(mod);
  }
  return result;
}

export function getModule(track: Track, slug: string): Module | null {
  const filePath = path.join(contentDir, track, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return { ...(data as ModuleMeta), content, slug };
}
