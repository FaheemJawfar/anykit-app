"use client";

import { Tool } from "@/lib/tools";
import Link from "next/link";
import { Star } from "lucide-react";
import { LucideIcon } from "@/components/lucide-icon";
import { usePersistentTools } from "@/hooks/use-persistent-tools";
import { cn } from "@/lib/utils";

interface ToolCardProps {
  tool: Tool;
}

export function ToolCard({ tool }: ToolCardProps) {
  const { isFavorite, toggleFavorite, mounted } = usePersistentTools();
  const activeFavorite = mounted && isFavorite(tool.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(tool.id);
  };

  return (
    <Link
      href={tool.path}
      className="group block h-full rounded-lg border border-border bg-card p-3.5 transition-all hover:border-primary/30 hover:shadow-[0_1px_2px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.06)] hover:-translate-y-px focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
    >
      <div className="flex items-start gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-md bg-muted text-muted-foreground shrink-0 transition-colors group-hover:bg-primary/10 group-hover:text-primary">
          <LucideIcon name={tool.icon} className="w-4 h-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-medium tracking-tight text-foreground truncate group-hover:text-primary transition-colors">
              {tool.name}
            </h3>
            <button
              type="button"
              onClick={handleFavoriteClick}
              className={cn(
                "shrink-0 w-5 h-5 inline-flex items-center justify-center rounded transition-all",
                activeFavorite
                  ? "text-amber-500 opacity-100"
                  : "text-muted-foreground/50 hover:text-amber-500 opacity-0 group-hover:opacity-100 focus:opacity-100"
              )}
              aria-label={activeFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Star className={cn("w-3.5 h-3.5", activeFavorite && "fill-amber-400 text-amber-400")} />
            </button>
          </div>
          <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground line-clamp-2">
            {tool.description}
          </p>
        </div>
      </div>
    </Link>
  );
}
