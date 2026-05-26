"use client";

import { ToolLayout } from "@/components/tool-layout";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Type, 
  Copy, 
  Check, 
  Trash2,
  Zap,
  Info,
  ExternalLink,
  Hash,
  RefreshCw,
  Search
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function NumeronymGenerator() {
  const [input, setInput] = useState("accessibility");
  const [copied, setCopied] = useState(false);

  const generateNumeronym = (word: string) => {
    const trimmed = word.trim();
    if (trimmed.length <= 2) return trimmed;
    const first = trimmed[0];
    const last = trimmed[trimmed.length - 1];
    const count = trimmed.length - 2;
    return `${first}${count}${last}`;
  };

  const result = generateNumeronym(input);

  const copyToClipboard = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const commonNumeronyms = [
    { word: "accessibility", num: "a11y" },
    { word: "internationalization", num: "i18n" },
    { word: "localization", num: "l10n" },
    { word: "kubernetes", num: "k8s" },
  ];

  return (
    <ToolLayout toolId="numeronym">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Editor Side */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 space-y-8">
              <div className="space-y-4">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Original Word</Label>
                <div className="relative">
                  <Input 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter a long word..."
                    className="h-16 px-6 rounded-2xl bg-muted/30 border-border/40 font-bold text-2xl focus:ring-primary/20"
                  />
                  {input && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setInput("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  )}
                </div>
              </div>

              <div className="pt-6 border-t border-border/40">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-4 h-4 text-primary" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Common Examples</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {commonNumeronyms.map((item) => (
                    <Button
                      key={item.num}
                      variant="outline"
                      size="sm"
                      onClick={() => setInput(item.word)}
                      className="rounded-xl h-10 font-bold border-border/40 hover:bg-primary/5 transition-all flex justify-between px-4"
                    >
                      <span className="text-[10px] truncate mr-2">{item.word}</span>
                      <span className="text-primary font-mono text-xs">{item.num}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-4">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-primary">What is a Numeronym?</h3>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed italic">
              A numeronym is a number-based word. Most commonly, it replaces the letters between the first and last characters with the count of omitted letters.
            </p>
          </div>
        </div>

        {/* Output Side */}
        <div className="lg:col-span-7 h-full">
          <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col h-full min-h-[400px]">
            <div className="px-8 py-6 border-b border-border/40 bg-primary/5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <Hash className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-primary">Generated Numeronym</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyToClipboard}
                disabled={!result}
                className={cn(
                  "rounded-xl font-bold px-4 hover:bg-primary/10 transition-all",
                  copied && "text-green-500 hover:text-green-500"
                )}
              >
                {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied ? "Copied" : "Copy Result"}
              </Button>
            </div>
            <CardContent className="p-0 flex-1 flex flex-col items-center justify-center bg-primary/[0.01]">
              <div className="relative group">
                <div className="absolute -inset-8 bg-primary/20 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity" />
                <span className="text-8xl md:text-[10rem] font-black tracking-tighter relative">
                  {result || "..."}
                </span>
              </div>
              
              <div className="mt-12 flex items-center gap-6">
                <div className="flex flex-col items-center">
                  <span className="text-xl font-black text-primary/40">{input[0] || "?"}</span>
                  <span className="text-[8px] font-bold uppercase text-muted-foreground mt-1">Start</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xl font-black text-primary/40">{input.length > 2 ? input.length - 2 : "0"}</span>
                  <span className="text-[8px] font-bold uppercase text-muted-foreground mt-1">Count</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xl font-black text-primary/40">{input[input.length - 1] || "?"}</span>
                  <span className="text-[8px] font-bold uppercase text-muted-foreground mt-1">End</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
