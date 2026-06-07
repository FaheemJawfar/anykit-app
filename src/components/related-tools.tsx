"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getToolsByCategory, getToolById, tools } from "@/lib/tools";
import { ArrowRight } from "lucide-react";

function tagOverlapScore(aTags: string[] = [], bTags: string[] = []) {
  const aSet = new Set(aTags.map((t) => t.toLowerCase()));
  const bSet = new Set(bTags.map((t) => t.toLowerCase()));
  let overlap = 0;
  for (const tag of aSet) {
    if (bSet.has(tag)) overlap++;
  }
  return overlap;
}

export function RelatedTools() {
  const pathname = usePathname();
  const toolId = pathname.split("/").pop();
  const currentTool = toolId ? getToolById(toolId) : undefined;

  if (!currentTool) return null;

  const sameCategory = getToolsByCategory(currentTool.category)
    .filter((t) => t.id !== currentTool.id)
    .map((t) => ({ tool: t, score: tagOverlapScore(currentTool.tags, t.tags) + 10 })); // +10 boost for same category

  const crossCategory = tools
    .filter((t) => t.id !== currentTool.id && t.category !== currentTool.category)
    .map((t) => ({ tool: t, score: tagOverlapScore(currentTool.tags, t.tags) }));

  const allRelated = [...sameCategory, ...crossCategory]
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map((r) => r.tool);

  if (allRelated.length === 0) return null;

  return (
    <section className="border-t border-border/50 bg-muted/30">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <h2 className="text-lg font-semibold mb-6 text-foreground/90">
          Related Tools
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allRelated.map((tool) => (
            <Link
              key={tool.id}
              href={tool.path}
              className="group flex items-center justify-between p-4 rounded-xl bg-background border border-border/60 hover:border-primary/30 hover:shadow-sm transition-all"
            >
              <div className="flex flex-col">
                <span className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                  {tool.name}
                </span>
                <span className="text-xs text-muted-foreground mt-1 line-clamp-1">
                  {tool.description}
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary shrink-0 ml-3 transition-colors" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
