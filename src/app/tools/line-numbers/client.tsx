"use client";

import { useState, useEffect } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import {
  ListOrdered,
  Copy,
  Trash2,
  Check,
  List,
  Settings2,
  Hash,
  AlignLeft,
  Sparkles,
  Download,
} from "lucide-react";

export default function LineNumbers() {
  const [inputText, setInputText] = useState("");
  const [resultText, setResultText] = useState("");
  const [copied, setCopied] = useState(false);
  const [copiedTimeout, setCopiedTimeout] = useState<NodeJS.Timeout | null>(null);
  const [startFrom, setStartFrom] = useState(1);
  const [separator, setSeparator] = useState(".");
  const [mode, setMode] = useState<"add" | "remove">("add");

  const handleAddNumbers = () => {
    if (!inputText) {
      setResultText("");
      return;
    }
    const lines = inputText.split("\n");
    const numbered = lines.map((line, index) => {
      const number = startFrom + index;
      let sepChar = "";
      if (separator === "none") sepChar = "";
      else sepChar = separator;
      return `${number}${sepChar} ${line}`;
    });
    setResultText(numbered.join("\n"));
    setCopied(false);
    setMode("add");
  };

  const handleRemoveNumbers = () => {
    if (!inputText) {
      setResultText("");
      return;
    }
    const lines = inputText.split("\n");
    const regex = /^\d+[\.\)\:\-]?\s?/;
    const removed = lines.map((line) => line.replace(regex, ""));
    setResultText(removed.join("\n"));
    setCopied(false);
    setMode("remove");
  };

  useEffect(() => {
    if (!inputText) {
      setResultText("");
      return;
    }
    if (mode === "add") {
      handleAddNumbers();
    } else {
      handleRemoveNumbers();
    }
  }, [inputText, startFrom, separator, mode]);

  const handleCopy = () => {
    navigator.clipboard.writeText(resultText);
    setCopied(true);
    if (copiedTimeout) clearTimeout(copiedTimeout);
    setCopiedTimeout(setTimeout(() => setCopied(false), 2000));
  };

  const handleClear = () => {
    setInputText("");
    setResultText("");
    setCopied(false);
    setStartFrom(1);
  };

  const handleDownload = () => {
    if (!resultText) return;
    const blob = new Blob([resultText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `line-numbers.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const loadSample = () => {
    setInputText("Apple\nBanana\nCherry\n1. Already numbered\n2) Another numbered\n- List item\n3: Third numbered");
  };

  return (
    <ToolLayout toolId="line-numbers">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-4 lg:order-last space-y-6">
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <Button
              onClick={handleAddNumbers}
              disabled={!inputText}
              className="w-full h-12 shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest text-xs rounded-xl"
            >
              <ListOrdered className="w-4 h-4 mr-2" />
              Add
            </Button>
            <Button
              variant="outline"
              onClick={handleRemoveNumbers}
              disabled={!inputText}
              className="w-full h-12 border-2 border-border hover:bg-accent text-foreground font-bold uppercase tracking-widest text-xs rounded-xl"
            >
              <List className="w-4 h-4 mr-2" />
              Remove
            </Button>
          </div>

          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wide flex items-center gap-2">
              <Settings2 className="w-4 h-4" />
              Configuration
            </h3>

            <div className="space-y-3">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center justify-between">
                <span>Start Numbering At</span>
                <span className="text-primary bg-primary/5 px-1.5 py-0.5 rounded text-xs">{startFrom}</span>
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={startFrom}
                  onChange={(e) => setStartFrom(parseInt(e.target.value) || 0)}
                  className="flex-1 h-2 bg-primary/30 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <input
                  type="number"
                  value={startFrom}
                  onChange={(e) => setStartFrom(parseInt(e.target.value) || 0)}
                  className="w-16 px-2 py-1 text-center text-sm font-bold border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <Settings2 className="w-3 h-3" />
                Separator Style
              </label>
              <div className="grid grid-cols-2 gap-2">
                <label className={`flex items-center gap-2 p-2.5 border rounded-xl cursor-pointer transition-all ${separator === "." ? "bg-primary/5 border-primary/20 shadow-sm" : "bg-card border-border hover:bg-accent"}`}>
                  <input type="radio" value="." checked={separator === "."} onChange={(e) => setSeparator(e.target.value)} className="hidden" />
                  <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${separator === "." ? "border-primary" : "border-muted-foreground/30"}`}>
                    {separator === "." && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                  </div>
                  <span className={`text-xs font-bold ${separator === "." ? "text-foreground" : "text-muted-foreground"}`}>1. Item</span>
                </label>

                <label className={`flex items-center gap-2 p-2.5 border rounded-xl cursor-pointer transition-all ${separator === ")" ? "bg-primary/5 border-primary/20 shadow-sm" : "bg-card border-border hover:bg-accent"}`}>
                  <input type="radio" value=")" checked={separator === ")"} onChange={(e) => setSeparator(e.target.value)} className="hidden" />
                  <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${separator === ")" ? "border-primary" : "border-muted-foreground/30"}`}>
                    {separator === ")" && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                  </div>
                  <span className={`text-xs font-bold ${separator === ")" ? "text-foreground" : "text-muted-foreground"}`}>1) Item</span>
                </label>

                <label className={`flex items-center gap-2 p-2.5 border rounded-xl cursor-pointer transition-all ${separator === ":" ? "bg-primary/5 border-primary/20 shadow-sm" : "bg-card border-border hover:bg-accent"}`}>
                  <input type="radio" value=":" checked={separator === ":"} onChange={(e) => setSeparator(e.target.value)} className="hidden" />
                  <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${separator === ":" ? "border-primary" : "border-muted-foreground/30"}`}>
                    {separator === ":" && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                  </div>
                  <span className={`text-xs font-bold ${separator === ":" ? "text-foreground" : "text-muted-foreground"}`}>1: Item</span>
                </label>

                <label className={`flex items-center gap-2 p-2.5 border rounded-xl cursor-pointer transition-all ${separator === "none" ? "bg-primary/5 border-primary/20 shadow-sm" : "bg-card border-border hover:bg-accent"}`}>
                  <input type="radio" value="none" checked={separator === "none"} onChange={(e) => setSeparator(e.target.value)} className="hidden" />
                  <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${separator === "none" ? "border-primary" : "border-muted-foreground/30"}`}>
                    {separator === "none" && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                  </div>
                  <span className={`text-xs font-bold ${separator === "none" ? "text-foreground" : "text-muted-foreground"}`}>1 None</span>
                </label>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border p-6 space-y-3 shadow-sm">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={loadSample} className="w-full h-12 bg-muted border-border text-muted-foreground hover:bg-accent text-xs font-bold uppercase tracking-widest justify-start px-3">
                <Sparkles className="w-3.5 h-3.5 text-primary mr-2" />
                Sample
              </Button>
              <Button onClick={handleDownload} disabled={!resultText} variant="outline" className="w-full h-12 bg-primary/5 border-primary/20 text-primary hover:bg-primary/10 text-xs font-bold uppercase tracking-widest justify-start px-3">
                <Download className="w-3.5 h-3.5 mr-2" />
                Save
              </Button>
              <Button variant="ghost" onClick={handleClear} disabled={!inputText && !resultText} className="w-full h-12 text-red-600 hover:text-red-700 hover:bg-red-50 text-xs font-bold uppercase tracking-widest justify-start px-3 col-span-2">
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
                    <AlignLeft className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-foreground uppercase tracking-tight">Input List</h2>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Content to process</p>
                  </div>
                </div>
              </div>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter list items here (one per line)..."
                className="w-full h-full p-6 bg-transparent font-mono text-sm leading-relaxed resize-none outline-none placeholder:text-muted-foreground custom-scrollbar selection:bg-primary/10 text-foreground"
              />
            </div>

            <div className="bg-card rounded-[2rem] border border-border shadow-sm overflow-hidden flex flex-col group/output relative h-full">
              <div className="flex items-center justify-between p-6 border-b border-border bg-muted/30">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-primary/5 flex items-center justify-center border border-primary/10 shadow-sm">
                    <ListOrdered className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-foreground uppercase tracking-tight">Result</h2>
                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Processed List</p>
                  </div>
                </div>
                <Button
                  onClick={handleCopy}
                  disabled={!resultText}
                  size="sm"
                  variant="ghost"
                  className="text-primary hover:text-primary/80 hover:bg-primary/5 h-8 px-3 rounded-lg text-xs font-bold uppercase tracking-widest"
                >
                  {copied ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
              </div>
              <div className="relative flex-1 p-6 overflow-auto custom-scrollbar">
                {resultText ? (
                  <textarea
                    value={resultText}
                    readOnly
                    className="w-full h-full bg-transparent font-mono text-sm leading-relaxed text-foreground resize-none outline-none custom-scrollbar"
                  />
                ) : (
                  <div className="h-full flex flex-col items-center justify-center opacity-30 select-none">
                    <ListOrdered className="w-12 h-12 text-muted-foreground mb-4" />
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Waiting for processing...</p>
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
