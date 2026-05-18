"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Smile, 
  Search, 
  Copy, 
  Check, 
  Trash2,
  Zap,
  Info,
  Globe,
  Heart,
  Car,
  Pizza,
  Gamepad2,
  Lightbulb,
  Briefcase
} from "lucide-react";
import { cn } from "@/lib/utils";
import emojiData from "unicode-emoji-json";

export default function EmojiPicker() {
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Simplified categorization since the library doesn't provide it directly
  const categories = [
    { name: "Recent", icon: Zap },
    { name: "Smiley", icon: Smile },
    { name: "Hearts", icon: Heart },
    { name: "Food", icon: Pizza },
    { name: "Activities", icon: Gamepad2 },
    { name: "Objects", icon: Lightbulb },
    { name: "Travel", icon: Car },
    { name: "Flags", icon: Globe }
  ];

  const emojis = Object.entries(emojiData).map(([emoji, info]: [string, any]) => ({
    emoji,
    name: info.name,
    slug: info.slug,
    group: info.group
  }));

  const filteredEmojis = emojis.filter(e => 
    e.name.toLowerCase().includes(search.toLowerCase()) || 
    e.slug.toLowerCase().includes(search.toLowerCase())
  ).slice(0, 200); // Limit for performance

  const copy = (val: string) => {
    navigator.clipboard.writeText(val);
    setCopied(val);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
          <Smile className="w-6 h-6" />
        </div>
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight">Emoji Picker</h1>
          <p className="text-sm text-muted-foreground">
            Browse and search for any emoji to copy to your clipboard.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sidebar */}
        <div className="lg:col-span-3 space-y-4">
          <div className="p-1 bg-muted/50 rounded-2xl border border-border/40 flex flex-col gap-1">
            {categories.map((cat) => (
              <Button
                key={cat.name}
                variant={activeCategory === cat.name ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveCategory(cat.name)}
                className="justify-start rounded-xl font-bold h-10 px-4 text-xs"
              >
                <cat.icon className="w-4 h-4 mr-2" />
                {cat.name}
              </Button>
            ))}
          </div>

          <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-primary">Pro Tip</h3>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed italic">
              Click any emoji to copy it instantly. Use the search bar to find specific emotions or objects.
            </p>
          </div>
        </div>

        {/* Main Picker */}
        <div className="lg:col-span-9 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col">
            <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search emojis (e.g. smile, heart, fire)..."
                  className="h-12 pl-12 pr-6 rounded-xl bg-background border-border/40 font-bold focus:ring-primary/20"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-3 py-1 bg-muted/50 rounded-full">
                  {filteredEmojis.length} Emojis Found
                </span>
              </div>
            </div>
            
            <CardContent className="p-8">
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 xl:grid-cols-10 gap-3">
                {filteredEmojis.map((e, i) => (
                  <button 
                    key={i}
                    onClick={() => copy(e.emoji)}
                    className={cn(
                      "group aspect-square rounded-2xl flex items-center justify-center text-3xl transition-all relative",
                      copied === e.emoji ? "bg-green-500 scale-90" : "bg-muted/20 hover:bg-primary/10 hover:scale-110 active:scale-95"
                    )}
                    title={e.name}
                  >
                    <span className={cn(copied === e.emoji && "invisible")}>{e.emoji}</span>
                    {copied === e.emoji && (
                      <Check className="absolute inset-0 m-auto w-6 h-6 text-white animate-in zoom-in-50" />
                    )}
                  </button>
                ))}
              </div>

              {filteredEmojis.length === 0 && (
                <div className="py-20 text-center space-y-4">
                  <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto">
                    <Search className="w-10 h-10 text-muted-foreground/30" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-lg">No Emojis Found</h3>
                    <p className="text-sm text-muted-foreground">Try searching for a different keyword.</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
