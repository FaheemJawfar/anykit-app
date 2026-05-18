"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Box, 
  ChevronDown, 
  Menu, 
  Search,
  Wrench,
  Info,
  LayoutGrid,
  Sun,
  Moon
} from "lucide-react";
import { categories } from "@/lib/tools";
import { useState, useEffect } from "react";
import { LucideIcon } from "@/components/lucide-icon";
import { useTheme } from "next-themes";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setIsMobileMenuOpen(false);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
              <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/20 overflow-hidden">
                <Wrench className="w-4 h-4 relative z-10 transition-transform group-hover:rotate-12" />
              </div>
              <span className="font-bold text-lg tracking-tight">AnyKit</span>
            </Link>
          </div>

          <div className="flex-1 flex items-center justify-center lg:justify-start">
            <form onSubmit={handleSearch} className="relative w-full max-w-xl group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Search through 100+ tools..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-muted/50 border border-transparent rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-primary/5 focus:bg-background focus:border-border transition-all"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 px-1.5 py-1 rounded bg-muted border border-border text-[10px] font-bold text-muted-foreground">
                <span className="text-xs">⌘</span> K
              </div>
            </form>
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
            <Button className="rounded-xl px-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20">
              Get Started
            </Button>
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
