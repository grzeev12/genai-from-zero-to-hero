import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type Track = "managers" | "devops" | "cloud-pm";

export interface ModuleMeta {
  id: string;
  track: Track;
  title: string;
  order: number;
  badge: string;
  estimatedTime: string;
}

export interface Module extends ModuleMeta {
  content: string;
  slug: string;
}

const contentDir = path.join(process.cwd(), "content");

export function getModules(track: Track): Module[] {
  const trackDir = path.join(contentDir, track);
  if (!fs.existsSync(trackDir)) return [];

  const files = fs.readdirSync(trackDir).filter((f) => f.endsWith(".mdx"));

  return files
    .map((file) => {
      const raw = fs.readFileSync(path.join(trackDir, file), "utf-8");
      const { data, content } = matter(raw);
      return {
        ...(data as ModuleMeta),
        content,
        slug: file.replace(".mdx", ""),
      };
    })
    .sort((a, b) => a.order - b.order);
}

export function getModule(track: Track, slug: string): Module | null {
  const filePath = path.join(contentDir, track, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return { ...(data as ModuleMeta), content, slug };
}
