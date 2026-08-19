"use client";

import { useMemo, useState } from "react";
import { ToolCard } from "@/components/tool-card";
import { Tool, getSubgroups } from "@/lib/tools";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryBrowserProps {
  categoryId: string;
  tools: Tool[];
}

export function CategoryBrowser({ categoryId, tools }: CategoryBrowserProps) {
  const [query, setQuery] = useState("");

  const subgroups = useMemo(() => {
    // Build subgroups from the full category tool list (passed in) so the
    // grouping stays stable regardless of the search filter.
    return getSubgroups(categoryId);
  }, [categoryId]);

  const hasMultipleSubgroups = subgroups.length > 1;

  const filteredTools = useMemo(() => {
    if (!query.trim()) return tools;
    const q = query.toLowerCase();
    return tools.filter(
      (tool) =>
        tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.tags?.some((tag) => tag.toLowerCase().includes(q))
    );
  }, [query, tools]);

  // When searching, collapse subgroups into a single flat result list.
  const visibleSubgroups = useMemo(() => {
    if (query.trim()) {
      return [{ id: "results", name: "Results", tools: filteredTools }];
    }
    return subgroups;
  }, [query, filteredTools, subgroups]);

  const handleSubgroupClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(`subgroup-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="space-y-6">
      {/* Search + subgroup nav */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search within ${tools.length} tools...`}
            className="w-full h-10 pl-10 pr-9 rounded-lg border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-primary/40 transition-colors"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-6 h-6 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {hasMultipleSubgroups && !query && (
          <nav className="flex items-center gap-1.5 flex-wrap">
            {subgroups.map((sg) => (
              <a
                key={sg.id}
                href={`#subgroup-${sg.id}`}
                onClick={(e) => handleSubgroupClick(e, sg.id)}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors",
                  "bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5"
                )}
              >
                {sg.name}
                <span className="text-[10px] tabular-nums text-muted-foreground/70">{sg.tools.length}</span>
              </a>
            ))}
          </nav>
        )}
      </div>

      {filteredTools.length === 0 ? (
        <div className="text-center py-16 rounded-lg border border-dashed border-border bg-card/40">
          <p className="text-sm text-muted-foreground">No tools match &ldquo;{query}&rdquo;.</p>
          <button
            onClick={() => setQuery("")}
            className="mt-3 text-sm font-medium text-primary hover:underline"
          >
            Clear search
          </button>
        </div>
      ) : (
        <div className="space-y-10">
          {visibleSubgroups.map((sg) => (
            <section key={sg.id} id={`subgroup-${sg.id}`} className="scroll-mt-24 space-y-4">
              {hasMultipleSubgroups && (
                <div className="flex items-center justify-between border-b border-border/60 pb-2">
                  <h3 className="text-sm font-semibold tracking-tight text-foreground">
                    {sg.name}
                    <span className="ml-2 text-xs font-medium text-muted-foreground tabular-nums">
                      {sg.tools.length}
                    </span>
                  </h3>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
                {sg.tools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
