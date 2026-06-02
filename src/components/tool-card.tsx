"use client";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tool } from "@/lib/tools";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { LucideIcon } from "@/components/lucide-icon";
import { usePersistentTools } from "@/hooks/use-persistent-tools";
import { Button } from "@/components/ui/button";

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
    <Link href={tool.path} className="block group active:scale-[0.99] transition-transform h-full">
      <Card className="h-full relative transition-all duration-300 border border-border/35 hover:border-primary/35 hover:shadow-[0_30px_50px_-30px_rgba(8,47,73,0.45)] hover:-translate-y-1 bg-card/70 backdrop-blur-md overflow-hidden rounded-2xl">
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(circle_at_top,color-mix(in_oklch,var(--primary)_16%,transparent),transparent_58%)]" />
        <CardHeader className="p-5 relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-primary/10 text-primary shadow-inner group-hover:bg-primary/15 transition-colors shrink-0 ring-1 ring-primary/15">
                <LucideIcon name={tool.icon} className="w-5.5 h-5.5 transition-transform group-hover:scale-110" />
                <div className="absolute inset-0 rounded-xl border border-primary/10 group-hover:border-primary/25 transition-colors" />
              </div>
              <div className="min-w-0">
                <CardTitle className="text-sm font-bold tracking-tight text-foreground/95 group-hover:text-primary transition-colors truncate">
                  {tool.name}
                </CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="px-1.5 py-0.5 text-[8px] uppercase tracking-[0.16em] font-extrabold bg-muted/70 text-muted-foreground border-transparent rounded-md">
                    {tool.category}
                  </Badge>
                  {tool.isNew && (
                    <span className="flex h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                  )}
                </div>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleFavoriteClick}
              className={`w-8 h-8 rounded-lg text-muted-foreground hover:text-amber-500 hover:bg-amber-500/10 transition-all shrink-0 ${
                activeFavorite ? "opacity-100 text-amber-500" : "opacity-0 group-hover:opacity-100"
              }`}
              aria-label={activeFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Star className={`w-4 h-4 ${activeFavorite ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`} />
            </Button>
          </div>
          <CardDescription className="text-xs leading-relaxed line-clamp-2 text-muted-foreground/85 font-medium">
            {tool.description}
          </CardDescription>
        </CardHeader>
        
        <div className="px-5 py-2.5 border-t border-border/20 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0 bg-primary/[0.03]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Open Utility</span>
          <ArrowRight className="w-3.5 h-3.5 text-primary transform -translate-x-1 group-hover:translate-x-0 transition-transform" />
        </div>
      </Card>
    </Link>
  );
}
