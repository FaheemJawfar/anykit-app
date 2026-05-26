"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutGrid,
  ChevronRight,
  Shield,
  FileText,
  Star,
  Clock,
  Trash2
} from "lucide-react";
import { categories, tools } from "@/lib/tools";
import { LucideIcon } from "@/components/lucide-icon";
import { usePersistentTools } from "@/hooks/use-persistent-tools";

export function Sidebar() {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");

  const { favoriteTools, recentTools, clearRecents } = usePersistentTools();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <aside className="hidden lg:flex flex-col w-72 h-screen sticky top-0 border-r border-border/40 bg-card/30 backdrop-blur-xl">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-primary/20">
            <img src="/logo.svg" alt="AnyKit" className="w-full h-full relative z-10 transition-transform group-hover:scale-105" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl leading-none tracking-tight">AnyKit App</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">Tools for Everyone</span>
          </div>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-8 custom-scrollbar">
        {/* Favorites Section (Dynamic) */}
        {mounted && favoriteTools.length > 0 && (
          <div>
            <div className="px-3 mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-amber-500 font-bold">
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
              Favorites
            </div>
            <nav className="space-y-1">
              {favoriteTools.map((tool) => (
                <Link
                  key={tool.id}
                  href={tool.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-1.5 rounded-xl text-xs font-medium transition-all group",
                    pathname === tool.path
                      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <LucideIcon name={tool.icon} className="w-3.5 h-3.5" />
                  <span className="truncate flex-1">{tool.name}</span>
                </Link>
              ))}
            </nav>
          </div>
        )}

        {/* Recents Section (Dynamic) */}
        {mounted && recentTools.length > 0 && (
          <div>
            <div className="px-3 mb-2 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">
              <span className="flex items-center gap-2">
                <Clock className="w-3 h-3" />
                Recents
              </span>
              <button
                onClick={clearRecents}
                className="hover:text-destructive transition-colors p-0.5 rounded"
                title="Clear recent history"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
            <nav className="space-y-1">
              {recentTools.map((tool) => (
                <Link
                  key={tool.id}
                  href={tool.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-1.5 rounded-xl text-xs font-medium transition-all group",
                    pathname === tool.path
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <LucideIcon name={tool.icon} className="w-3.5 h-3.5" />
                  <span className="truncate flex-1">{tool.name}</span>
                </Link>
              ))}
            </nav>
          </div>
        )}

        <div>
          <div className="px-3 mb-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">
            Categories
          </div>
          <nav className="space-y-1">
            <Link
              href="/"
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all group",
                mounted && !currentCategory && pathname === "/"
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <LayoutGrid className="w-4 h-4" />
              All Tools
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/?category=${category.id}`}
                className={cn(
                  "flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all group",
                  mounted && currentCategory === category.id 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <div className="flex items-center gap-3">
                  <LucideIcon 
                    name={category.icon} 
                    className={cn(
                      "w-4 h-4 transition-transform group-hover:scale-110",
                      mounted && currentCategory === category.id ? "text-primary" : "text-muted-foreground"
                    )} 
                  />
                  {category.name}
                </div>
                <ChevronRight className={cn(
                  "w-3 h-3 transition-transform opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0",
                  mounted && currentCategory === category.id ? "opacity-100 translate-x-0" : ""
                )} />
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <div className="px-3 mb-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">
            Legal
          </div>
          <nav className="space-y-1">
            <Link href="/privacy" className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-all">
              <Shield className="w-4 h-4" />
              Privacy Policy
            </Link>
            <Link href="/terms" className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-all">
              <FileText className="w-4 h-4" />
              Terms of Service
            </Link>
          </nav>
        </div>
      </div>

      <div className="p-4 border-t border-border/40">
        <div className="p-4 rounded-2xl bg-primary/5 space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-primary/70">Support AnyKit App</p>
          <p className="text-xs text-muted-foreground leading-relaxed">Help us keep the tools free and fast for everyone.</p>
          <a
            href="https://www.buymeacoffee.com/faheemj"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-full gap-2 h-10 px-4 rounded-xl font-semibold text-sm transition-transform active:scale-95"
            style={{
              backgroundColor: "#FFDD00",
              color: "#000000",
              outline: "1px solid #000000",
              fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
            }}
          >
            <span>♥️</span>
            <span>Support My Work</span>
          </a>
        </div>
      </div>
    </aside>
  );
}
