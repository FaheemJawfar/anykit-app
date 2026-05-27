import type { MetadataRoute } from "next";
import { tools, categories } from "@/lib/tools";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://anykit.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
  ];

  for (const category of categories) {
    routes.push({
      url: `${BASE_URL}/category/${category.id}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    });
  }

  for (const tool of tools) {
    routes.push({
      url: `${BASE_URL}${tool.path}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  return routes;
}
