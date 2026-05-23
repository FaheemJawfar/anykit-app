"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Menu,
  Search,
  LayoutGrid,
  Sun,
  Moon,
  ArrowRight,
  Command,
  Star
} from "lucide-react";
import { categories, searchTools, Tool } from "@/lib/tools";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { LucideIcon } from "@/components/lucide-icon";
import { useTheme } from "next-themes";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [stars, setStars] = useState<number | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [mounted, setMounted] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchTools(searchQuery).slice(0, 6);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setIsDropdownOpen(false);
      setIsMobileMenuOpen(false);
    }
  };

  const handleSelectTool = useCallback((tool: Tool) => {
    router.push(tool.path);
    setSearchQuery("");
    setIsDropdownOpen(false);
    setActiveIndex(-1);
  }, [router]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isDropdownOpen) {
      if (e.key === "ArrowDown" && searchResults.length > 0) {
        setIsDropdownOpen(true);
        setActiveIndex(0);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        setActiveIndex(prev => (prev + 1) % (searchResults.length + 1));
        e.preventDefault();
        break;
      case "ArrowUp":
        setActiveIndex(prev => (prev - 1 + searchResults.length + 1) % (searchResults.length + 1));
        e.preventDefault();
        break;
      case "Enter":
        if (activeIndex === -1) {
          handleSearch(e);
        } else if (activeIndex < searchResults.length) {
          handleSelectTool(searchResults[activeIndex]);
        } else {
          router.push(`/?search=${encodeURIComponent(searchQuery)}`);
          setSearchQuery("");
          setIsDropdownOpen(false);
        }
        e.preventDefault();
        break;
      case "Escape":
        setIsDropdownOpen(false);
        setActiveIndex(-1);
        inputRef.current?.blur();
        break;
    }
  }, [isDropdownOpen, searchResults, activeIndex, handleSelectTool, handleSearch, router, searchQuery]);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetch("https://api.github.com/repos/FaheemJawfar/anykit-app")
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.stargazers_count === "number") {
          setStars(data.stargazers_count);
        }
      })
      .catch(() => {
        // silently fail
      });
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300 border-b",
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-border/50 py-3"
          : "bg-background border-transparent py-4"
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 lg:hidden">
            <Link
              href="/"
              className="flex items-center gap-2 group transition-opacity hover:opacity-90"
            >
              <div className="relative flex items-center justify-center w-8 h-8 rounded-lg overflow-hidden shadow-lg shadow-primary/20">
                <img src="/logo.svg" alt="AnyKit" className="w-full h-full relative z-10" />
              </div>
              <span className="font-bold text-lg tracking-tight">AnyKit App</span>
            </Link>
          </div>

          <div className="flex-1 flex items-center justify-center lg:justify-start">
            <div ref={searchRef} className="relative w-full max-w-xl group">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search through 100+ tools..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsDropdownOpen(e.target.value.trim().length > 0);
                    setActiveIndex(-1);
                  }}
                  onFocus={() => {
                    if (searchQuery.trim()) setIsDropdownOpen(true);
                  }}
                  onKeyDown={handleKeyDown}
                  className="w-full pl-11 pr-4 py-2.5 bg-muted/50 border border-transparent rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-primary/5 focus:bg-background focus:border-border transition-all"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 px-1.5 py-1 rounded bg-muted border border-border text-[10px] font-bold text-muted-foreground">
                  <span className="text-xs">⌘</span> K
                </div>
              </form>

              {isDropdownOpen && searchQuery.trim() && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-2xl shadow-xl shadow-black/5 overflow-hidden z-50">
                  {searchResults.length > 0 ? (
                    <div className="py-2">
                      <div className="px-4 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Tools
                      </div>
                      {searchResults.map((tool, index) => (
                        <button
                          key={tool.id}
                          onClick={() => handleSelectTool(tool)}
                          className={cn(
                            "w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors",
                            activeIndex === index
                              ? "bg-accent"
                              : "hover:bg-accent/50"
                          )}
                        >
                          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary shrink-0">
                            <LucideIcon name={tool.icon} className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">
                              {tool.name}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              {tool.description}
                            </div>
                          </div>
                          <ArrowRight className={cn(
                            "w-4 h-4 text-muted-foreground shrink-0",
                            activeIndex === index ? "opacity-100" : "opacity-0"
                          )} />
                        </button>
                      ))}
                      <div className="border-t border-border mt-1 pt-1">
                        <button
                          onClick={() => {
                            router.push(`/?search=${encodeURIComponent(searchQuery)}`);
                            setSearchQuery("");
                            setIsDropdownOpen(false);
                          }}
                          className={cn(
                            "w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors",
                            activeIndex === searchResults.length
                              ? "bg-accent"
                              : "hover:bg-accent/50"
                          )}
                        >
                          <Search className="w-4 h-4 text-muted-foreground" />
                          <span className="flex-1">View all results for "{searchQuery}"</span>
                          <ArrowRight className={cn(
                            "w-4 h-4 text-muted-foreground shrink-0",
                            activeIndex === searchResults.length ? "opacity-100" : "opacity-0"
                          )} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                      No tools found matching "{searchQuery}"
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="rounded-xl border-border/50"
              onClick={toggleTheme}
            >
              {mounted && (theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />)}
              {!mounted && <div className="w-4 h-4" />}
            </Button>
            <Button variant="outline" size="icon" className="rounded-xl hidden sm:flex border-border/50">
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <a
              href="https://github.com/FaheemJawfar/anykit-app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-foreground text-background hover:bg-foreground/90 h-10 px-4 transition-colors font-medium"
              aria-label="GitHub Repository"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              <span className="hidden sm:inline text-sm">GitHub</span>
              {stars !== null && (
                <span className="flex items-center gap-1 text-xs font-semibold opacity-90">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  {stars.toLocaleString()}
                </span>
              )}
            </a>
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden rounded-xl"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-background border-b border-border p-4 animate-in slide-in-from-top duration-300">
          <nav className="flex flex-col gap-2">
            <Link
              href="/"
              className="px-4 py-3 rounded-xl text-base font-medium hover:bg-accent transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              All Tools
            </Link>
            <div className="h-px bg-border my-2" />
            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/?category=${category.id}`}
                  className="flex items-center gap-2 p-3 rounded-xl hover:bg-accent transition-colors border border-border/50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <LucideIcon name={category.icon} className="w-4 h-4" />
                  <span className="text-sm font-medium">{category.name}</span>
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
