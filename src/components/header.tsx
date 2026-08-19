"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, Search, Sun, Moon, Star, Heart } from "lucide-react";
import { categories } from "@/lib/tools";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LucideIcon } from "@/components/lucide-icon";
import { useTheme } from "next-themes";
import { CMD_PALETTE_EVENT } from "@/components/command-palette";
import { KOFI_URL } from "@/lib/support";

export function Header() {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetch("https://api.github.com/repos/FaheemJawfar/anykit-app")
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.stargazers_count === "number") setStars(data.stargazers_count);
      })
      .catch(() => {});
  }, []);

  const toggleTheme = () => setTheme(resolvedTheme === "dark" ? "light" : "dark");

  const handleOpenCommandPalette = () => {
    window.dispatchEvent(new CustomEvent(CMD_PALETTE_EVENT));
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-colors duration-200 border-b",
        isScrolled
          ? "bg-background/85 backdrop-blur-md border-border/60"
          : "bg-background/60 border-transparent"
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center gap-3 justify-between h-16">
          {/* Mobile logo */}
          <Link
            href="/"
            className="flex items-center gap-2 lg:hidden shrink-0"
            onClick={(event) => {
              event.preventDefault();
              router.push("/");
            }}
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg overflow-hidden ring-1 ring-primary/15">
              <img src="/logo.svg" alt="AnyKit" className="w-full h-full pointer-events-none" draggable="false" />
            </div>
            <span className="font-bold text-base tracking-tight">AnyKit App</span>
          </Link>

          {/* Search trigger */}
          <div className="flex-1 flex items-center justify-center lg:justify-start min-w-0">
            <button
              onClick={handleOpenCommandPalette}
              className="relative w-full max-w-xl group flex items-center text-left pl-10 pr-3 h-10 bg-card hover:bg-accent/40 border border-border hover:border-primary/30 rounded-lg text-sm text-muted-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 cursor-pointer"
            >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <span className="truncate">Search tools, categories, tags...</span>
              <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-muted border border-border text-[10px] font-bold text-muted-foreground">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="icon"
              className="rounded-lg border-border bg-card hover:bg-accent/40"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              <Sun className="hidden dark:block w-4 h-4" />
              <Moon className="block dark:hidden w-4 h-4" />
            </Button>
            <a
              href={KOFI_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-lg h-9 px-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 ring-1 ring-amber-500/25 transition-colors font-semibold text-xs"
              aria-label="Support AnyKit on Ko-fi"
            >
              <Heart className="w-3.5 h-3.5 fill-current" />
              <span className="hidden md:inline">Sponsor</span>
            </a>
            <a
              href="https://github.com/FaheemJawfar/anykit-app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-foreground text-background hover:bg-foreground/90 h-9 px-3 md:px-3.5 transition-colors font-medium text-xs"
              aria-label="GitHub Repository"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="hidden sm:inline">GitHub</span>
              {stars !== null && (
                <span className="flex items-center gap-1 text-[10px] font-semibold opacity-90">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  {stars.toLocaleString()}
                </span>
              )}
            </a>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden rounded-lg"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md border-b border-border/60 p-4 animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col gap-1.5">
            <Link
              href="/"
              className="px-3 py-2.5 rounded-lg text-sm font-semibold bg-card border border-border hover:bg-accent/40 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              All Tools
            </Link>
            <div className="h-px bg-border/60 my-1.5" />
            <div className="grid grid-cols-2 gap-1.5">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.id}`}
                  className="flex items-center gap-2 p-2.5 rounded-lg hover:bg-accent/40 transition-colors border border-border bg-card/60"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <LucideIcon name={category.icon} className="w-4 h-4 shrink-0" />
                  <span className="text-xs font-semibold leading-tight truncate">{category.name}</span>
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
