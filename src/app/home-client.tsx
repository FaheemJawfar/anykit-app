"use client";

import { useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ToolCard } from "@/components/tool-card";
import { Button } from "@/components/ui/button";
import { tools, getToolsByCategory, searchTools, categories } from "@/lib/tools";
import { LucideIcon } from "@/components/lucide-icon";
import { usePersistentTools } from "@/hooks/use-persistent-tools";
import { cn } from "@/lib/utils";

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category");
  const searchQuery = searchParams.get("search") ?? "";
  const { favoriteTools, mounted } = usePersistentTools();

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
  const spotlightCategories = categories.slice(0, 8);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute -top-36 left-[10%] h-[520px] w-[520px] rounded-full bg-primary/[0.14] blur-[135px] pointer-events-none" />
      <div className="absolute top-[22%] right-[-120px] h-[460px] w-[460px] rounded-full bg-accent/[0.25] blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-140px] left-[22%] h-[420px] w-[420px] rounded-full bg-emerald-500/[0.10] blur-[120px] pointer-events-none" />

      <main className="container mx-auto px-4 py-8 md:py-12 relative z-10 space-y-8 md:space-y-10">
        <section className="relative rounded-3xl border border-border/50 bg-card/65 backdrop-blur-xl overflow-hidden shadow-[0_26px_70px_-42px_rgba(15,23,42,0.55)]">
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_left,color-mix(in_oklch,var(--primary)_22%,transparent),transparent_52%)]" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/45 to-transparent" />

          <div className="relative p-6 md:p-8 lg:p-10 space-y-8">
            <div className="space-y-5 max-w-3xl">
              <p className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                <span className="inline-flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                100+ browser-powered utilities
              </p>
              <div className="space-y-3">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-balance tracking-tight text-foreground">
                  Build, convert, format, and ship faster with one unified toolkit.
                </h1>
                <p className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
                  AnyKit keeps your workflow frictionless with privacy-first tools that run directly in your browser across development, content, and daily tasks.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {selectedCategoryData && (
                  <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
                    <LucideIcon name={selectedCategoryData.icon} className="w-3.5 h-3.5" />
                    {selectedCategoryData.name}
                  </span>
                )}
                {searchQuery && (
                  <span className="inline-flex items-center gap-2 rounded-full border border-accent-foreground/20 bg-accent/55 px-3 py-1.5 text-xs font-semibold text-accent-foreground">
                    Query: {searchQuery}
                  </span>
                )}
                {(selectedCategory || searchQuery) && (
                  <Button
                    onClick={() => router.push("/")}
                    variant="outline"
                    size="sm"
                    className="rounded-full border-border/60 bg-background/70"
                  >
                    Reset View
                  </Button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 md:gap-4">
              <div className="rounded-2xl border border-border/45 bg-background/55 p-4">
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground font-semibold">Total Tools</p>
                <p className="mt-2 text-2xl md:text-3xl font-black text-foreground">{tools.length}+</p>
              </div>
              <div className="rounded-2xl border border-border/45 bg-background/55 p-4">
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground font-semibold">Categories</p>
                <p className="mt-2 text-2xl md:text-3xl font-black text-foreground">{categories.length}</p>
              </div>
              <div className="rounded-2xl border border-border/45 bg-background/55 p-4">
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground font-semibold">Favorites</p>
                <p className="mt-2 text-2xl md:text-3xl font-black text-foreground">{mounted ? favoriteTools.length : 0}</p>
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-2 flex-wrap">
              <Link
                href="/"
                className={cn(
                  "inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border",
                  !selectedCategory
                    ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
                    : "bg-background/70 text-muted-foreground border-border/55 hover:bg-muted/70 hover:text-foreground"
                )}
              >
                <span>⚡️</span>
                All Utilities
              </Link>
              {spotlightCategories.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <Link
                    key={`hero-pill-${cat.id}`}
                    href={`/?category=${cat.id}`}
                    className={cn(
                      "inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border",
                      isActive
                        ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
                        : "bg-background/70 text-muted-foreground border-border/55 hover:bg-muted/70 hover:text-foreground"
                    )}
                  >
                    <LucideIcon name={cat.icon} className="w-3.5 h-3.5 shrink-0" />
                    {cat.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {showFavoritesSection && (
          <section className="rounded-3xl border border-border/45 bg-card/55 backdrop-blur-xl p-5 md:p-6 space-y-5">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-500/15 text-amber-500">
                <span className="text-xl">⭐️</span>
              </span>
              <div>
                <h2 className="text-2xl font-bold">Your Favorite Tools</h2>
                <p className="text-sm text-muted-foreground">Quick access to the tools you use most.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-5">
              {favoriteTools.map((tool) => (
                <ToolCard key={`fav-${tool.id}`} tool={tool} />
              ))}
            </div>
          </section>
        )}

        <section className="space-y-7 rounded-3xl border border-border/45 bg-card/55 backdrop-blur-xl p-5 md:p-6">
          <div className="lg:hidden flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
            <Link
              href="/"
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border shrink-0 cursor-pointer",
                !selectedCategory
                  ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/10"
                  : "bg-background/70 text-muted-foreground border-border/30 hover:bg-muted/70 hover:text-foreground"
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
                    "inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border shrink-0 cursor-pointer",
                    isActive
                      ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/10"
                      : "bg-background/70 text-muted-foreground border-border/30 hover:bg-muted/70 hover:text-foreground"
                  )}
                >
                  <LucideIcon name={cat.icon} className="w-3.5 h-3.5 shrink-0" />
                  {cat.name}
                </Link>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              {selectedCategoryData ? (
                <>
                  <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
                    <LucideIcon name={selectedCategoryData.icon} className="w-5 h-5" />
                  </span>
                  {selectedCategoryData.name}
                </>
              ) : (
                "Featured Tools"
              )}
            </h2>
            <div className="text-sm text-muted-foreground font-semibold">
              Showing {filteredTools.length} tools
            </div>
          </div>

          {filteredTools.length === 0 ? (
            <div className="text-center py-16 rounded-2xl border border-dashed border-border/50 bg-background/55">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <span className="text-3xl">🔍</span>
              </div>
              <p className="text-muted-foreground text-lg">No tools found matching your criteria.</p>
              <Button
                onClick={() => router.push("/")}
                variant="outline"
                className="mt-4 rounded-xl"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-5">
              {filteredTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          )}
        </section>
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
