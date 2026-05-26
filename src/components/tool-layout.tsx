"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { getToolById, categories } from "@/lib/tools";
import { LucideIcon } from "@/components/lucide-icon";
import { usePersistentTools } from "@/hooks/use-persistent-tools";
import { Button } from "@/components/ui/button";
import { ChevronRight, Share2, Star, ArrowLeft, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ToolLayoutProps {
  toolId: string;
  children: React.ReactNode;
}

export function ToolLayout({ toolId, children }: ToolLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isFavorite, toggleFavorite, addRecent, mounted } = usePersistentTools();
  const { toast } = useToast();
  const [shareCopied, setShareCopied] = useState(false);

  // Find tool metadata
  const tool = getToolById(toolId);

  useEffect(() => {
    if (tool) {
      // Add tool to recents history when visiting the page
      addRecent(tool.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toolId]);

  if (!tool) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="text-2xl font-bold text-destructive">Tool Not Found</h1>
        <p className="text-muted-foreground">The requested utility tool does not exist or has been moved.</p>
        <Button onClick={() => router.push("/")} variant="outline" className="rounded-xl">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Button>
      </div>
    );
  }

  // Find category metadata
  const category = categories.find((c) => c.id === tool.category);
  const activeFavorite = mounted && isFavorite(tool.id);

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      await navigator.clipboard.writeText(url);
      setShareCopied(true);
      toast("Tool URL copied to clipboard!", { type: "success", title: "Shared successfully" });
      setTimeout(() => setShareCopied(false), 2000);
    } catch {
      toast("Could not copy URL. Please copy it manually.", { type: "error", title: "Copy failed" });
    }
  };

  const handleToggleFavorite = () => {
    toggleFavorite(tool.id);
    const becameFav = !activeFavorite;
    toast(
      becameFav
        ? `Added "${tool.name}" to your favorites!`
        : `Removed "${tool.name}" from your favorites.`,
      {
        type: becameFav ? "success" : "info",
        title: becameFav ? "Added to Favorites" : "Removed from Favorites",
      }
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pt-2 pb-6 md:pt-3 md:pb-10 space-y-8 text-foreground">
      {/* Dynamic Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground/80 overflow-x-auto whitespace-nowrap">
        <Link href="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 opacity-60 shrink-0" />
        {category && (
          <>
            <Link href={`/?category=${category.id}`} className="hover:text-primary transition-colors">
              {category.name}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 opacity-60 shrink-0" />
          </>
        )}
        <span className="text-foreground font-bold truncate">{tool.name}</span>
      </nav>

      {/* Tool Header Block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border/40">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
            <LucideIcon name={tool.icon} className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl md:text-3xl font-black tracking-tight">{tool.name}</h1>
              {tool.isNew && (
                <span className="px-2 py-0.5 text-[9px] font-black tracking-wider bg-primary/10 text-primary rounded-full uppercase">
                  New
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground/90 leading-relaxed max-w-2xl">
              {tool.description}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="outline"
            onClick={handleShare}
            className="rounded-xl border-border/40 font-bold text-xs h-10 px-4 flex items-center gap-2 hover:bg-muted/40"
          >
            {shareCopied ? (
              <>
                <Check className="w-4 h-4 text-green-500" />
                Copied Link
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                Share
              </>
            )}
          </Button>

          <Button
            variant="outline"
            onClick={handleToggleFavorite}
            className={`rounded-xl border-border/40 font-bold text-xs h-10 px-4 flex items-center gap-2 transition-all hover:bg-amber-500/5 hover:border-amber-500/20 ${
              activeFavorite ? "bg-amber-500/5 border-amber-500/30 text-amber-600 dark:text-amber-400" : ""
            }`}
          >
            <Star className={`w-4 h-4 ${activeFavorite ? "fill-amber-400 text-amber-400" : ""}`} />
            {activeFavorite ? "Favorited" : "Favorite"}
          </Button>
        </div>
      </div>

      {/* Tool Workspace Area */}
      <div className="w-full">
        {children}
      </div>
    </div>
  );
}
