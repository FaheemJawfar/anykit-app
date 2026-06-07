import type { MetadataRoute } from "next";
import { tools, categories } from "@/lib/tools";
import fs from "fs";
import path from "path";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://anykit.app";

function getFileMtime(filePath: string): Date {
  try {
    const stats = fs.statSync(filePath);
    return stats.mtime;
  } catch {
    return new Date();
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: getFileMtime(path.join(process.cwd(), "src", "app", "page.tsx")),
      changeFrequency: "daily",
      priority: 1,
    },
  ];

  const categoryPagePath = path.join(process.cwd(), "src", "app", "category", "[id]", "page.tsx");
  const categoryMtime = getFileMtime(categoryPagePath);

  for (const category of categories) {
    routes.push({
      url: `${BASE_URL}/category/${category.id}`,
      lastModified: categoryMtime,
      changeFrequency: "weekly",
      priority: 0.9,
    });
  }

  for (const tool of tools) {
    const toolPagePath = path.join(process.cwd(), "src", "app", "tools", tool.id, "page.tsx");
    routes.push({
      url: `${BASE_URL}${tool.path}`,
      lastModified: getFileMtime(toolPagePath),
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  return routes;
}
