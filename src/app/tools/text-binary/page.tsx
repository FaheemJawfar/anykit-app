"use client";

import { ToolLayout } from "@/components/tool-layout";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { 
  Binary, 
  Copy, 
  Check, 
  Trash2,
  Zap,
  ArrowRightLeft,
  FileText,
  RefreshCw,
  Search,
  Type
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function TextBinaryConverter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"text-to-binary" | "binary-to-text">("text-to-binary");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const process = (val: string, currentMode: "text-to-binary" | "binary-to-text") => {
    setInput(val);
    setError(null);
    if (!val.trim()) {
      setOutput("");
      return;
    }

    try {
      if (currentMode === "text-to-binary") {
        const result = val.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
        setOutput(result);
      } else {
        const binaryArr = val.trim().split(/\s+/);
        const result = binaryArr.map(bin => String.fromCharCode(parseInt(bin, 2))).join('');
        if (result.includes('\uFFFD')) throw new Error("Invalid binary format");
        setOutput(result);
      }
    } catch (e) {
      setError("Invalid format for conversion.");
      setOutput("");
    }
  };

  const toggleMode = () => {
    const newMode = mode === "text-to-binary" ? "binary-to-text" : "text-to-binary";
    setMode(newMode);
    if (output) {
      const oldOutput = output;
      setInput(oldOutput);
      process(oldOutput, newMode);
    } else {
      process(input, newMode);
    }
  };

  const copyToClipboard = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout toolId="text-binary">

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch h-full">
        {/* Input Panel */}
        <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col min-h-[500px]">
          <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              {mode === "text-to-binary" ? <Type className="w-4 h-4 text-primary" /> : <Binary className="w-4 h-4 text-primary" />}
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                {mode === "text-to-binary" ? "Plain Text" : "Binary String"}
              </span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => process("", mode)} className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          <CardContent className="p-0 flex-1 relative">
            <Textarea
              placeholder={mode === "text-to-binary" ? "Enter text here..." : "Enter binary here (e.g. 01001000 01101001)"}
              value={input}
              onChange={(e) => process(e.target.value, mode)}
              className="w-full h-full min-h-[400px] p-8 bg-transparent border-none focus-visible:ring-0 resize-none text-lg font-mono leading-relaxed"
            />
          </CardContent>
        </Card>

        {/* Output Panel */}
        <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col min-h-[500px] relative">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden lg:block">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={toggleMode}
              className="w-12 h-12 rounded-full bg-background border-border/40 text-muted-foreground shadow-xl hover:text-primary hover:border-primary/20 transition-all hover:scale-110 active:scale-95"
            >
              <ArrowRightLeft className="w-5 h-5" />
            </Button>
          </div>

          <div className="px-8 py-6 border-b border-border/40 bg-primary/5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              {mode === "text-to-binary" ? <Binary className="w-4 h-4 text-primary" /> : <Type className="w-4 h-4 text-primary" />}
              <span className="text-xs font-bold uppercase tracking-widest text-primary">
                {mode === "text-to-binary" ? "Binary Output" : "Text Output"}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyToClipboard}
              disabled={!output}
              className={cn(
                "rounded-xl font-bold px-4 hover:bg-primary/10 transition-all",
                copied && "text-green-500 hover:text-green-500"
              )}
            >
              {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
              {copied ? "Copied" : "Copy Result"}
            </Button>
          </div>
          <CardContent className="p-0 flex-1 relative">
            {error ? (
              <div className="p-8 h-full bg-destructive/5 text-destructive font-mono text-sm">
                <div className="bg-destructive/10 p-4 rounded-xl border border-destructive/20">
                  {error}
                </div>
              </div>
            ) : (
              <div className="w-full h-full min-h-[400px] p-8 bg-primary/[0.02] text-lg font-mono leading-relaxed break-all whitespace-pre-wrap overflow-auto">
                {output || <span className="text-muted-foreground italic opacity-50">Conversion result will appear here...</span>}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
