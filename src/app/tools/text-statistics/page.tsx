"use client";

import { ToolLayout } from "@/components/tool-layout";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { 
  BarChart3, 
  Copy, 
  Check, 
  Trash2,
  Zap,
  Info,
  History,
  Languages,
  Clock,
  Mic,
  AlignLeft,
  Type,
  Hash,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function TextStatistics() {
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const stats = useMemo(() => {
    if (!input.trim()) return null;

    const words = input.trim().split(/\s+/).filter(Boolean);
    const chars = input.length;
    const charsNoSpaces = input.replace(/\s+/g, "").length;
    const sentences = input.split(/[.!?]+/).filter(Boolean).length;
    const paragraphs = input.split(/\n\n+/).filter(Boolean).length;
    const lines = input.split("\n").length;

    // Averages
    const avgWordLength = words.length ? (charsNoSpaces / words.length).toFixed(1) : "0";
    const avgSentenceLength = sentences ? (words.length / sentences).toFixed(1) : "0";

    // Timing
    const readingTime = Math.ceil(words.length / 200); // 200 wpm
    const speakingTime = Math.ceil(words.length / 130); // 130 wpm

    // Character distribution (top 5)
    const charMap: Record<string, number> = {};
    for (const char of input.toLowerCase()) {
      if (/[a-z0-9]/.test(char)) {
        charMap[char] = (charMap[char] || 0) + 1;
      }
    }
    const topChars = Object.entries(charMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    return {
      words: words.length,
      chars,
      charsNoSpaces,
      sentences,
      paragraphs,
      lines,
      avgWordLength,
      avgSentenceLength,
      readingTime,
      speakingTime,
      topChars
    };
  }, [input]);

  const copy = (val: string, id: string) => {
    navigator.clipboard.writeText(val);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const StatCard = ({ label, value, icon: Icon, color }: { label: string, value: any, icon: any, color?: string }) => (
    <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-3xl overflow-hidden transition-all hover:shadow-2xl hover:shadow-primary/10 group">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center shadow-inner", color || "bg-primary/10 text-primary")}>
            <Icon className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">Insight</span>
        </div>
        <div className="space-y-1">
          <p className="text-2xl font-black tracking-tight">{value}</p>
          <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">{label}</p>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <ToolLayout toolId="text-statistics">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Editor Side */}
        <div className="lg:col-span-12 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col">
            <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <AlignLeft className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Content Analyzer</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setInput("")} className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <CardContent className="p-0">
              <Textarea
                placeholder="Paste your content here to begin analysis..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full h-64 p-12 bg-transparent border-none focus-visible:ring-0 resize-none font-sans text-2xl font-medium leading-relaxed text-foreground/80"
              />
            </CardContent>
          </Card>
        </div>

        {/* Results Grid */}
        <div className="lg:col-span-12">
          {stats ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-6">
                <StatCard label="Words" value={stats.words} icon={Type} />
                <StatCard label="Characters" value={stats.chars} icon={Hash} />
                <StatCard label="Sentences" value={stats.sentences} icon={Activity} />
                <StatCard label="Paragraphs" value={stats.paragraphs} icon={AlignLeft} />
                <StatCard label="Reading Time" value={`${stats.readingTime}m`} icon={Clock} color="bg-blue-500/10 text-blue-600" />
                <StatCard label="Speaking Time" value={`${stats.speakingTime}m`} icon={Mic} color="bg-orange-500/10 text-orange-600" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Advanced Averages */}
                <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
                  <div className="px-8 py-4 border-b border-border/40 bg-muted/30">
                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Structural Averages</span>
                  </div>
                  <CardContent className="p-8 space-y-6">
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-border/10">
                      <p className="text-sm font-bold text-muted-foreground">Avg. Word Length</p>
                      <p className="text-xl font-black text-primary">{stats.avgWordLength} <span className="text-[10px] uppercase font-bold opacity-40">chars</span></p>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-border/10">
                      <p className="text-sm font-bold text-muted-foreground">Avg. Sentence Length</p>
                      <p className="text-xl font-black text-primary">{stats.avgSentenceLength} <span className="text-[10px] uppercase font-bold opacity-40">words</span></p>
                    </div>
                  </CardContent>
                </Card>

                {/* Character Distribution */}
                <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
                  <div className="px-8 py-4 border-b border-border/40 bg-muted/30">
                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Top Character Usage</span>
                  </div>
                  <CardContent className="p-8">
                    <div className="space-y-4">
                      {stats.topChars.map(([char, count]) => (
                        <div key={char} className="space-y-2">
                          <div className="flex justify-between items-end">
                            <span className="text-xs font-black uppercase text-primary/70">{char}</span>
                            <span className="text-[10px] font-bold text-muted-foreground">{count} times</span>
                          </div>
                          <div className="h-2 w-full bg-muted/50 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary/60 rounded-full transition-all duration-1000"
                              style={{ width: `${(count / stats.charsNoSpaces) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div className="p-20 rounded-[2.5rem] bg-muted/10 border border-border/20 flex flex-col items-center justify-center text-center gap-4 border-dashed opacity-50">
              <Zap className="w-12 h-12 text-primary/30" />
              <p className="text-muted-foreground italic font-medium">Statistics will be generated as you type...</p>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
