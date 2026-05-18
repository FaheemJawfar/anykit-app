"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { categories } from "@/lib/tools";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Search, Menu, X } from "lucide-react";

interface NavigationProps {
  onSearch: (query: string) => void;
  selectedCategory: string | null;
  onCategoryChange: (categoryId: string | null) => void;
}

export function Navigation({ onSearch, selectedCategory, onCategoryChange }: NavigationProps) {
  return (
    <div className="py-8 space-y-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 p-1.5 bg-muted/50 rounded-2xl border border-border/50">
          <Button
            variant={selectedCategory === null ? "default" : "ghost"}
            size="sm"
            onClick={() => onCategoryChange(null)}
            className={cn(
              "rounded-xl font-medium px-4",
              selectedCategory === null ? "shadow-md shadow-primary/10" : "text-muted-foreground"
            )}
          >
            All Tools
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "ghost"}
              size="sm"
              onClick={() => onCategoryChange(category.id)}
              className={cn(
                "rounded-xl font-medium px-4",
                selectedCategory === category.id ? "shadow-md shadow-primary/10" : "text-muted-foreground"
              )}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </Button>
          ))}
        </div>

        <div className="relative w-full md:w-72 lg:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Search through 100+ tools..."
            className="pl-11 pr-4 h-12 bg-muted/30 border-border/50 rounded-2xl focus:bg-background focus:ring-4 focus:ring-primary/5 transition-all"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
