"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Menu,
  Search,
  LayoutGrid,
  Sun,
  Moon,
  Star,
  Heart
} from "lucide-react";
import { categories } from "@/lib/tools";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LucideIcon } from "@/components/lucide-icon";
import { useTheme } from "next-themes";
import { CMD_PALETTE_EVENT } from "@/components/command-palette";
import { KOFI_PRESET_URL } from "@/lib/support";

export function Header() {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
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

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const handleOpenCommandPalette = () => {
    window.dispatchEvent(new CustomEvent(CMD_PALETTE_EVENT));
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300 border-b",
        isScrolled
          ? "bg-background/75 backdrop-blur-2xl border-border/40 py-2.5 shadow-[0_14px_32px_-24px_rgba(0,0,0,0.55)]"
          : "bg-background/50 border-transparent py-4"
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center gap-3 justify-between">
          <div className="flex items-center gap-4 lg:hidden shrink-0">
            <Link
              href="/"
              className="flex items-center gap-2 group transition-opacity hover:opacity-90 cursor-pointer"
              onClick={(event) => {
                event.preventDefault();
                router.push("/");
              }}
            >
              <div className="relative flex items-center justify-center w-8 h-8 rounded-lg overflow-hidden shadow-[0_8px_20px_-10px_color-mix(in_oklch,var(--primary)_40%,transparent)] ring-1 ring-primary/15">
                <img src="/logo.svg" alt="AnyKit" className="w-full h-full relative z-10 pointer-events-none" draggable="false" />
              </div>
              <span className="font-bold text-lg tracking-tight">AnyKit App</span>
            </Link>
          </div>

          <div className="flex-1 flex items-center justify-center lg:justify-start min-w-0">
            <button
              onClick={handleOpenCommandPalette}
              className="relative w-full max-w-2xl group flex items-center text-left pl-11 pr-4 h-11 bg-card/65 hover:bg-card/85 border border-border/45 hover:border-primary/30 rounded-2xl text-sm text-muted-foreground/85 transition-all focus:outline-none focus:ring-4 focus:ring-primary/10 cursor-pointer overflow-hidden"
            >
              <div className="absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-primary/12 to-transparent pointer-events-none" />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary transition-colors pointer-events-none" />
              <span className="truncate">Search tools, categories, tags... (⌘K)</span>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg bg-muted/70 border border-border/60 text-[10px] font-bold text-muted-foreground">
                <span className="text-xs">⌘</span> K
              </div>
            </button>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Button
              variant="outline"
              size="icon"
              className="rounded-xl border-border/50 bg-card/45 hover:bg-card"
              onClick={toggleTheme}
            >
              <Sun className="hidden dark:block w-4 h-4" />
              <Moon className="block dark:hidden w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-xl hidden sm:flex border-border/50 bg-card/45 hover:bg-card" onClick={handleOpenCommandPalette}>
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <a
              href={KOFI_PRESET_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl h-10 px-3.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 ring-1 ring-amber-500/25 transition-colors font-semibold text-sm"
              aria-label="Support AnyKit on Ko-fi"
              title="Support AnyKit"
            >
              <Heart className="w-4 h-4 fill-current" />
              <span className="hidden md:inline">Sponsor</span>
            </a>
            <a
              href="https://github.com/FaheemJawfar/anykit-app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-foreground text-background hover:bg-foreground/90 h-10 px-3.5 md:px-4 transition-colors font-medium shadow-[0_10px_26px_-16px_rgba(0,0,0,0.75)]"
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
        <div className="lg:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border/50 p-4 animate-in slide-in-from-top duration-300 shadow-[0_18px_42px_-30px_rgba(0,0,0,0.7)]">
          <nav className="flex flex-col gap-2.5">
            <Link
              href="/"
              className="px-4 py-3 rounded-xl text-base font-semibold bg-card/60 border border-border/40 hover:bg-accent transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              All Tools
            </Link>
            <div className="h-px bg-border/60 my-2" />
            <div className="grid grid-cols-2 gap-2.5">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/?category=${category.id}`}
                  className="flex items-center gap-2.5 p-3 rounded-xl hover:bg-accent transition-colors border border-border/50 bg-card/45"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <LucideIcon name={category.icon} className="w-4 h-4" />
                  <span className="text-sm font-semibold leading-tight">{category.name}</span>
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
