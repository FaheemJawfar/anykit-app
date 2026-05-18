"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { ToolCard } from "@/components/tool-card";
import { Button } from "@/components/ui/button";
import { tools, getToolsByCategory, searchTools, categories } from "@/lib/tools";

function HomeContent() {
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    if (category) {
      setSelectedCategory(category);
    }
    if (search) {
      setSearchQuery(search);
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

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 pb-20">
        <section className="py-12 md:py-24 space-y-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Simple. Secure. Free.
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.1]">
              Magical tools for <br />
              <span className="bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">your everyday tasks.</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
              From resizing images to generating secure passwords, AnyKit provides easy-to-use tools that just work. No accounts, no tracking—just productivity.
            </p>
          </div>

          <Navigation
            onSearch={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </section>

        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              {selectedCategoryData ? (
                <>
                  <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-muted text-2xl">
                    {selectedCategoryData.icon}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          )}
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
