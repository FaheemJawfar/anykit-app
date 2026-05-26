"use client";

import { ToolLayout } from "@/components/tool-layout";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Copy, 
  Check, 
  ArrowLeftRight, 
  Lock, 
  Unlock, 
  Eraser, 
  RefreshCcw,
  Zap,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Base64Encoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [isLive, setIsLive] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const process = useCallback((val: string, currentMode: "encode" | "decode") => {
    if (!val.trim()) {
      setOutput("");
      setError(null);
      return;
    }

    try {
      if (currentMode === "encode") {
        setOutput(btoa(val));
      } else {
        setOutput(atob(val));
      }
      setError(null);
    } catch (e) {
      if (currentMode === "decode") {
        setError("Invalid Base64 string for decoding");
      } else {
        setError((e as Error).message);
      }
      setOutput("");
    }
  }, []);

  useEffect(() => {
    if (isLive) {
      process(input, mode);
    }
  }, [input, mode, isLive, process]);

  const handleSwap = () => {
    const newMode = mode === "encode" ? "decode" : "encode";
    setMode(newMode);
    if (output) {
      setInput(output);
    }
  };

  const copyToClipboard = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout toolId="base64-encoder">

      <div className="space-y-6">
        <div className="flex items-center justify-center gap-4">
          <div className="p-1 bg-muted/50 rounded-2xl border border-border/50 flex gap-1">
            <Button
              variant={mode === "encode" ? "default" : "ghost"}
              className={cn("rounded-xl px-6", mode === "encode" && "shadow-lg shadow-primary/20")}
              onClick={() => setMode("encode")}
            >
              <Lock className="w-4 h-4 mr-2" />
              Encode
            </Button>
            <Button
              variant={mode === "decode" ? "default" : "ghost"}
              className={cn("rounded-xl px-6", mode === "decode" && "shadow-lg shadow-primary/20")}
              onClick={() => setMode("decode")}
            >
              <Unlock className="w-4 h-4 mr-2" />
              Decode
            </Button>
          </div>
          
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-xl border-border/50 hover:bg-primary/5 hover:text-primary transition-all"
            onClick={handleSwap}
            title="Swap input and output"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </Button>

          <Button 
            variant="ghost" 
            className={cn(
              "rounded-xl gap-2 font-bold transition-all",
              isLive ? "text-primary bg-primary/5" : "text-muted-foreground"
            )}
            onClick={() => setIsLive(!isLive)}
          >
            <Zap className={cn("w-4 h-4", isLive && "fill-current")} />
            Live {isLive ? "On" : "Off"}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/50 backdrop-blur-sm rounded-[2rem] overflow-hidden">
            <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Input</span>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:text-red-500" onClick={() => setInput("")}>
                <Eraser className="w-3.5 h-3.5" />
              </Button>
            </div>
            <CardContent className="p-0">
              <Textarea
                placeholder={mode === "encode" ? "Type or paste text to encode..." : "Paste Base64 string to decode..."}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[350px] p-6 bg-transparent border-none focus-visible:ring-0 resize-none font-mono text-sm leading-relaxed"
              />
            </CardContent>
          </Card>

          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/50 backdrop-blur-sm rounded-[2rem] overflow-hidden group">
            <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Output</span>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={cn("h-8 rounded-lg font-bold gap-2", copied && "text-green-500")}
                  onClick={copyToClipboard}
                  disabled={!output}
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
              </div>
            </div>
            <CardContent className="p-0 relative">
              <Textarea
                readOnly
                value={output}
                placeholder="Result will appear here..."
                className="min-h-[350px] p-6 bg-transparent border-none focus-visible:ring-0 resize-none font-mono text-sm leading-relaxed"
              />
              {error && (
                <div className="absolute inset-x-0 bottom-0 p-4 bg-red-500/10 border-t border-red-500/20 text-red-500 text-xs font-medium flex items-center gap-2 animate-in slide-in-from-bottom-1">
                  <Info className="w-4 h-4" />
                  {error}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="bg-primary/5 rounded-[2.5rem] p-8 border border-primary/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mx-auto md:mx-0">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-bold">What is Base64?</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">A binary-to-text encoding scheme that represents binary data in an ASCII string format by translating it into a radix-64 representation.</p>
          </div>
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mx-auto md:mx-0">
              <Unlock className="w-5 h-5" />
            </div>
            <h3 className="font-bold">Common Use Cases</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">Encoding images in HTML/CSS, transferring data in URLs, or storing complex data in text-based formats like JSON or XML.</p>
          </div>
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mx-auto md:mx-0">
              <RefreshCcw className="w-5 h-5" />
            </div>
            <h3 className="font-bold">Seamless Swapping</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">Use the swap button to instantly move your output to the input field, allowing for quick iterative encoding and decoding cycles.</p>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}

