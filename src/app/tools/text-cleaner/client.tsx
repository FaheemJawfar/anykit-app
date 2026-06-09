"use client";

import { useState, useEffect } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import {
  Eraser,
  Copy,
  Trash2,
  Wand2,
  Minimize2,
  ArrowRight,
  TextQuote,
  Smile,
  Settings2,
  Sparkles,
  Download,
} from "lucide-react";

export default function TextCleaner() {
  const [inputText, setInputText] = useState("");
  const [cleanedText, setCleanedText] = useState("");
  const [copied, setCopied] = useState(false);
  const [copiedTimeout, setCopiedTimeout] = useState<NodeJS.Timeout | null>(null);

  const [removeExtraSpaces, setRemoveExtraSpaces] = useState(true);
  const [removeLineBreaks, setRemoveLineBreaks] = useState(false);
  const [tabsToSpaces, setTabsToSpaces] = useState(false);
  const [removePunctuation, setRemovePunctuation] = useState(false);
  const [removeEmojis, setRemoveEmojis] = useState(false);
  const [trimLines, setTrimLines] = useState(true);

  const handleClean = () => {
    if (!inputText) {
      setCleanedText("");
      return;
    }

    let result = inputText;

    if (trimLines) {
      result = result.split("\n").map((line) => line.trim()).join("\n");
    }

    if (tabsToSpaces) {
      result = result.replace(/\t/g, "    ");
    }

    if (removeExtraSpaces) {
      result = result.replace(/[ \t]+/g, " ");
    }

    if (removeLineBreaks) {
      result = result.replace(/[\r\n]+/g, " ");
      if (removeExtraSpaces) {
        result = result.replace(/\s+/g, " ");
      }
    }

    if (removePunctuation) {
      result = result.replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ");
    }

    if (removeEmojis) {
      result = result.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, "");
    }

    setCleanedText(result.trim());
    setCopied(false);
  };

  useEffect(() => {
    handleClean();
  }, [inputText, removeExtraSpaces, removeLineBreaks, tabsToSpaces, removePunctuation, removeEmojis, trimLines]);

  const handleCopy = () => {
    navigator.clipboard.writeText(cleanedText);
    setCopied(true);
    if (copiedTimeout) clearTimeout(copiedTimeout);
    setCopiedTimeout(setTimeout(() => setCopied(false), 2000));
  };

  const handleClear = () => {
    setInputText("");
    setCleanedText("");
    setCopied(false);
  };

  const handleDownload = () => {
    if (!cleanedText) return;
    const blob = new Blob([cleanedText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `cleaned-text.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const loadSample = () => {
    setInputText(`  This   text   has    too    many    spaces.
    
It also has 
unnecessary
line breaks.

And some tabs:	here	and	here.
Also some emojis: 👋 🌍 🚀
And punctuation! How messy...
   Trim this line   `);
  };

  return (
    <ToolLayout toolId="text-cleaner">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-4 lg:order-last space-y-6">
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <Button
              onClick={handleCopy}
              disabled={!cleanedText}
              className="w-full h-12 shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest text-xs rounded-xl"
            >
              <Copy className="w-4 h-4 mr-2" />
              {copied ? "Copied!" : "Copy Result"}
            </Button>
          </div>

          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wide flex items-center gap-2">
              <Settings2 className="w-4 h-4" />
              Cleaning Options
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <label className="flex items-center gap-2.5 p-2.5 bg-muted border border-border rounded-xl cursor-pointer hover:bg-accent transition-all select-none group">
                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${removeExtraSpaces ? "bg-primary border-primary" : "bg-card border-muted-foreground/30"}`}>
                  {removeExtraSpaces && <Wand2 className="w-2.5 h-2.5 text-primary-foreground" />}
                </div>
                <input type="checkbox" checked={removeExtraSpaces} onChange={(e) => setRemoveExtraSpaces(e.target.checked)} className="hidden" />
                <span className={`text-xs font-bold ${removeExtraSpaces ? "text-foreground" : "text-muted-foreground"}`}>Extra Spaces</span>
              </label>

              <label className="flex items-center gap-2.5 p-2.5 bg-muted border border-border rounded-xl cursor-pointer hover:bg-accent transition-all select-none group">
                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${removeLineBreaks ? "bg-primary border-primary" : "bg-card border-muted-foreground/30"}`}>
                  {removeLineBreaks && <ArrowRight className="w-2.5 h-2.5 text-primary-foreground" />}
                </div>
                <input type="checkbox" checked={removeLineBreaks} onChange={(e) => setRemoveLineBreaks(e.target.checked)} className="hidden" />
                <span className={`text-xs font-bold ${removeLineBreaks ? "text-foreground" : "text-muted-foreground"}`}>Line Breaks</span>
              </label>

              <label className="flex items-center gap-2.5 p-2.5 bg-muted border border-border rounded-xl cursor-pointer hover:bg-accent transition-all select-none group">
                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${tabsToSpaces ? "bg-primary border-primary" : "bg-card border-muted-foreground/30"}`}>
                  {tabsToSpaces && <Minimize2 className="w-2.5 h-2.5 text-primary-foreground" />}
                </div>
                <input type="checkbox" checked={tabsToSpaces} onChange={(e) => setTabsToSpaces(e.target.checked)} className="hidden" />
                <span className={`text-xs font-bold ${tabsToSpaces ? "text-foreground" : "text-muted-foreground"}`}>Tabs to Spaces</span>
              </label>

              <label className="flex items-center gap-2.5 p-2.5 bg-muted border border-border rounded-xl cursor-pointer hover:bg-accent transition-all select-none group">
                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${removePunctuation ? "bg-primary border-primary" : "bg-card border-muted-foreground/30"}`}>
                  {removePunctuation && <TextQuote className="w-2.5 h-2.5 text-primary-foreground" />}
                </div>
                <input type="checkbox" checked={removePunctuation} onChange={(e) => setRemovePunctuation(e.target.checked)} className="hidden" />
                <span className={`text-xs font-bold ${removePunctuation ? "text-foreground" : "text-muted-foreground"}`}>Punctuation</span>
              </label>

              <label className="flex items-center gap-2.5 p-2.5 bg-muted border border-border rounded-xl cursor-pointer hover:bg-accent transition-all select-none group">
                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${removeEmojis ? "bg-primary border-primary" : "bg-card border-muted-foreground/30"}`}>
                  {removeEmojis && <Smile className="w-2.5 h-2.5 text-primary-foreground" />}
                </div>
                <input type="checkbox" checked={removeEmojis} onChange={(e) => setRemoveEmojis(e.target.checked)} className="hidden" />
                <span className={`text-xs font-bold ${removeEmojis ? "text-foreground" : "text-muted-foreground"}`}>Emojis</span>
              </label>

              <label className="flex items-center gap-2.5 p-2.5 bg-muted border border-border rounded-xl cursor-pointer hover:bg-accent transition-all select-none group">
                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${trimLines ? "bg-primary border-primary" : "bg-card border-muted-foreground/30"}`}>
                  {trimLines && <Minimize2 className="w-2.5 h-2.5 text-primary-foreground" />}
                </div>
                <input type="checkbox" checked={trimLines} onChange={(e) => setTrimLines(e.target.checked)} className="hidden" />
                <span className={`text-xs font-bold ${trimLines ? "text-foreground" : "text-muted-foreground"}`}>Trim Lines</span>
              </label>
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border p-6 space-y-3 shadow-sm">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={loadSample} className="w-full h-12 bg-muted border-border text-muted-foreground hover:bg-accent text-xs font-bold uppercase tracking-widest justify-start px-3">
                <Sparkles className="w-3.5 h-3.5 text-primary mr-2" />
                Sample
              </Button>
              <Button onClick={handleDownload} disabled={!cleanedText} variant="outline" className="w-full h-12 bg-primary/5 border-primary/20 text-primary hover:bg-primary/10 text-xs font-bold uppercase tracking-widest justify-start px-3">
                <Download className="w-3.5 h-3.5 mr-2" />
                Save
              </Button>
              <Button variant="ghost" onClick={handleClear} disabled={!inputText && !cleanedText} className="w-full h-12 text-red-600 hover:text-red-700 hover:bg-red-50 text-xs font-bold uppercase tracking-widest justify-start px-3 col-span-2">
                <Trash2 className="w-3.5 h-3.5 mr-2" />
                Clear All
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[500px]">
            <div className="bg-card rounded-[2rem] border border-border shadow-sm overflow-hidden flex flex-col group/input relative h-full">
              <div className="flex items-center justify-between p-6 border-b border-border bg-muted/30">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-muted flex items-center justify-center">
                    <Eraser className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-foreground uppercase tracking-tight">Messy Text</h2>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Before Cleaning</p>
                  </div>
                </div>
              </div>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste your messy text here to clean it..."
                className="w-full h-full p-8 bg-transparent font-mono text-sm leading-relaxed resize-none outline-none placeholder:text-muted-foreground custom-scrollbar selection:bg-primary/10 text-foreground"
              />
            </div>

            <div className="bg-card rounded-[2rem] border border-border shadow-sm overflow-hidden flex flex-col group/output relative h-full">
              <div className="flex items-center justify-between p-6 border-b border-border bg-muted/30">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-primary/5 flex items-center justify-center border border-primary/10 shadow-sm">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-foreground uppercase tracking-tight">Clean Result</h2>
                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Ready to use</p>
                  </div>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-primary/5 border border-primary/10 text-[10px] font-bold text-primary uppercase tracking-widest">
                  Auto-Clean Enabled
                </div>
              </div>
              <div className="relative flex-1 p-8 overflow-auto custom-scrollbar">
                {cleanedText ? (
                  <pre className="font-mono text-sm leading-relaxed text-foreground whitespace-pre-wrap font-medium">{cleanedText}</pre>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center opacity-30 select-none">
                    <Eraser className="w-12 h-12 text-muted-foreground mb-4" />
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">No cleaned content yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {cleanedText && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-card p-4 rounded-xl border border-border shadow-sm flex flex-col items-center justify-center gap-1">
                <span className="text-xl font-bold text-foreground tracking-tight">{cleanedText.length.toLocaleString()}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Chars</span>
              </div>
              <div className="bg-card p-4 rounded-xl border border-border shadow-sm flex flex-col items-center justify-center gap-1">
                <span className="text-xl font-bold text-foreground tracking-tight">{cleanedText.split(/\s+/).filter((w) => w).length.toLocaleString()}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Words</span>
              </div>
              <div className="bg-card p-4 rounded-xl border border-border shadow-sm flex flex-col items-center justify-center gap-1">
                <span className="text-xl font-bold text-foreground tracking-tight">{inputText.length - cleanedText.length}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Removed</span>
              </div>
              <div className="bg-card p-4 rounded-xl border border-border shadow-sm flex flex-col items-center justify-center gap-1">
                <span className="text-xl font-bold text-green-600 tracking-tight">{Math.round((1 - cleanedText.length / (inputText.length || 1)) * 100)}%</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Reduction</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
