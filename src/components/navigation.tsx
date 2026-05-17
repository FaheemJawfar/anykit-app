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
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
              <span className="text-2xl">🛠️</span>
              <span>AnyKit</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-1">
              <Button
                variant={selectedCategory === null ? "default" : "ghost"}
                size="sm"
                onClick={() => onCategoryChange(null)}
              >
                All Tools
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onCategoryChange(category.id)}
                >
                  <span className="mr-1">{category.icon}</span>
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
                className="pl-10 w-64"
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
          <div className="md:hidden pb-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tools..."
                className="pl-10"
                onChange={(e) => onSearch(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <Button
                variant={selectedCategory === null ? "default" : "ghost"}
                className="justify-start"
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
                  className="justify-start"
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
