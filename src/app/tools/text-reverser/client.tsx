"use client";

import { useState, useEffect } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import {
  ArrowLeftRight,
  Copy,
  Trash2,
  Check,
  Type,
  RotateCcw,
  Settings2,
  AlignJustify,
  FlipHorizontal,
  AlignHorizontalJustifyCenter,
  Sparkles,
  Download,
} from "lucide-react";

export default function TextReverser() {
  const [inputText, setInputText] = useState("");
  const [reversedText, setReversedText] = useState("");
  const [copied, setCopied] = useState(false);
  const [copiedTimeout, setCopiedTimeout] = useState<NodeJS.Timeout | null>(null);
  const [reverseMode, setReverseMode] = useState("text");

  const handleReverse = () => {
    if (!inputText) {
      setReversedText("");
      return;
    }

    let result = "";
    switch (reverseMode) {
      case "text":
        result = inputText.split("").reverse().join("");
        break;
      case "words":
        result = inputText
          .split(" ")
          .map((word) => word.split("").reverse().join(""))
          .join(" ");
        break;
      case "word_order":
        result = inputText.split(/\s+/).reverse().join(" ");
        break;
      case "lines":
        result = inputText.split("\n").reverse().join("\n");
        break;
      default:
        result = inputText.split("").reverse().join("");
    }
    setReversedText(result);
    setCopied(false);
  };

  useEffect(() => {
    handleReverse();
  }, [inputText, reverseMode]);

  const handleCopy = () => {
    navigator.clipboard.writeText(reversedText);
    setCopied(true);
    if (copiedTimeout) clearTimeout(copiedTimeout);
    setCopiedTimeout(setTimeout(() => setCopied(false), 2000));
  };

  const handleClear = () => {
    setInputText("");
    setReversedText("");
    setCopied(false);
  };

  const handleDownload = () => {
    if (!reversedText) return;
    const blob = new Blob([reversedText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `reversed-text.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const loadSample = () => {
    setInputText("Hello World\nQuick brown fox\n123 456\nLine one\nLine two");
  };

  return (
    <ToolLayout toolId="text-reverser">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-4 lg:order-last space-y-6">
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <Button
              onClick={handleCopy}
              disabled={!reversedText}
              className="w-full h-12 shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest text-xs rounded-xl"
            >
              <Copy className="w-4 h-4 mr-2" />
              {copied ? "Copied!" : "Copy Result"}
            </Button>
          </div>

          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wide flex items-center gap-2">
              <Settings2 className="w-4 h-4" />
              Reverse Mode
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <label
                className={`flex flex-col gap-2 p-3 border rounded-xl cursor-pointer transition-all ${
                  reverseMode === "text" ? "bg-primary/5 border-primary/20 shadow-sm" : "bg-card border-border hover:bg-accent"
                }`}
              >
                <input type="radio" value="text" checked={reverseMode === "text"} onChange={(e) => setReverseMode(e.target.value)} className="hidden" />
                <div className="flex items-center justify-between mb-1">
                  <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${reverseMode === "text" ? "border-primary" : "border-muted-foreground/30"}`}>
                    {reverseMode === "text" && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                  </div>
                  <Type className={`w-3.5 h-3.5 ${reverseMode === "text" ? "text-primary" : "text-muted-foreground"}`} />
                </div>
                <div>
                  <span className="text-xs font-bold block leading-tight">Reverse Text</span>
                  <p className="text-[9px] text-muted-foreground font-mono mt-1 opacity-70">apple → elppa</p>
                </div>
              </label>

              <label
                className={`flex flex-col gap-2 p-3 border rounded-xl cursor-pointer transition-all ${
                  reverseMode === "words" ? "bg-primary/5 border-primary/20 shadow-sm" : "bg-card border-border hover:bg-accent"
                }`}
              >
                <input type="radio" value="words" checked={reverseMode === "words"} onChange={(e) => setReverseMode(e.target.value)} className="hidden" />
                <div className="flex items-center justify-between mb-1">
                  <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${reverseMode === "words" ? "border-primary" : "border-muted-foreground/30"}`}>
                    {reverseMode === "words" && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                  </div>
                  <FlipHorizontal className={`w-3.5 h-3.5 ${reverseMode === "words" ? "text-primary" : "text-muted-foreground"}`} />
                </div>
                <div>
                  <span className="text-xs font-bold block leading-tight">Reverse Letters</span>
                  <p className="text-[9px] text-muted-foreground font-mono mt-1 opacity-70">abc der → cba red</p>
                </div>
              </label>

              <label
                className={`flex flex-col gap-2 p-3 border rounded-xl cursor-pointer transition-all ${
                  reverseMode === "word_order" ? "bg-primary/5 border-primary/20 shadow-sm" : "bg-card border-border hover:bg-accent"
                }`}
              >
                <input type="radio" value="word_order" checked={reverseMode === "word_order"} onChange={(e) => setReverseMode(e.target.value)} className="hidden" />
                <div className="flex items-center justify-between mb-1">
                  <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${reverseMode === "word_order" ? "border-primary" : "border-muted-foreground/30"}`}>
                    {reverseMode === "word_order" && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                  </div>
                  <AlignHorizontalJustifyCenter className={`w-3.5 h-3.5 ${reverseMode === "word_order" ? "text-primary" : "text-muted-foreground"}`} />
                </div>
                <div>
                  <span className="text-xs font-bold block leading-tight">Word Order</span>
                  <p className="text-[9px] text-muted-foreground font-mono mt-1 opacity-70">a b c → c b a</p>
                </div>
              </label>

              <label
                className={`flex flex-col gap-2 p-3 border rounded-xl cursor-pointer transition-all ${
                  reverseMode === "lines" ? "bg-primary/5 border-primary/20 shadow-sm" : "bg-card border-border hover:bg-accent"
                }`}
              >
                <input type="radio" value="lines" checked={reverseMode === "lines"} onChange={(e) => setReverseMode(e.target.value)} className="hidden" />
                <div className="flex items-center justify-between mb-1">
                  <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${reverseMode === "lines" ? "border-primary" : "border-muted-foreground/30"}`}>
                    {reverseMode === "lines" && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                  </div>
                  <AlignJustify className={`w-3.5 h-3.5 ${reverseMode === "lines" ? "text-primary" : "text-muted-foreground"}`} />
                </div>
                <div>
                  <span className="text-xs font-bold block leading-tight">Reverse Lines</span>
                  <p className="text-[9px] text-muted-foreground font-mono mt-1 opacity-70">L1 L2 → L2 L1</p>
                </div>
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
              <Button onClick={handleDownload} disabled={!reversedText} variant="outline" className="w-full h-12 bg-primary/5 border-primary/20 text-primary hover:bg-primary/10 text-xs font-bold uppercase tracking-widest justify-start px-3">
                <Download className="w-3.5 h-3.5 mr-2" />
                Save
              </Button>
              <Button variant="ghost" onClick={handleClear} disabled={!inputText && !reversedText} className="w-full h-12 text-red-600 hover:text-red-700 hover:bg-red-50 text-xs font-bold uppercase tracking-widest justify-start px-3 col-span-2">
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
                    <Type className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-foreground uppercase tracking-tight">Original Text</h2>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Type or paste content</p>
                  </div>
                </div>
              </div>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type text here..."
                className="w-full h-full p-6 bg-transparent font-mono text-sm leading-relaxed resize-none outline-none placeholder:text-muted-foreground custom-scrollbar selection:bg-primary/10 text-foreground"
              />
            </div>

            <div className="bg-card rounded-[2rem] border border-border shadow-sm overflow-hidden flex flex-col group/output relative h-full">
              <div className="flex items-center justify-between p-6 border-b border-border bg-muted/30">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-primary/5 flex items-center justify-center border border-primary/10 shadow-sm">
                    <RotateCcw className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-foreground uppercase tracking-tight">Reversed Result</h2>
                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Auto-updates</p>
                  </div>
                </div>
              </div>
              <div className="relative flex-1 p-8 overflow-auto custom-scrollbar">
                {reversedText ? (
                  <p className="font-mono text-sm leading-relaxed text-foreground whitespace-pre-wrap font-medium break-words">{reversedText}</p>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center opacity-30 select-none">
                    <RotateCcw className="w-12 h-12 text-muted-foreground mb-4" />
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Waiting for input...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
