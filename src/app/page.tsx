"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ToolCard } from "@/components/tool-card";
import { Button } from "@/components/ui/button";
import { tools, getToolsByCategory, searchTools, categories } from "@/lib/tools";
import { LucideIcon } from "@/components/lucide-icon";

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
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="space-y-8">
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
