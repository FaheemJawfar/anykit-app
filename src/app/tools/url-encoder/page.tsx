"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Copy, 
  Check, 
  ArrowLeftRight, 
  Link as LinkIcon, 
  Unlock, 
  Eraser, 
  RefreshCcw,
  Zap,
  Info,
  Globe
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function UrlEncoder() {
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
        setOutput(encodeURIComponent(val));
      } else {
        setOutput(decodeURIComponent(val));
      }
      setError(null);
    } catch (e) {
      if (currentMode === "decode") {
        setError("Invalid URL-encoded string");
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
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
          <LinkIcon className="w-6 h-6" />
        </div>
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight">URL Encoder/Decoder</h1>
          <p className="text-sm text-muted-foreground">
            Convert URLs and parameters safely between formats.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-center gap-4">
          <div className="p-1 bg-muted/50 rounded-2xl border border-border/50 flex gap-1">
            <Button
              variant={mode === "encode" ? "default" : "ghost"}
              className={cn("rounded-xl px-6", mode === "encode" && "shadow-lg shadow-primary/20")}
              onClick={() => setMode("encode")}
            >
              <LinkIcon className="w-4 h-4 mr-2" />
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
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2rem] overflow-hidden">
            <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Input URL</span>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:text-red-500" onClick={() => setInput("")}>
                <Eraser className="w-3.5 h-3.5" />
              </Button>
            </div>
            <CardContent className="p-0">
              <Textarea
                placeholder={mode === "encode" ? "Enter raw URL or text..." : "Enter encoded URL component..."}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[350px] p-6 bg-transparent border-none focus-visible:ring-0 resize-none font-mono text-sm leading-relaxed"
              />
            </CardContent>
          </Card>

          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2rem] overflow-hidden group">
            <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Result</span>
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
                placeholder="Transformation will appear here..."
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
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="font-bold">What is URL Encoding?</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">It's a mechanism for encoding information in a Uniform Resource Identifier (URI) by replacing "unsafe" characters with a "%" followed by two hexadecimal digits.</p>
          </div>
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mx-auto md:mx-0">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold">Safe Transmissions</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">Characters like spaces, ampersands, and equal signs have special meanings in URLs. Encoding ensures they are transmitted correctly as data.</p>
          </div>
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mx-auto md:mx-0">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
            <h3 className="font-bold">Iterative Cycles</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">Use the swap button to instantly move your decoded result back to the input field for further encoding, or vice versa.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

