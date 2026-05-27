"use client";

import { ToolLayout } from "@/components/tool-layout";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { 
  Lock, 
  Copy, 
  Check, 
  Trash2,
  Zap,
  Info,
  Eye,
  EyeOff,
  Settings2,
  RefreshCw,
  Hash,
  ShieldEllipsis
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function StringObfuscator() {
  const [input, setInput] = useState("AnyKit App Secret Data 2026");
  const [output, setOutput] = useState("");
  const [config, setConfig] = useState({
    keepFirst: 4,
    keepLast: 4,
    replacementChar: "*",
    keepSpace: true
  });
  const [copied, setCopied] = useState(false);

  const obfuscate = (str: string) => {
    if (!str) return "";
    return str
      .split('')
      .map((char, index, array) => {
        if (config.keepSpace && char === ' ') return char;
        const shouldKeep = index < config.keepFirst || index >= array.length - config.keepLast;
        return shouldKeep ? char : config.replacementChar;
      })
      .join('');
  };

  useEffect(() => {
    setOutput(obfuscate(input));
  }, [input, config]);

  const copyToClipboard = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout toolId="string-obfuscator">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Editor Side */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 space-y-8">
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <Settings2 className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Obfuscation Rules</span>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-center px-1">
                    <Label className="text-sm font-bold">Keep First Characters</Label>
                    <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{config.keepFirst}</span>
                  </div>
                  <Slider 
                    value={[config.keepFirst]} 
                    onValueChange={([v]) => setConfig({...config, keepFirst: v})} 
                    max={20} 
                    min={0} 
                    step={1}
                    className="py-4"
                  />
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-center px-1">
                    <Label className="text-sm font-bold">Keep Last Characters</Label>
                    <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{config.keepLast}</span>
                  </div>
                  <Slider 
                    value={[config.keepLast]} 
                    onValueChange={([v]) => setConfig({...config, keepLast: v})} 
                    max={20} 
                    min={0} 
                    step={1}
                    className="py-4"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 pt-2">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/40 transition-all hover:bg-muted/50">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-bold">Keep Spaces</Label>
                      <p className="text-[10px] text-muted-foreground">Don't mask space characters</p>
                    </div>
                    <Switch 
                      checked={config.keepSpace} 
                      onCheckedChange={(v) => setConfig({...config, keepSpace: v})} 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Mask Character</Label>
                    <div className="grid grid-cols-4 gap-2">
                      {["*", "•", "x", "#"].map((char) => (
                        <Button
                          key={char}
                          variant={config.replacementChar === char ? "default" : "outline"}
                          size="sm"
                          onClick={() => setConfig({...config, replacementChar: char})}
                          className={cn(
                            "rounded-xl h-10 font-bold text-lg",
                            config.replacementChar === char && "shadow-md"
                          )}
                        >
                          {char}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Input/Output Side */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col">
            <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Input Data</span>
              <Button variant="ghost" size="icon" onClick={() => setInput("")} className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <CardContent className="p-8">
              <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter sensitive data here..."
                className="w-full h-24 bg-transparent border-none focus:outline-none resize-none font-mono text-xl font-bold leading-relaxed text-foreground/70"
              />
            </CardContent>
          </Card>

          <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col min-h-[300px]">
            <div className="px-8 py-6 border-b border-border/40 bg-primary/5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-primary">Obfuscated Result</span>
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
            <CardContent className="p-12 flex-1 flex items-center justify-center bg-primary/[0.01]">
              <div className="w-full p-8 rounded-3xl bg-background border border-border/40 shadow-inner group transition-all hover:border-primary/20 text-center">
                <span className="text-3xl md:text-5xl font-black font-mono tracking-wider break-all text-primary">
                  {output || "..."}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
