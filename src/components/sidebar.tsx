"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutGrid,
  ChevronDown,
  Star,
  Clock,
  Trash2,
  Coffee,
  Heart,
} from "lucide-react";
import { categories, getToolsByCategory } from "@/lib/tools";
import { LucideIcon } from "@/components/lucide-icon";
import { usePersistentTools } from "@/hooks/use-persistent-tools";
import { KOFI_URL, SUPPORT_CONFIG } from "@/lib/support";

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [openSections, setOpenSections] = useState({
    favorites: true,
    recents: true,
    categories: true,
  });

  const { favoriteTools, recentTools, clearRecents, mounted } = usePersistentTools();

  // Active category is now derived from the /category/<id> route.
  const categoryMatch = pathname.match(/^\/category\/([^/]+)/);
  const currentCategory = categoryMatch?.[1];
  const isHome = pathname === "/";

  const visibleCategories = showAllCategories ? categories : categories.slice(0, 9);
  const hasMoreCategories = categories.length > 9;

  const toggleSection = (section: "favorites" | "recents" | "categories") => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 border-r border-border bg-sidebar/60 backdrop-blur-sm">
      <div className="px-5 h-16 flex items-center border-b border-border/60">
        <Link
          href="/"
          className="flex items-center gap-2.5 group cursor-pointer"
          onClick={(event) => {
            event.preventDefault();
            router.push("/");
          }}
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-lg overflow-hidden ring-1 ring-primary/15">
            <img
              src="/logo.svg"
              alt="AnyKit"
              className="w-full h-full pointer-events-none"
              draggable="false"
            />
          </div>
          <span className="font-bold text-base leading-none tracking-tight">AnyKit App</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 custom-scrollbar">
        {/* Favorites */}
        {mounted && favoriteTools.length > 0 && (
          <section className="space-y-1">
            <button
              type="button"
              onClick={() => toggleSection("favorites")}
              className="w-full px-2 py-1.5 flex items-center justify-between rounded-md hover:bg-accent/50 transition-colors"
            >
              <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-amber-500 font-bold">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                Favorites
              </span>
              <span className="flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground">
                {favoriteTools.length}
                <ChevronDown
                  className={cn("w-3 h-3 transition-transform", openSections.favorites ? "rotate-180" : "")}
                />
              </span>
            </button>

            {openSections.favorites && (
              <nav className="space-y-0.5">
                {favoriteTools.map((tool) => (
                  <Link
                    key={tool.id}
                    href={tool.path}
                    className={cn(
                      "flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors",
                      pathname === tool.path
                        ? "bg-amber-500/10 text-amber-700 dark:text-amber-300"
                        : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                    )}
                  >
                    <LucideIcon name={tool.icon} className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{tool.name}</span>
                  </Link>
                ))}
              </nav>
            )}
          </section>
        )}

        {/* Recents */}
        {mounted && recentTools.length > 0 && (
          <section className="space-y-1">
            <div className="px-2 py-1.5 flex items-center justify-between">
              <button
                type="button"
                onClick={() => toggleSection("recents")}
                className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground font-bold hover:text-foreground transition-colors"
              >
                <Clock className="w-3 h-3" />
                Recents
                <span className="text-[10px] normal-case tracking-normal">({recentTools.length})</span>
                <ChevronDown
                  className={cn("w-3 h-3 transition-transform", openSections.recents ? "rotate-180" : "")}
                />
              </button>
              <button
                type="button"
                onClick={clearRecents}
                className="hover:text-destructive transition-colors p-0.5 rounded"
                title="Clear recent history"
                aria-label="Clear recent history"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>

            {openSections.recents && (
              <nav className="space-y-0.5">
                {recentTools.map((tool) => (
                  <Link
                    key={tool.id}
                    href={tool.path}
                    className={cn(
                      "flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors",
                      pathname === tool.path
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                    )}
                  >
                    <LucideIcon name={tool.icon} className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{tool.name}</span>
                  </Link>
                ))}
              </nav>
            )}
          </section>
        )}

        {/* Categories */}
        <section className="space-y-1">
          <button
            type="button"
            onClick={() => toggleSection("categories")}
            className="w-full px-2 py-1.5 flex items-center justify-between rounded-md hover:bg-accent/50 transition-colors"
          >
            <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground font-bold">
              Categories
            </span>
            <span className="flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground">
              {categories.length}
              <ChevronDown
                className={cn("w-3 h-3 transition-transform", openSections.categories ? "rotate-180" : "")}
              />
            </span>
          </button>

          {openSections.categories && (
            <>
              <nav className="space-y-0.5">
                <Link
                  href="/"
                  className={cn(
                    "flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-sm font-medium transition-colors",
                    isHome
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                  )}
                >
                  <LayoutGrid className="w-4 h-4" />
                  All Tools
                </Link>

                {visibleCategories.map((category) => {
                  const isActive = currentCategory === category.id;
                  return (
                    <Link
                      key={category.id}
                      href={`/category/${category.id}`}
                      className={cn(
                        "flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-sm font-medium transition-colors group",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                      )}
                    >
                      <LucideIcon
                        name={category.icon}
                        className={cn(
                          "w-4 h-4 shrink-0",
                          isActive ? "text-primary" : "text-muted-foreground"
                        )}
                      />
                      <span className="flex-1 truncate">{category.name}</span>
                      <span className="text-[10px] tabular-nums text-muted-foreground/70">
                        {getCategoryCount(category.id)}
                      </span>
                    </Link>
                  );
                })}
              </nav>

              {hasMoreCategories && (
                <button
                  type="button"
                  onClick={() => setShowAllCategories((prev) => !prev)}
                  className="px-2.5 py-1.5 text-[11px] font-semibold text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showAllCategories ? "Show fewer" : `Show all ${categories.length}`}
                </button>
              )}
            </>
          )}
        </section>
      </div>

      <div className="p-3 border-t border-border/60">
        <div className="rounded-lg border border-border bg-card p-3 space-y-2">
          <div className="flex items-center gap-2">
            <Heart className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Support AnyKit
            </p>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Built solo by {SUPPORT_CONFIG.authorName}. No ads, no tracking.
          </p>
          <a
            href={KOFI_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-full gap-1.5 h-8 px-3 rounded-md font-semibold text-xs bg-foreground text-background hover:bg-foreground/90 transition-colors"
          >
            <Coffee className="w-3.5 h-3.5" />
            Buy me a coffee
          </a>
        </div>
      </div>
    </aside>
  );
}

// Lightweight per-category count helper.
function getCategoryCount(id: string): number {
  return getToolsByCategory(id).length;
}
