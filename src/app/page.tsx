"use client";

import { useState, useMemo } from "react";
import { Navigation } from "@/components/navigation";
import { ToolCard } from "@/components/tool-card";
import { Button } from "@/components/ui/button";
import { tools, getToolsByCategory, searchTools, categories } from "@/lib/tools";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

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
      <Navigation
        onSearch={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">
            {selectedCategoryData ? (
              <span className="flex items-center gap-3">
                <span className="text-4xl">{selectedCategoryData.icon}</span>
                {selectedCategoryData.name}
              </span>
            ) : (
              "All Tools"
            )}
          </h2>
          <p className="text-muted-foreground">
            {selectedCategoryData
              ? selectedCategoryData.description
              : "Browse our collection of tools across different categories"}
          </p>
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
      </main>
    </div>
  );
}
