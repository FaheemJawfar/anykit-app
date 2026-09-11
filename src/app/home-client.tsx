"use client";

import { useMemo, Suspense, type ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ToolCard } from "@/components/tool-card";
import { CategoryBrowser } from "@/components/category-browser";
import { Button } from "@/components/ui/button";
import { getToolsByCategory, searchTools, categories } from "@/lib/tools";
import { LucideIcon } from "@/components/lucide-icon";
import { usePersistentTools } from "@/hooks/use-persistent-tools";
import { Star } from "lucide-react";

interface HomeProps {
  /** Server-rendered default landing (intro, categories, FAQ). */
  landing: ReactNode;
}

function HomeContent({ landing }: HomeProps) {
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


  return (
    <main className="container mx-auto px-4 md:px-6 py-8 md:py-10 space-y-10">
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

      {/* Default landing — server-rendered so crawlers see it without JS */}
      {!isBrowsingCategory && !isSearching && landing}
    </main>
  );
}

export default function Home({ landing }: HomeProps) {
  return (
    <Suspense
      fallback={
        <main className="container mx-auto px-4 md:px-6 py-8 md:py-10 space-y-10">{landing}</main>
      }
    >
      <HomeContent landing={landing} />
    </Suspense>
  );
}
