"use client";

import { ToolLayout } from "@/components/tool-layout";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { 
  Table as TableIcon, 
  Copy, 
  Check, 
  Plus,
  Trash2,
  Settings2,
  Code,
  Zap,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Info,
  Layout
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function MarkdownTableGenerator() {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [data, setData] = useState<string[][]>([]);
  const [alignments, setAlignments] = useState<("left" | "center" | "right")[]>([]);
  const [copied, setCopied] = useState(false);

  // Initialize/Update data matrix
  useEffect(() => {
    const newData = Array.from({ length: rows }, (_, i) => 
      Array.from({ length: cols }, (_, j) => data[i]?.[j] || (i === 0 ? `Header ${j + 1}` : ""))
    );
    setData(newData);
    
    setAlignments(prev => {
      const next = [...prev];
      while (next.length < cols) next.push("left");
      return next.slice(0, cols);
    });
  }, [rows, cols]);

  const updateCell = (r: number, c: number, val: string) => {
    const newData = [...data];
    newData[r][c] = val;
    setData(newData);
  };

  const toggleAlignment = (c: number) => {
    setAlignments(prev => {
      const next = [...prev];
      const current = next[c];
      next[c] = current === "left" ? "center" : current === "center" ? "right" : "left";
      return next;
    });
  };

  const generateMarkdown = () => {
    if (data.length === 0) return "";

    const headers = data[0].map(h => h.padEnd(8)).join(" | ");
    const separator = alignments.map(a => {
      if (a === "center") return ":------:";
      if (a === "right") return "-------:";
      return ":-------";
    }).join(" | ");
    
    const bodyRows = data.slice(1).map(row => 
      row.map(cell => cell.padEnd(8)).join(" | ")
    ).join("\n");

    return `| ${headers} |\n| ${separator} |\n| ${bodyRows} |`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateMarkdown());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout toolId="md-table-generator">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Editor Side */}
        <div className="lg:col-span-12 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Rows</span>
                  <div className="flex bg-background border border-border/40 rounded-xl p-1">
                    <Button variant="ghost" size="icon" onClick={() => setRows(Math.max(2, rows - 1))} className="h-7 w-7 rounded-lg"><ChevronDown className="w-3.5 h-3.5" /></Button>
                    <span className="w-10 text-center font-mono font-bold text-sm leading-7">{rows}</span>
                    <Button variant="ghost" size="icon" onClick={() => setRows(Math.min(20, rows + 1))} className="h-7 w-7 rounded-lg"><ChevronUp className="w-3.5 h-3.5" /></Button>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Cols</span>
                  <div className="flex bg-background border border-border/40 rounded-xl p-1">
                    <Button variant="ghost" size="icon" onClick={() => setCols(Math.max(1, cols - 1))} className="h-7 w-7 rounded-lg"><ChevronLeft className="w-3.5 h-3.5" /></Button>
                    <span className="w-10 text-center font-mono font-bold text-sm leading-7">{cols}</span>
                    <Button variant="ghost" size="icon" onClick={() => setCols(Math.min(10, cols + 1))} className="h-7 w-7 rounded-lg"><ChevronRight className="w-3.5 h-3.5" /></Button>
                  </div>
                </div>
              </div>

              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => { setRows(3); setCols(3); setData([]); }}
                className="h-9 rounded-xl font-bold text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Reset Table
              </Button>
            </div>

            <CardContent className="p-8 overflow-auto">
              <div className="inline-block min-w-full align-middle">
                <div className="border border-border/40 rounded-2xl overflow-hidden shadow-inner bg-muted/20">
                  <table className="min-w-full divide-y divide-border/40">
                    <thead>
                      <tr className="bg-primary/5">
                        {alignments.map((align, c) => (
                          <th key={c} className="p-4 text-center border-x border-border/40">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => toggleAlignment(c)}
                              className={cn(
                                "h-7 px-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                                align === "left" && "text-blue-500",
                                align === "center" && "text-primary",
                                align === "right" && "text-orange-500"
                              )}
                            >
                              {align}
                            </Button>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {data.map((row, r) => (
                        <tr key={r} className={cn(r === 0 ? "bg-muted/50" : "bg-card/20")}>
                          {row.map((cell, c) => (
                            <td key={c} className="p-0 border-x border-border/40">
                              <input 
                                value={cell}
                                onChange={(e) => updateCell(r, c, e.target.value)}
                                className={cn(
                                  "w-full h-12 px-4 bg-transparent focus:outline-none focus:bg-primary/[0.02] text-sm transition-colors",
                                  r === 0 ? "font-bold text-primary" : "text-foreground/80",
                                  alignments[c] === "center" ? "text-center" : alignments[c] === "right" ? "text-right" : "text-left"
                                )}
                                placeholder={r === 0 ? "Header..." : "Cell..."}
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview Side */}
        <div className="lg:col-span-12 space-y-6">
          <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col min-h-[300px]">
            <div className="px-8 py-6 border-b border-border/40 bg-primary/5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <Code className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-primary">Markdown Syntax</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyToClipboard}
                className={cn(
                  "rounded-xl font-bold px-4 hover:bg-primary/10 transition-all",
                  copied && "text-green-500 hover:text-green-500"
                )}
              >
                {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied ? "Copied" : "Copy Table"}
              </Button>
            </div>
            <CardContent className="p-0 flex-1 relative bg-primary/[0.01]">
              <pre className="p-8 font-mono text-[11px] leading-loose text-foreground/80 overflow-auto whitespace-pre selection:bg-primary/20">
                {generateMarkdown()}
              </pre>
            </CardContent>
          </Card>

          <div className="p-6 rounded-3xl bg-muted/30 border border-border/40 flex items-start gap-6">
            <div className="w-12 h-12 rounded-2xl bg-background flex items-center justify-center text-muted-foreground/30 shadow-inner shrink-0">
              <Info className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">About Alignment</h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Alignment syntax (<code>:---</code>, <code>:---:</code>, <code>---:</code>) determines how the text is justified in the rendered table. This is fully supported by GitHub, GitLab, and other GFM-compatible processors.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
