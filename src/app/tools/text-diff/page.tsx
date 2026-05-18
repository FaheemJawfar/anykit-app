"use client";

import { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Diff, 
  ArrowRightLeft, 
  Eraser, 
  Zap, 
  FileText, 
  Plus, 
  Minus,
  Maximize2,
  Columns
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function TextDiff() {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [showDiff, setShowDiff] = useState(false);

  const diffResult = useMemo(() => {
    if (!showDiff) return [];
    const lines1 = text1.split("\n");
    const lines2 = text2.split("\n");
    const result: { type: "add" | "remove" | "equal"; content: string }[] = [];

    // Simple line-by-line diff for MVP
    let i = 0, j = 0;
    while (i < lines1.length || j < lines2.length) {
      if (i < lines1.length && j < lines2.length && lines1[i] === lines2[j]) {
        result.push({ type: "equal", content: lines1[i] });
        i++; j++;
      } else if (i < lines1.length && (j >= lines2.length || !lines2.includes(lines1[i]))) {
        result.push({ type: "remove", content: lines1[i] });
        i++;
      } else if (j < lines2.length && (i >= lines1.length || !lines1.includes(lines2[j]))) {
        result.push({ type: "add", content: lines2[j] });
        j++;
      } else {
        result.push({ type: "equal", content: lines1[i] });
        i++; j++;
      }
    }
    return result;
  }, [text1, text2, showDiff]);

  const stats = useMemo(() => {
    return {
      added: diffResult.filter(d => d.type === "add").length,
      removed: diffResult.filter(d => d.type === "remove").length
    };
  }, [diffResult]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
          <Diff className="w-6 h-6" />
        </div>
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight">Text Diff</h1>
          <p className="text-sm text-muted-foreground">
            Compare two texts and visualize line-by-line differences.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2rem] overflow-hidden">
            <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Original Text</span>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => setText1("")}>
                <Eraser className="w-3.5 h-3.5 text-muted-foreground" />
              </Button>
            </div>
            <CardContent className="p-0">
              <Textarea
                placeholder="Paste original text here..."
                value={text1}
                onChange={(e) => { setText1(e.target.value); setShowDiff(false); }}
                className="min-h-[300px] p-6 bg-transparent border-none focus-visible:ring-0 resize-none font-mono text-sm leading-relaxed"
              />
            </CardContent>
          </Card>

          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2rem] overflow-hidden">
            <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Modified Text</span>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => setText2("")}>
                <Eraser className="w-3.5 h-3.5 text-muted-foreground" />
              </Button>
            </div>
            <CardContent className="p-0">
              <Textarea
                placeholder="Paste modified text here..."
                value={text2}
                onChange={(e) => { setText2(e.target.value); setShowDiff(false); }}
                className="min-h-[300px] p-6 bg-transparent border-none focus-visible:ring-0 resize-none font-mono text-sm leading-relaxed"
              />
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col items-center gap-6">
          <Button 
            onClick={() => setShowDiff(true)}
            disabled={!text1 && !text2}
            className="h-14 rounded-2xl px-12 bg-primary hover:bg-primary/90 text-lg font-bold shadow-lg shadow-primary/20 transition-all active:scale-95"
          >
            <ArrowRightLeft className="w-5 h-5 mr-3" />
            Compare Texts
          </Button>

          {showDiff && (
            <div className="w-full space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="flex items-center justify-center gap-8">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <Plus className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">{stats.added} Added</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20">
                  <Minus className="w-4 h-4 text-red-500" />
                  <span className="text-xs font-bold text-red-600 uppercase tracking-wider">{stats.removed} Removed</span>
                </div>
              </div>

              <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/50 backdrop-blur-md rounded-[2.5rem] overflow-hidden">
                <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Columns className="w-4 h-4 text-primary" />
                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Diff Output</span>
                  </div>
                  <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Unified View</div>
                </div>
                <CardContent className="p-0">
                  <div className="divide-y divide-border/5">
                    {diffResult.length > 0 ? diffResult.map((line, i) => (
                      <div 
                        key={i} 
                        className={cn(
                          "flex items-start gap-4 px-8 py-2 font-mono text-sm leading-relaxed",
                          line.type === "add" && "bg-emerald-500/5 text-emerald-600",
                          line.type === "remove" && "bg-red-500/5 text-red-600",
                          line.type === "equal" && "text-muted-foreground/60"
                        )}
                      >
                        <span className="w-6 text-[10px] font-bold text-center mt-1 opacity-40">
                          {line.type === "add" ? "+" : line.type === "remove" ? "-" : ""}
                        </span>
                        <pre className="whitespace-pre-wrap break-all">{line.content || " "}</pre>
                      </div>
                    )) : (
                      <div className="py-24 flex flex-col items-center justify-center text-center space-y-3 opacity-20">
                        <Diff className="w-12 h-12" />
                        <p className="text-sm font-medium">No differences found</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

