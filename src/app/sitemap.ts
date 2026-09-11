import type { MetadataRoute } from "next";
import { tools, categories } from "@/lib/tools";
import { execFileSync } from "child_process";
import path from "path";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://anykit.app";

// Stable fallback so lastmod never silently becomes "now" on every deploy.
const FALLBACK_DATE = new Date("2026-08-19T00:00:00Z");

// Resolve the last git commit date for a set of files in one call so the
// sitemap reflects real content changes rather than build-time file mtimes.
function getGitLastModified(files: string[]): Map<string, Date> {
  const result = new Map<string, Date>();
  try {
    const out = execFileSync(
      "git",
      ["log", "--format=%cI", "--name-only", "--", ...files],
      { cwd: process.cwd(), encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], maxBuffer: 64 * 1024 * 1024 }
    );
    let current: Date | null = null;
    for (const line of out.split("\n")) {
      if (!line.trim()) continue;
      if (/^\d{4}-\d{2}-\d{2}T/.test(line)) {
        current = new Date(line.trim());
      } else if (current && !result.has(line.trim())) {
        result.set(line.trim(), current);
      }
    }
  } catch {
    // git unavailable (e.g. shallow export) — fall back below
  }
  return result;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const homeFile = "src/app/page.tsx";
  const categoryFile = path.posix.join("src", "app", "category", "[id]", "page.tsx");
  const toolFiles = tools.map((t) => path.posix.join("src", "app", "tools", t.id, "page.tsx"));
  const toolClientFiles = tools.map((t) => path.posix.join("src", "app", "tools", t.id, "client.tsx"));
  const toolContentFiles = tools.map((t) => path.posix.join("src", "content", "tools", `${t.id}.ts`));

  const dates = getGitLastModified([homeFile, categoryFile, ...toolFiles, ...toolClientFiles, ...toolContentFiles]);
  const dateFor = (...files: string[]) => {
    const found = files.map((f) => dates.get(f)).filter((d): d is Date => !!d);
    return found.length ? new Date(Math.max(...found.map((d) => d.getTime()))) : FALLBACK_DATE;
  };

  const routes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: dateFor(homeFile),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  for (const category of categories) {
    routes.push({
      url: `${BASE_URL}/category/${category.id}`,
      lastModified: dateFor(categoryFile),
      changeFrequency: "weekly",
      priority: 0.9,
    });
  }

  for (const tool of tools) {
    routes.push({
      url: `${BASE_URL}${tool.path}`,
      lastModified: dateFor(
        path.posix.join("src", "app", "tools", tool.id, "page.tsx"),
        path.posix.join("src", "app", "tools", tool.id, "client.tsx"),
        path.posix.join("src", "content", "tools", `${tool.id}.ts`)
      ),
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  return routes;
}
