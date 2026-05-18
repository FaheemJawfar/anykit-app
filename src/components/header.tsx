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
  LayoutGrid
} from "lucide-react";
import { categories } from "@/lib/tools";
import { useState, useEffect } from "react";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setIsMobileMenuOpen(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Tools", href: "/#tools" },
    { name: "About", href: "/about" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] transition-all duration-300 border-b",
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-border/50 py-3"
          : "bg-transparent border-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link 
              href="/" 
              className="flex items-center gap-2 group transition-opacity hover:opacity-90"
            >
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 overflow-hidden">
                <Wrench className="w-5 h-5 relative z-10 transition-transform group-hover:rotate-12" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl leading-none tracking-tight">AnyKit</span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">Tools for Everyone</span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                    pathname === link.href ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <div className="relative group ml-2">
                <button className="flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground group-hover:text-foreground">
                  Categories <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                </button>
                <div className="absolute top-full left-0 mt-2 w-64 p-2 bg-popover border border-border rounded-2xl shadow-xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 grid grid-cols-1 gap-1">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/?category=${category.id}`}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-accent transition-colors group/item"
                    >
                      <span className="text-lg">{category.icon}</span>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{category.name}</span>
                        <span className="text-[10px] text-muted-foreground line-clamp-1">{category.description}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <form onSubmit={handleSearch} className="hidden sm:flex items-center relative mr-2">
              <Search className="absolute left-3 w-4 h-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search tools..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-muted/50 border border-transparent rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-background focus:border-border transition-all w-40 lg:w-60"
              />
            </form>
            <Button variant="outline" size="icon" className="rounded-full hidden sm:flex border-border/50">
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button className="rounded-full px-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20">
              Get Started
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden rounded-full"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-border p-4 animate-in slide-in-from-top duration-300">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-3 rounded-xl text-base font-medium hover:bg-accent transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="h-px bg-border my-2" />
            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/?category=${category.id}`}
                  className="flex items-center gap-2 p-2 rounded-xl hover:bg-accent transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>{category.icon}</span>
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
