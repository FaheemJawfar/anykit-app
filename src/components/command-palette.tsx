"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { tools, categories } from "@/lib/tools";
import { LucideIcon } from "@/components/lucide-icon";
import { usePersistentTools } from "@/hooks/use-persistent-tools";
import { Search, Sparkles, Star, History, ArrowRight } from "lucide-react";

// Global event to open/close command palette programmatically
export const CMD_PALETTE_EVENT = "anykit_toggle_cmd_palette";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { favoriteTools, recentTools, addRecent, mounted } = usePersistentTools();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    const handleToggle = () => {
      setOpen((open) => !open);
    };

    document.addEventListener("keydown", down);
    window.addEventListener(CMD_PALETTE_EVENT, handleToggle);

    return () => {
      document.removeEventListener("keydown", down);
      window.removeEventListener(CMD_PALETTE_EVENT, handleToggle);
    };
  }, []);

  const runCommand = (action: () => void) => {
    setOpen(false);
    action();
  };

  const toolsByCategory = useMemo(() => {
    const grouped: Record<string, typeof tools> = {};
    tools.forEach((tool) => {
      if (!grouped[tool.category]) {
        grouped[tool.category] = [];
      }
      grouped[tool.category].push(tool);
    });
    return grouped;
  }, []);

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title="Search AnyKit Tools"
      description="Type a tool name, tag, or category to quickly open any tool instantly."
      className="max-w-2xl border border-border shadow-xl rounded-xl overflow-hidden bg-popover"
    >
      <CommandInput
        placeholder="Search tools, categories, tags..."
        className="h-12 font-medium text-sm pl-4 focus:ring-0 focus:outline-none border-b border-border"
      />
      <CommandList className="max-h-[450px] p-2 overflow-y-auto custom-scrollbar">
        <CommandEmpty className="py-12 text-center text-sm text-muted-foreground">
          No matching tools found.
        </CommandEmpty>

        {/* Favorites Group */}
        {mounted && favoriteTools.length > 0 && (
          <>
            <CommandGroup heading="★ Favorites">
              {favoriteTools.map((tool) => (
                <CommandItem
                  key={`cmd-fav-${tool.id}`}
                  value={`favorite ${tool.name} ${tool.description} ${tool.tags?.join(" ") || ""}`.toLowerCase()}
                  onSelect={() =>
                    runCommand(() => {
                      addRecent(tool.id);
                      router.push(tool.path);
                    })
                  }
                  className="flex items-center gap-3 px-2.5 py-2 rounded-md cursor-pointer transition-colors hover:bg-accent"
                >
                  <div className="flex items-center justify-center w-7 h-7 rounded-md bg-amber-500/10 text-amber-500 shrink-0">
                    <LucideIcon name={tool.icon} className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground">{tool.name}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{tool.description}</p>
                  </div>
                  <CommandShortcut>
                    <ArrowRight className="w-3 h-3 text-muted-foreground/50 opacity-0 group-hover/command-item:opacity-100 transition-opacity" />
                  </CommandShortcut>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator className="my-2 opacity-50" />
          </>
        )}

        {/* Recently Used Group */}
        {mounted && recentTools.length > 0 && (
          <>
            <CommandGroup heading="↺ Recently Visited">
              {recentTools.map((tool) => (
                <CommandItem
                  key={`cmd-recent-${tool.id}`}
                  value={`recent ${tool.name} ${tool.description} ${tool.tags?.join(" ") || ""}`.toLowerCase()}
                  onSelect={() =>
                    runCommand(() => {
                      addRecent(tool.id);
                      router.push(tool.path);
                    })
                  }
                  className="flex items-center gap-3 px-2.5 py-2 rounded-md cursor-pointer transition-colors hover:bg-accent"
                >
                  <div className="flex items-center justify-center w-7 h-7 rounded-md bg-primary/10 text-primary shrink-0">
                    <LucideIcon name={tool.icon} className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground">{tool.name}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{tool.description}</p>
                  </div>
                  <CommandShortcut>
                    <ArrowRight className="w-3 h-3 text-muted-foreground/50 opacity-0 group-hover/command-item:opacity-100 transition-opacity" />
                  </CommandShortcut>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator className="my-2 opacity-50" />
          </>
        )}

        {/* Categorized Tools */}
        {categories.map((cat) => {
          const catTools = toolsByCategory[cat.id] || [];
          if (catTools.length === 0) return null;

          return (
            <CommandGroup key={`group-${cat.id}`} heading={cat.name}>
              {catTools.map((tool) => (
                <CommandItem
                  key={`cmd-tool-${tool.id}`}
                  value={`${tool.name} ${tool.description} ${tool.category} ${tool.tags?.join(" ") || ""}`.toLowerCase()}
                  onSelect={() =>
                    runCommand(() => {
                      addRecent(tool.id);
                      router.push(tool.path);
                    })
                  }
                  className="flex items-center gap-3 px-2.5 py-2 rounded-md cursor-pointer transition-colors hover:bg-accent"
                >
                  <div className="flex items-center justify-center w-7 h-7 rounded-md bg-muted text-muted-foreground shrink-0">
                    <LucideIcon name={tool.icon} className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground">{tool.name}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{tool.description}</p>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          );
        })}
      </CommandList>
    </CommandDialog>
  );
}
