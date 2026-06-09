"use client";

import { useState, useEffect } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import {
  Repeat,
  Copy,
  Trash2,
  Check,
  Settings2,
  AlignLeft,
  WrapText,
  Space,
  MoreHorizontal,
  Sparkles,
  Download,
} from "lucide-react";

export default function TextRepeater() {
  const [inputText, setInputText] = useState("");
  const [repeatCount, setRepeatCount] = useState(10);
  const [separator, setSeparator] = useState("newline");
  const [customSeparator, setCustomSeparator] = useState("");
  const [repeatedText, setRepeatedText] = useState("");
  const [copied, setCopied] = useState(false);
  const [copiedTimeout, setCopiedTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleRepeat = () => {
    if (!inputText) {
      setRepeatedText("");
      return;
    }

    let sep = "";
    switch (separator) {
      case "newline":
        sep = "\n";
        break;
      case "space":
        sep = " ";
        break;
      case "comma":
        sep = ", ";
        break;
      case "custom":
        sep = customSeparator;
        break;
    }

    const result = new Array(repeatCount).fill(inputText).join(sep);
    setRepeatedText(result);
    setCopied(false);
  };

  useEffect(() => {
    handleRepeat();
  }, [inputText, repeatCount, separator, customSeparator]);

  const handleCopy = () => {
    navigator.clipboard.writeText(repeatedText);
    setCopied(true);
    if (copiedTimeout) clearTimeout(copiedTimeout);
    setCopiedTimeout(setTimeout(() => setCopied(false), 2000));
  };

  const handleDownload = () => {
    if (!repeatedText) return;
    const blob = new Blob([repeatedText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `repeated-text.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setInputText("");
    setRepeatedText("");
    setCopied(false);
    setRepeatCount(10);
  };

  const loadSample = () => {
    setInputText("Cool! 🚀");
    setRepeatCount(10);
    setSeparator("newline");
  };

  return (
    <ToolLayout toolId="text-repeater">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-4 lg:order-last space-y-6">
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <Button
              onClick={handleCopy}
              disabled={!repeatedText}
              className="w-full h-12 shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest text-xs rounded-xl"
            >
              <Copy className="w-4 h-4 mr-2" />
              {copied ? "Copied!" : "Copy Result"}
            </Button>
          </div>

          <div className="bg-card rounded-2xl border border-border p-6 space-y-6 shadow-sm">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wide flex items-center gap-2">
              <Settings2 className="w-4 h-4" />
              Settings
            </h3>

            <div className="space-y-2.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center justify-between">
                <span>Repetitions</span>
                <span className="text-primary bg-primary/10 px-1.5 py-0.5 rounded-md text-xs font-bold">{repeatCount.toLocaleString()}</span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="1"
                  max="1000"
                  value={repeatCount}
                  onChange={(e) => setRepeatCount(parseInt(e.target.value))}
                  className="flex-1 h-1.5 bg-primary/20 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={repeatCount}
                  onChange={(e) => setRepeatCount(Math.min(10000, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="w-16 px-1.5 py-1 text-center text-xs font-bold border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-card shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <Settings2 className="w-3 h-3" />
                Separator
              </label>
              <div className="grid grid-cols-2 gap-2">
                <label className={`flex items-center gap-2.5 p-2.5 bg-card border border-border rounded-xl cursor-pointer hover:bg-accent transition-all select-none group ${separator === "newline" ? "bg-primary/5 border-primary/20 shadow-sm" : ""}`}>
                  <input type="radio" value="newline" checked={separator === "newline"} onChange={(e) => setSeparator(e.target.value)} className="hidden" />
                  <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center transition-colors ${separator === "newline" ? "border-primary" : "border-muted-foreground/30"}`}>
                    {separator === "newline" && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                  </div>
                  <WrapText className={`w-3.5 h-3.5 ${separator === "newline" ? "text-primary" : "text-muted-foreground"}`} />
                  <span className={`text-xs font-bold ${separator === "newline" ? "text-foreground" : "text-muted-foreground"}`}>New Line</span>
                </label>

                <label className={`flex items-center gap-2.5 p-2.5 bg-card border border-border rounded-xl cursor-pointer hover:bg-accent transition-all select-none group ${separator === "space" ? "bg-primary/5 border-primary/20 shadow-sm" : ""}`}>
                  <input type="radio" value="space" checked={separator === "space"} onChange={(e) => setSeparator(e.target.value)} className="hidden" />
                  <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center transition-colors ${separator === "space" ? "border-primary" : "border-muted-foreground/30"}`}>
                    {separator === "space" && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                  </div>
                  <Space className={`w-3.5 h-3.5 ${separator === "space" ? "text-primary" : "text-muted-foreground"}`} />
                  <span className={`text-xs font-bold ${separator === "space" ? "text-foreground" : "text-muted-foreground"}`}>Space</span>
                </label>

                <label className={`flex items-center gap-2.5 p-2.5 bg-card border border-border rounded-xl cursor-pointer hover:bg-accent transition-all select-none group ${separator === "comma" ? "bg-primary/5 border-primary/20 shadow-sm" : ""}`}>
                  <input type="radio" value="comma" checked={separator === "comma"} onChange={(e) => setSeparator(e.target.value)} className="hidden" />
                  <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center transition-colors ${separator === "comma" ? "border-primary" : "border-muted-foreground/30"}`}>
                    {separator === "comma" && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                  </div>
                  <span className={`text-sm leading-none font-bold ${separator === "comma" ? "text-primary" : "text-muted-foreground"}`}>,</span>
                  <span className={`text-xs font-bold ${separator === "comma" ? "text-foreground" : "text-muted-foreground"}`}>Comma</span>
                </label>

                <label className={`flex items-center gap-2.5 p-2.5 bg-card border border-border rounded-xl cursor-pointer hover:bg-accent transition-all select-none group ${separator === "custom" ? "bg-primary/5 border-primary/20 shadow-sm" : ""}`}>
                  <input type="radio" value="custom" checked={separator === "custom"} onChange={(e) => setSeparator(e.target.value)} className="hidden" />
                  <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center transition-colors ${separator === "custom" ? "border-primary" : "border-muted-foreground/30"}`}>
                    {separator === "custom" && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                  </div>
                  <MoreHorizontal className={`w-3.5 h-3.5 ${separator === "custom" ? "text-primary" : "text-muted-foreground"}`} />
                  <span className={`text-xs font-bold ${separator === "custom" ? "text-foreground" : "text-muted-foreground"}`}>Custom</span>
                </label>

                {separator === "custom" && (
                  <div className="col-span-2 mt-1">
                    <input
                      type="text"
                      placeholder="Custom Separator..."
                      value={customSeparator}
                      onChange={(e) => setCustomSeparator(e.target.value)}
                      className="w-full px-3 py-2 bg-muted border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-xs font-medium transition-all"
                    />
                  </div>
                )}
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
              <Button onClick={handleDownload} disabled={!repeatedText} variant="outline" className="w-full h-12 bg-primary/5 border-primary/20 text-primary hover:bg-primary/10 text-xs font-bold uppercase tracking-widest justify-start px-3">
                <Download className="w-3.5 h-3.5 mr-2" />
                Save
              </Button>
              <Button variant="ghost" onClick={handleClear} disabled={!inputText && !repeatedText} className="w-full h-12 text-red-600 hover:text-red-700 hover:bg-red-50 text-xs font-bold uppercase tracking-widest justify-start px-3 col-span-2">
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
                    <h2 className="text-sm font-bold text-foreground uppercase tracking-tight">Source Text</h2>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Content to repeat</p>
                  </div>
                </div>
              </div>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type text to repeat..."
                className="w-full h-full p-6 bg-transparent font-mono text-sm leading-relaxed resize-none outline-none placeholder:text-muted-foreground custom-scrollbar selection:bg-primary/10 text-foreground"
              />
            </div>

            <div className="bg-card rounded-[2rem] border border-border shadow-sm overflow-hidden flex flex-col group/output relative h-full">
              <div className="flex items-center justify-between p-6 border-b border-border bg-muted/30">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-primary/5 flex items-center justify-center border border-primary/10 shadow-sm">
                    <Repeat className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-foreground uppercase tracking-tight">Repeated Result</h2>
                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Total Length: {repeatedText.length.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <div className="relative flex-1 p-8 overflow-auto custom-scrollbar">
                {repeatedText ? (
                  <p className="font-mono text-sm leading-relaxed text-foreground font-medium break-words whitespace-pre-wrap">{repeatedText}</p>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center opacity-30 select-none">
                    <Repeat className="w-12 h-12 text-muted-foreground mb-4" />
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">No repeated text yet</p>
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
