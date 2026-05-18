"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { categories } from "@/lib/tools";
import { Button } from "@/components/ui/button";
import { Search, Menu, X } from "lucide-react";

interface NavigationProps {
  onSearch: (query: string) => void;
  selectedCategory: string | null;
  onCategoryChange: (categoryId: string | null) => void;
}

export function Navigation({ onSearch, selectedCategory, onCategoryChange }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <span className="text-xl">🛠️</span>
              </div>
              <span className="bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
                AnyKit
              </span>
            </Link>
            
            <div className="hidden md:flex items-center gap-1">
              <Button
                variant={selectedCategory === null ? "default" : "ghost"}
                size="sm"
                onClick={() => onCategoryChange(null)}
                className="font-medium"
              >
                All
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onCategoryChange(category.id)}
                  className="font-medium"
                >
                  <span className="mr-1.5">{category.icon}</span>
                  {category.name}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tools..."
                className="pl-10 w-64 bg-muted/50 border-border/50 focus:bg-background transition-colors"
                onChange={(e) => onSearch(e.target.value)}
              />
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-border/50 pt-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tools..."
                className="pl-10 bg-muted/50 border-border/50 focus:bg-background transition-colors"
                onChange={(e) => onSearch(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <Button
                variant={selectedCategory === null ? "default" : "ghost"}
                className="justify-start font-medium"
                onClick={() => {
                  onCategoryChange(null);
                  setIsMobileMenuOpen(false);
                }}
              >
                All Tools
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "ghost"}
                  className="justify-start font-medium"
                  onClick={() => {
                    onCategoryChange(category.id);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
