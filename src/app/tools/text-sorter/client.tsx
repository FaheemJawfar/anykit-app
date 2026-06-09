"use client";

import { useState, useEffect } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import {
  ArrowDownUp,
  Copy,
  Trash2,
  Check,
  ArrowDownAZ,
  ArrowUpAZ,
  Shuffle,
  FileText,
  Wand2,
  Download,
  List,
  ArrowDown,
  Settings2,
} from "lucide-react";

export default function TextSorter() {
  const [inputText, setInputText] = useState("");
  const [sortedText, setSortedText] = useState("");
  const [isDescending, setIsDescending] = useState(false);
  const [isCaseSensitive, setIsCaseSensitive] = useState(false);
  const [removeDuplicates, setRemoveDuplicates] = useState(false);
  const [removeEmptyLines, setRemoveEmptyLines] = useState(true);
  const [copied, setCopied] = useState(false);
  const [copiedTimeout, setCopiedTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleSort = () => {
    if (!inputText) {
      setSortedText("");
      return;
    }

    let lines = inputText.split("\n");

    if (removeEmptyLines) {
      lines = lines.filter((line) => line.trim() !== "");
    }

    if (removeDuplicates) {
      lines = [...new Set(lines)];
    }

    const sortedLines = [...lines].sort((a, b) => {
      if (isCaseSensitive) {
        const comparison = a.localeCompare(b);
        return isDescending ? -comparison : comparison;
      } else {
        const compareA = a.toLowerCase();
        const compareB = b.toLowerCase();
        const comparison = compareA.localeCompare(compareB);
        return isDescending ? -comparison : comparison;
      }
    });

    setSortedText(sortedLines.join("\n"));
    setCopied(false);
  };

  useEffect(() => {
    if (inputText) {
      handleSort();
    }
  }, [isDescending, isCaseSensitive, removeDuplicates, removeEmptyLines]);

  const handleCopy = () => {
    navigator.clipboard.writeText(sortedText);
    setCopied(true);
    if (copiedTimeout) clearTimeout(copiedTimeout);
    setCopiedTimeout(setTimeout(() => setCopied(false), 2000));
  };

  const handleClear = () => {
    setInputText("");
    setSortedText("");
    setCopied(false);
  };

  const handleDownload = () => {
    if (!sortedText) return;
    const blob = new Blob([sortedText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `sorted-text.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const insertSample = () => {
    const sample = `Zebra
Apple
banana
Cherry
Apple
dog
Elephant
fox
  
dog
Giraffe
Kangaroo
Monkey
Newt`;
    setInputText(sample);
  };

  const randomizeLines = () => {
    if (!inputText) return;
    const lines = inputText.split("\n").filter((line) => line.trim() !== "");
    const shuffled = [...lines].sort(() => Math.random() - 0.5);
    setSortedText(shuffled.join("\n"));
  };

  const inputLines = inputText ? inputText.split("\n").length : 0;
  const outputLines = sortedText ? sortedText.split("\n").length : 0;
  const nonEmptyInputLines = inputText.split("\n").filter((l) => l.trim() !== "");
  const uniqueInputLines = new Set(nonEmptyInputLines).size;
  const duplicateCount = nonEmptyInputLines.length - uniqueInputLines;

  return (
    <ToolLayout toolId="text-sorter">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-4 lg:order-last space-y-6">
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <Button
              onClick={handleSort}
              disabled={!inputText.trim()}
              className="w-full h-12 shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest text-xs rounded-xl"
            >
              {isDescending ? (
                <ArrowDownAZ className="w-4 h-4 mr-2" />
              ) : (
                <ArrowUpAZ className="w-4 h-4 mr-2" />
              )}
              Sort Lines
            </Button>
          </div>

          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wide flex items-center gap-2">
              <Settings2 className="w-4 h-4" />
              Sorting Options
            </h3>
            <div className="space-y-3">
              <label className="flex items-center gap-2.5 p-2.5 bg-muted border border-border rounded-xl cursor-pointer hover:bg-accent transition-all select-none group">
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                    isDescending
                      ? "bg-primary border-primary"
                      : "bg-card border-muted-foreground/30"
                  }`}
                >
                  {isDescending && <ArrowDown className="w-2.5 h-2.5 text-primary-foreground" />}
                </div>
                <input
                  type="checkbox"
                  checked={isDescending}
                  onChange={(e) => setIsDescending(e.target.checked)}
                  className="hidden"
                />
                <span className={`text-xs font-bold ${isDescending ? "text-foreground" : "text-muted-foreground"}`}>
                  Descending Order
                </span>
              </label>

              <label className="flex items-center gap-2.5 p-2.5 bg-muted border border-border rounded-xl cursor-pointer hover:bg-accent transition-all select-none group">
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                    isCaseSensitive
                      ? "bg-primary border-primary"
                      : "bg-card border-muted-foreground/30"
                  }`}
                >
                  {isCaseSensitive && <Check className="w-2.5 h-2.5 text-primary-foreground" />}
                </div>
                <input
                  type="checkbox"
                  checked={isCaseSensitive}
                  onChange={(e) => setIsCaseSensitive(e.target.checked)}
                  className="hidden"
                />
                <span className={`text-xs font-bold ${isCaseSensitive ? "text-foreground" : "text-muted-foreground"}`}>
                  Case Sensitive
                </span>
              </label>

              <label className="flex items-center gap-2.5 p-2.5 bg-muted border border-border rounded-xl cursor-pointer hover:bg-accent transition-all select-none group">
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                    removeDuplicates
                      ? "bg-primary border-primary"
                      : "bg-card border-muted-foreground/30"
                  }`}
                >
                  {removeDuplicates && <Trash2 className="w-2.5 h-2.5 text-primary-foreground" />}
                </div>
                <input
                  type="checkbox"
                  checked={removeDuplicates}
                  onChange={(e) => setRemoveDuplicates(e.target.checked)}
                  className="hidden"
                />
                <span className={`text-xs font-bold ${removeDuplicates ? "text-foreground" : "text-muted-foreground"}`}>
                  Remove Duplicates
                </span>
              </label>

              <label className="flex items-center gap-2.5 p-2.5 bg-muted border border-border rounded-xl cursor-pointer hover:bg-accent transition-all select-none group">
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                    removeEmptyLines
                      ? "bg-primary border-primary"
                      : "bg-card border-muted-foreground/30"
                  }`}
                >
                  {removeEmptyLines && <List className="w-2.5 h-2.5 text-primary-foreground" />}
                </div>
                <input
                  type="checkbox"
                  checked={removeEmptyLines}
                  onChange={(e) => setRemoveEmptyLines(e.target.checked)}
                  className="hidden"
                />
                <span className={`text-xs font-bold ${removeEmptyLines ? "text-foreground" : "text-muted-foreground"}`}>
                  Remove Empty Lines
                </span>
              </label>
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border p-6 space-y-3 shadow-sm">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">Actions</h3>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                onClick={randomizeLines}
                disabled={!inputText.trim()}
                className="w-full h-12 bg-muted border-border text-muted-foreground hover:bg-accent p-0 flex flex-col items-center justify-center gap-1"
              >
                <Shuffle className="w-3.5 h-3.5 text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Shuffle</span>
              </Button>
              <Button
                variant="outline"
                onClick={insertSample}
                className="w-full h-12 bg-muted border-border text-muted-foreground hover:bg-accent p-0 flex flex-col items-center justify-center gap-1"
              >
                <Wand2 className="w-3.5 h-3.5 text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Sample</span>
              </Button>
              <Button
                variant="ghost"
                onClick={handleClear}
                disabled={!inputText && !sortedText}
                className="w-full h-12 text-red-600 hover:text-red-700 hover:bg-red-50 p-0 flex flex-col items-center justify-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Clear</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[500px]">
            {/* Input Section */}
            <div className="bg-card rounded-[2rem] border border-border shadow-sm overflow-hidden flex flex-col group/input relative h-full">
              <div className="flex items-center justify-between p-6 border-b border-border bg-muted/30">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-muted flex items-center justify-center">
                    <FileText className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-foreground uppercase tracking-tight">Input Lines</h2>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Unsorted List</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground border border-border px-2 py-1 rounded bg-card">
                    {inputLines} Lines
                  </span>
                </div>
              </div>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter text to sort (one item per line)..."
                className="w-full h-full p-6 bg-transparent font-mono text-sm leading-relaxed resize-none outline-none placeholder:text-muted-foreground custom-scrollbar selection:bg-primary/10 text-foreground"
              />
            </div>

            {/* Output Section */}
            <div className="bg-card rounded-[2rem] border border-border shadow-sm overflow-hidden flex flex-col group/output relative h-full">
              <div className="flex items-center justify-between p-6 border-b border-border bg-muted/30">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-primary/5 flex items-center justify-center border border-primary/10 shadow-sm">
                    <ArrowDownUp className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-foreground uppercase tracking-tight">Sorted Result</h2>
                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Organized List</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    onClick={handleCopy}
                    disabled={!sortedText}
                    size="sm"
                    variant="ghost"
                    className="text-primary hover:text-primary/80 hover:bg-primary/5 h-8 px-3 rounded-lg text-xs font-bold uppercase tracking-widest"
                  >
                    {copied ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                    {copied ? "Copied" : "Copy"}
                  </Button>
                </div>
              </div>

              <div className="relative flex-1 p-6 overflow-auto custom-scrollbar">
                {sortedText ? (
                  <textarea
                    value={sortedText}
                    readOnly
                    className="w-full h-full bg-transparent font-mono text-sm leading-relaxed text-foreground resize-none outline-none custom-scrollbar"
                  />
                ) : (
                  <div className="h-full flex flex-col items-center justify-center opacity-30 select-none">
                    <ArrowDownUp className="w-12 h-12 text-muted-foreground mb-4" />
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">List is empty</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Statistics Summary */}
          {inputText && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-card p-4 rounded-xl border border-border shadow-sm flex flex-col items-center justify-center gap-1">
                <span className="text-xl font-bold text-foreground tracking-tight">{inputLines.toLocaleString()}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total Lines</span>
              </div>
              <div className="bg-card p-4 rounded-xl border border-border shadow-sm flex flex-col items-center justify-center gap-1">
                <span className="text-xl font-bold text-foreground tracking-tight">{uniqueInputLines.toLocaleString()}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Unique</span>
              </div>
              <div className="bg-card p-4 rounded-xl border border-border shadow-sm flex flex-col items-center justify-center gap-1">
                <span className="text-xl font-bold text-foreground tracking-tight">{duplicateCount.toLocaleString()}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Duplicates</span>
              </div>
              <div className="bg-card p-4 rounded-xl border border-border shadow-sm flex flex-col items-center justify-center gap-1">
                <span className="text-xl font-bold text-primary tracking-tight">{outputLines.toLocaleString()}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Result Lines</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
