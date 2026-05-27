"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ToolCard } from "@/components/tool-card";
import { Button } from "@/components/ui/button";
import { tools, getToolsByCategory, searchTools, categories } from "@/lib/tools";
import { LucideIcon } from "@/components/lucide-icon";
import { usePersistentTools } from "@/hooks/use-persistent-tools";
import { cn } from "@/lib/utils";

function HomeContent() {
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { favoriteTools, mounted } = usePersistentTools();

  useEffect(() => {
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    if (category) {
      setSelectedCategory(category);
    } else {
      setSelectedCategory(null);
    }
    if (search) {
      setSearchQuery(search);
    } else {
      setSearchQuery("");
    }
  }, [searchParams]);

  const filteredTools = useMemo(() => {
    let result = tools;

    if (selectedCategory) {
      result = getToolsByCategory(selectedCategory);
    }

    if (searchQuery) {
      result = searchTools(searchQuery).filter(tool =>
        selectedCategory ? tool.category === selectedCategory : true
      );
    }

    return result;
  }, [selectedCategory, searchQuery]);

  const selectedCategoryData = categories.find(c => c.id === selectedCategory);

  const showFavoritesSection = mounted && favoriteTools.length > 0 && !selectedCategory && !searchQuery;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Premium Ambient Glow Blobs */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[500px] bg-primary/[0.04] dark:bg-primary/[0.05] rounded-full blur-[130px] pointer-events-none -translate-y-1/2" />
      <div className="absolute top-[20%] right-5 w-[450px] h-[450px] bg-violet-500/[0.03] dark:bg-violet-500/[0.03] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[15%] left-5 w-[400px] h-[400px] bg-amber-500/[0.015] dark:bg-amber-500/[0.01] rounded-full blur-[100px] pointer-events-none" />

      <main className="container mx-auto px-4 py-8 md:py-12 relative z-10">
        <div className="space-y-12">
          {/* Favorites Section */}
          {showFavoritesSection && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500">
                  <span className="text-xl">⭐️</span>
                </span>
                <h2 className="text-2xl font-bold">Your Favorite Tools</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {favoriteTools.map((tool) => (
                  <ToolCard key={`fav-${tool.id}`} tool={tool} />
                ))}
              </div>
              <div className="h-px bg-border/50 pt-4" />
            </div>
          )}

          {/* Main List Section */}
          <div className="space-y-8">
            {/* Category Pill Filters (Perfect for quick Desktop/Mobile browsing) */}
            <div className="lg:hidden flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 border-b border-border/10 -mx-4 px-4 md:mx-0 md:px-0">
              <Link
                href="/"
                className={cn(
                  "inline-flex items-center gap-2 px-4.5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border shrink-0 cursor-pointer",
                  !selectedCategory
                    ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/10"
                    : "bg-muted/40 text-muted-foreground border-border/20 hover:bg-muted/70 hover:text-foreground"
                )}
              >
                <span>⚡️</span>
                All Utilities
              </Link>
              {categories.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <Link
                    key={`pill-${cat.id}`}
                    href={`/?category=${cat.id}`}
                    className={cn(
                      "inline-flex items-center gap-2 px-4.5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border shrink-0 cursor-pointer",
                      isActive
                        ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/10"
                        : "bg-muted/40 text-muted-foreground border-border/20 hover:bg-muted/70 hover:text-foreground"
                    )}
                  >
                    <LucideIcon name={cat.icon} className="w-3.5 h-3.5 shrink-0" />
                    {cat.name}
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                {selectedCategoryData ? (
                  <>
                    <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary">
                      <LucideIcon name={selectedCategoryData.icon} className="w-6 h-6" />
                    </span>
                    {selectedCategoryData.name}
                  </>
                ) : (
                  "Featured Tools"
                )}
              </h2>
              <div className="text-sm text-muted-foreground font-medium">
                Showing {filteredTools.length} tools
              </div>
            </div>

            {filteredTools.length === 0 ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                  <span className="text-3xl">🔍</span>
                </div>
                <p className="text-muted-foreground text-lg">No tools found matching your criteria.</p>
                <Button
                  onClick={() => {
                    setSelectedCategory(null);
                    setSearchQuery("");
                  }}
                  variant="outline"
                  className="mt-4"
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {filteredTools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
