"use client";

import { useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ToolCard } from "@/components/tool-card";
import { CategoryBrowser } from "@/components/category-browser";
import { Button } from "@/components/ui/button";
import {
  tools,
  getToolsByCategory,
  searchTools,
  categories,
  getSubgroups,
} from "@/lib/tools";
import { LucideIcon } from "@/components/lucide-icon";
import { usePersistentTools } from "@/hooks/use-persistent-tools";
import { cn } from "@/lib/utils";
import { ArrowRight, Star } from "lucide-react";

const PREVIEW_COUNT = 5;

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category");
  const searchQuery = searchParams.get("search") ?? "";
  const { favoriteTools, mounted } = usePersistentTools();

  const searchResults = useMemo(() => {
    if (!searchQuery) return [];
    return searchTools(searchQuery);
  }, [searchQuery]);

  const selectedCategoryData = categories.find((c) => c.id === selectedCategory);
  const selectedCategoryTools = useMemo(
    () => (selectedCategory ? getToolsByCategory(selectedCategory) : []),
    [selectedCategory]
  );

  const showFavorites = mounted && favoriteTools.length > 0 && !selectedCategory && !searchQuery;
  const isSearching = Boolean(searchQuery);
  const isBrowsingCategory = Boolean(selectedCategory);

  // Group tools by category for the default landing view.
  const categorySections = useMemo(() => {
    return categories.map((cat) => ({
      category: cat,
      tools: getToolsByCategory(cat.id),
      subgroups: getSubgroups(cat.id),
    }));
  }, []);

  return (
    <main className="container mx-auto px-4 md:px-6 py-8 md:py-10 space-y-10">
      {/* Compact intro (only on default landing) */}
      {!isBrowsingCategory && !isSearching && (
        <section className="space-y-2">
          <h1 className="text-2xl md:text-[28px] font-semibold tracking-tight text-foreground">
            Every utility in one place.
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            {tools.length} privacy-first tools across {categories.length} categories. Everything runs
            in your browser — no sign-up, no uploads.
          </p>
        </section>
      )}

      {/* Favorites */}
      {showFavorites && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <h2 className="text-lg font-bold tracking-tight">Favorites</h2>
            <span className="text-xs text-muted-foreground tabular-nums">
              {favoriteTools.length}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
            {favoriteTools.map((tool) => (
              <ToolCard key={`fav-${tool.id}`} tool={tool} />
            ))}
          </div>
        </section>
      )}

      {/* Search results (flat) */}
      {isSearching && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-tight">
              Results for &ldquo;{searchQuery}&rdquo;
            </h2>
            <Button
              onClick={() => router.push("/")}
              variant="outline"
              size="sm"
              className="rounded-lg"
            >
              Clear
            </Button>
          </div>
          {searchResults.length === 0 ? (
            <div className="text-center py-16 rounded-xl border border-dashed border-border bg-card/40">
              <p className="text-muted-foreground">No tools found.</p>
            </div>
          ) : (
            <>
              <p className="text-xs text-muted-foreground">
                {searchResults.length} tool{searchResults.length === 1 ? "" : "s"}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
                {searchResults.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </>
          )}
        </section>
      )}

      {/* Single category browse (deep-linked from ?category=) */}
      {isBrowsingCategory && selectedCategoryData && (
        <section className="space-y-6">
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span className="opacity-60">/</span>
            <span className="font-semibold text-foreground">{selectedCategoryData.name}</span>
          </nav>

          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 text-primary ring-1 ring-primary/15">
                <LucideIcon name={selectedCategoryData.icon} className="w-4.5 h-4.5" />
              </span>
              <div>
                <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
                  {selectedCategoryData.name}
                </h1>
                <p className="text-xs text-muted-foreground">
                  {selectedCategoryTools.length} tools
                </p>
              </div>
            </div>
          </div>

          <CategoryBrowser categoryId={selectedCategoryData.id} tools={selectedCategoryTools} />
        </section>
      )}

      {/* Default grouped-by-category landing */}
      {!isBrowsingCategory && !isSearching && (
        <div className="space-y-10">
          {categorySections.map(({ category, tools: catTools, subgroups }) => {
            const preview = catTools.slice(0, PREVIEW_COUNT);
            const remaining = catTools.length - preview.length;
            const hasSubgroups = subgroups.length > 1;
            return (
              <section key={category.id} className="space-y-4">
                <div className="flex items-center justify-between gap-4 border-b border-border/60 pb-2">
                  <Link
                    href={`/category/${category.id}`}
                    className="group flex items-center gap-2.5 min-w-0"
                  >
                    <span className="flex items-center justify-center w-7 h-7 rounded-md bg-muted text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                      <LucideIcon name={category.icon} className="w-3.5 h-3.5" />
                    </span>
                    <h2 className="text-sm font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors truncate">
                      {category.name}
                    </h2>
                    <span className="text-xs text-muted-foreground tabular-nums shrink-0">
                      {catTools.length}
                    </span>
                  </Link>
                  <Link
                    href={`/category/${category.id}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors shrink-0"
                  >
                    View all
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
                  {preview.map((tool) => (
                    <ToolCard key={tool.id} tool={tool} />
                  ))}
                </div>

                {remaining > 0 && (
                  <Link
                    href={`/category/${category.id}`}
                    className={cn(
                      "inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                    )}
                  >
                    Show {remaining} more in {category.name}
                    {hasSubgroups && " · grouped by topic"}
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
              </section>
            );
          })}
        </div>
      )}
    </main>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
