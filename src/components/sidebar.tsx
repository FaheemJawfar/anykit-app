"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutGrid,
  ChevronRight,
  Star,
  Clock,
  Trash2,
  Coffee,
  Heart
} from "lucide-react";
import { categories } from "@/lib/tools";
import { LucideIcon } from "@/components/lucide-icon";
import { usePersistentTools } from "@/hooks/use-persistent-tools";
import { KOFI_PRESET_URL, KOFI_URL, SUPPORT_CONFIG } from "@/lib/support";

export function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");

  const { favoriteTools, recentTools, clearRecents, mounted } = usePersistentTools();

  return (
    <aside className="hidden lg:flex flex-col w-72 h-screen sticky top-0 border-r border-border/35 bg-sidebar/75 backdrop-blur-2xl shadow-[inset_-1px_0_0_color-mix(in_oklch,var(--border)_40%,transparent)]">
      <div className="p-6 border-b border-border/40">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl overflow-hidden shadow-[0_14px_26px_-18px_color-mix(in_oklch,var(--primary)_70%,transparent)] ring-1 ring-primary/20">
            <img src="/logo.svg" alt="AnyKit" className="w-full h-full relative z-10 transition-transform group-hover:scale-105" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl leading-none tracking-tight">AnyKit App</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/90 font-semibold">Tools for Everyone</span>
          </div>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-8 custom-scrollbar">
        {/* Favorites Section (Dynamic) */}
        {mounted && favoriteTools.length > 0 && (
          <div>
            <div className="px-3 mb-2.5 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-amber-500 font-bold">
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
              Favorites
            </div>
            <nav className="space-y-1">
              {favoriteTools.map((tool) => (
                <Link
                  key={tool.id}
                  href={tool.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all group",
                    pathname === tool.path
                      ? "bg-amber-500/12 text-amber-700 dark:text-amber-300 ring-1 ring-amber-500/25"
                      : "text-muted-foreground hover:bg-accent/70 hover:text-foreground"
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
            <div className="px-3 mb-2.5 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">
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
                    "flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all group",
                    pathname === tool.path
                      ? "bg-primary/10 text-primary ring-1 ring-primary/20"
                      : "text-muted-foreground hover:bg-accent/70 hover:text-foreground"
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
          <div className="px-3 mb-2.5 text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">
            Categories
          </div>
          <nav className="space-y-1">
            <Link
              href="/"
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all group",
                mounted && !currentCategory && pathname === "/"
                  ? "bg-primary/10 text-primary ring-1 ring-primary/20"
                  : "text-muted-foreground hover:bg-accent/70 hover:text-foreground"
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
                    ? "bg-primary/10 text-primary ring-1 ring-primary/20" 
                    : "text-muted-foreground hover:bg-accent/70 hover:text-foreground"
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

      </div>

      <div className="p-4 border-t border-border/40">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/12 via-orange-500/8 to-rose-500/12 ring-1 ring-amber-500/15 shadow-[0_18px_44px_-34px_rgba(180,83,9,0.65)] space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-amber-500/15">
              <Heart className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              Support AnyKit
            </p>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Built solo by <span className="font-semibold text-foreground">{SUPPORT_CONFIG.authorName}</span>.
            No ads, no tracking, all in your browser. A coffee keeps it free.
          </p>
          <a
            href={KOFI_PRESET_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-full gap-2 h-10 px-4 rounded-xl font-semibold text-sm bg-[#FF5E5B] text-white hover:bg-[#ff4744] transition-colors active:scale-[0.98] shadow-[0_16px_30px_-18px_rgba(239,68,68,0.9)]"
          >
            <Coffee className="w-4 h-4" />
            <span>Buy me a coffee — ${SUPPORT_CONFIG.presetAmount}</span>
          </a>
          <a
            href={KOFI_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Choose another amount →
          </a>
        </div>
      </div>
    </aside>
  );
}
