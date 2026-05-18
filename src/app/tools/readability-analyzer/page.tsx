"use client";

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
  BookOpen,
  AlignLeft,
  Search,
  Activity,
  Type
} from "lucide-react";
import { cn } from "@/lib/utils";
import readability from "text-readability";

export default function ReadabilityAnalyzer() {
  const [input, setInput] = useState("AnyKit provides a comprehensive collection of tools for developers and creators. It is designed to be fast, secure, and entirely client-side, ensuring your data never leaves your browser.");
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => {
    if (!input.trim() || input.length < 10) return null;

    return {
      fleschKincaidGrade: readability.fleschKincaidGrade(input),
      fleschReadingEase: readability.fleschReadingEase(input),
      gunningFog: readability.gunningFog(input),
      automatedReadabilityIndex: readability.automatedReadabilityIndex(input),
      colemanLiauIndex: readability.colemanLiauIndex(input),
      difficultWords: readability.difficultWords(input)
    };
  }, [input]);

  const getEaseLabel = (score: number) => {
    if (score >= 90) return { label: "Very Easy", color: "text-green-500", desc: "5th grade level" };
    if (score >= 80) return { label: "Easy", color: "text-green-500", desc: "6th grade level" };
    if (score >= 70) return { label: "Fairly Easy", color: "text-green-400", desc: "7th grade level" };
    if (score >= 60) return { label: "Standard", color: "text-primary", desc: "8th-9th grade level" };
    if (score >= 50) return { label: "Fairly Difficult", color: "text-orange-400", desc: "10th-12th grade level" };
    if (score >= 30) return { label: "Difficult", color: "text-orange-500", desc: "College level" };
    return { label: "Very Confusing", color: "text-destructive", desc: "College graduate level" };
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8 text-foreground">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
          <BookOpen className="w-6 h-6" />
        </div>
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight">Readability Analyzer</h1>
          <p className="text-sm text-muted-foreground">
            Analyze text difficulty using industry-standard formulas like Flesch-Kincaid.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Editor Side */}
        <div className="lg:col-span-12 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col">
            <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <AlignLeft className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Text Input</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setInput("")} className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <CardContent className="p-0">
              <Textarea
                placeholder="Enter text to analyze readability..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full h-48 p-12 bg-transparent border-none focus-visible:ring-0 resize-none font-sans text-xl leading-relaxed"
              />
            </CardContent>
          </Card>
        </div>

        {/* Results Grid */}
        <div className="lg:col-span-12">
          {stats ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Main Score Card */}
                <Card className="md:col-span-1 border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col items-center justify-center p-8 text-center">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Reading Ease Score</p>
                  <div className="text-8xl font-black tracking-tighter text-primary drop-shadow-sm">
                    {Math.round(stats.fleschReadingEase)}
                  </div>
                  <div className="mt-4 space-y-1">
                    <p className={cn("text-xl font-bold", getEaseLabel(stats.fleschReadingEase).color)}>
                      {getEaseLabel(stats.fleschReadingEase).label}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                      {getEaseLabel(stats.fleschReadingEase).desc}
                    </p>
                  </div>
                </Card>

                {/* Grid of Other Scores */}
                <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[
                    { label: "Grade Level", value: stats.fleschKincaidGrade, icon: Type },
                    { label: "Fog Index", value: stats.gunningFog, icon: Activity },
                    { label: "ARI Index", value: stats.automatedReadabilityIndex, icon: Zap },
                    { label: "Coleman-Liau", value: stats.colemanLiauIndex, icon: History },
                    { label: "Difficult Words", value: stats.difficultWords, icon: Info }
                  ].map((item, i) => (
                    <div key={i} className="p-6 rounded-3xl bg-muted/20 border border-border/10 flex flex-col gap-3 transition-all hover:bg-muted/30">
                      <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
                        <item.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xl font-black tracking-tight">{item.value}</p>
                        <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">{item.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-20 rounded-[2.5rem] bg-muted/10 border border-border/20 flex flex-col items-center justify-center text-center gap-4 border-dashed opacity-30">
              <BookOpen className="w-12 h-12 text-muted-foreground" />
              <p className="text-muted-foreground italic font-medium">Insights will appear here as you type...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
