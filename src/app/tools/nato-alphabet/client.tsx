"use client";

import { ToolLayout } from "@/components/tool-layout";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { 
  Languages, 
  Copy, 
  Check, 
  Trash2,
  Zap,
  Info,
  ExternalLink,
  RefreshCw,
  Search,
  Globe
} from "lucide-react";
import { cn } from "@/lib/utils";

const NATO_ALPHABET: Record<string, string> = {
  A: "Alfa", B: "Bravo", C: "Charlie", D: "Delta", E: "Echo", F: "Foxtrot",
  G: "Golf", H: "Hotel", I: "India", J: "Juliett", K: "Kilo", L: "Lima",
  M: "Mike", N: "November", O: "Oscar", P: "Papa", Q: "Quebec", R: "Romeo",
  S: "Sierra", T: "Tango", U: "Uniform", V: "Victor", W: "Whiskey", X: "X-ray",
  Y: "Yankee", Z: "Zulu",
  "0": "Zero", "1": "One", "2": "Two", "3": "Three", "4": "Four",
  "5": "Five", "6": "Six", "7": "Seven", "8": "Eight", "9": "Nine",
  " ": "(space)", ".": "Stop"
};

export default function TextToNATO() {
  const [input, setInput] = useState("AnyKit App");
  const [copied, setCopied] = useState(false);

  const convertToNATO = (text: string) => {
    return text
      .toUpperCase()
      .split("")
      .map(char => NATO_ALPHABET[char] || char)
      .join(" ");
  };

  const result = convertToNATO(input);

  const copyToClipboard = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout toolId="nato-alphabet">

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* Editor Side */}
        <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col min-h-[400px]">
          <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <Languages className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Source Text</span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setInput("")} className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          <CardContent className="p-0 flex-1 relative">
            <Textarea
              placeholder="Enter text to spell out..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-full min-h-[300px] p-8 bg-transparent border-none focus-visible:ring-0 resize-none font-sans text-2xl font-bold leading-relaxed"
            />
          </CardContent>
        </Card>

        {/* Output Side */}
        <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col min-h-[400px] relative">
          <div className="px-8 py-6 border-b border-border/40 bg-primary/5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-primary">NATO Phonetic</span>
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
              {copied ? "Copied" : "Copy NATO"}
            </Button>
          </div>
          <CardContent className="p-8 flex-1 overflow-auto bg-primary/[0.01]">
            <div className="flex flex-wrap gap-3">
              {input.toUpperCase().split("").map((char, i) => {
                const phonetic = NATO_ALPHABET[char];
                if (!phonetic && char !== " ") return null;
                return (
                  <div key={i} className={cn(
                    "flex flex-col items-center p-4 rounded-2xl border transition-all animate-in zoom-in-95",
                    phonetic ? "bg-card border-border/40 shadow-sm" : "bg-muted/30 border-transparent opacity-30"
                  )} style={{ animationDelay: `${i * 20}ms` }}>
                    <span className="text-[10px] font-black text-primary/40 uppercase mb-1">{char === " " ? "SPC" : char}</span>
                    <span className="text-sm font-bold text-foreground">{phonetic || "—"}</span>
                  </div>
                );
              })}
              {!input && (
                <div className="w-full h-full flex items-center justify-center py-20 text-muted-foreground italic opacity-50">
                  Phonetic spelling will appear here...
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-4">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-primary" />
          <h3 className="font-bold text-xs uppercase tracking-wider text-primary">Why use this?</h3>
        </div>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          The NATO phonetic alphabet is a spelling alphabet used by pilots, police, and emergency services to ensure clear communication of letters and numbers, especially over noisy radio or telephone connections.
        </p>
      </div>
    </ToolLayout>
  );
}
