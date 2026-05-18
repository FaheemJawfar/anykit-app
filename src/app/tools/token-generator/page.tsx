"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { 
  ShieldCheck, 
  Copy, 
  Check, 
  RefreshCw,
  Zap,
  Lock,
  Settings2,
  Fingerprint,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function TokenGenerator() {
  const [length, setLength] = useState(32);
  const [count, setCount] = useState(1);
  const [type, setType] = useState<"alphanumeric" | "hex" | "base64" | "base32">("alphanumeric");
  const [tokens, setTokens] = useState<string[]>([]);
  const [copied, setCopied] = useState<number | null>(null);

  const generateTokens = () => {
    const newTokens = [];
    const charset = {
      alphanumeric: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
      hex: "0123456789abcdef",
      base64: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
      base32: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"
    };

    const currentCharset = charset[type];

    for (let i = 0; i < count; i++) {
      let token = "";
      const array = new Uint32Array(length);
      window.crypto.getRandomValues(array);
      
      for (let j = 0; j < length; j++) {
        token += currentCharset[array[j] % currentCharset.length];
      }
      newTokens.push(token);
    }
    setTokens(newTokens);
  };

  useEffect(() => {
    generateTokens();
  }, [length, count, type]);

  const copy = (val: string, index: number) => {
    navigator.clipboard.writeText(val);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(tokens.join("\n"));
    setCopied(-1);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
          <Fingerprint className="w-6 h-6" />
        </div>
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight">Secure Token Generator</h1>
          <p className="text-sm text-muted-foreground">
            Generate cryptographically secure random tokens for API keys, secrets, or IDs.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Configuration Panel */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 space-y-8">
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <Settings2 className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Token Config</span>
                </div>

                <div className="space-y-4">
                  <Label className="text-sm font-bold">Encoding Type</Label>
                  <div className="grid grid-cols-2 gap-2 p-1 bg-muted/50 rounded-2xl border border-border/40">
                    {(["alphanumeric", "hex", "base64", "base32"] as const).map((t) => (
                      <Button
                        key={t}
                        variant={type === t ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setType(t)}
                        className={cn(
                          "rounded-xl font-bold h-10 text-[10px] uppercase tracking-wider",
                          type === t && "shadow-md"
                        )}
                      >
                        {t}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-center px-1">
                    <Label className="text-sm font-bold">Token Length</Label>
                    <span className="text-xs font-mono font-bold text-primary">{length} chars</span>
                  </div>
                  <Slider 
                    value={[length]} 
                    onValueChange={([v]) => setLength(v)} 
                    max={128} 
                    min={4} 
                    step={4}
                    className="py-4"
                  />
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-center px-1">
                    <Label className="text-sm font-bold">Batch Size</Label>
                    <span className="text-xs font-mono font-bold text-primary">{count} tokens</span>
                  </div>
                  <Slider 
                    value={[count]} 
                    onValueChange={([v]) => setCount(v)} 
                    max={20} 
                    min={1} 
                    step={1}
                    className="py-4"
                  />
                </div>
              </div>

              <Button 
                onClick={generateTokens}
                className="w-full h-14 rounded-2xl text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Regenerate
              </Button>
            </CardContent>
          </Card>

          <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-primary">Security Standard</h3>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Tokens are generated using <strong>window.crypto.getRandomValues()</strong>, providing cryptographically strong random values suitable for security-sensitive applications.
            </p>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col h-full min-h-[500px]">
            <div className="px-8 py-6 border-b border-border/40 bg-primary/5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-primary">Secure Output</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyAll}
                disabled={tokens.length === 0}
                className={cn(
                  "rounded-xl font-bold px-4 hover:bg-primary/10 transition-all",
                  copied === -1 && "text-green-500 hover:text-green-500"
                )}
              >
                {copied === -1 ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied === -1 ? "All Copied" : "Copy All"}
              </Button>
            </div>
            <CardContent className="p-8 flex-1 overflow-auto bg-primary/[0.01]">
              <div className="space-y-3">
                {tokens.map((token, i) => (
                  <div 
                    key={i}
                    className="group flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/40 hover:bg-muted/50 hover:border-primary/20 transition-all animate-in fade-in slide-in-from-bottom-2"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-background flex items-center justify-center text-[10px] font-bold text-muted-foreground shadow-inner shrink-0">
                        {i + 1}
                      </div>
                      <span className="font-mono text-sm font-bold break-all">{token}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => copy(token, i)}
                      className="h-10 w-10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {copied === i ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center gap-3 p-4 px-6 bg-muted/30 rounded-2xl border border-border/40">
            <Info className="w-4 h-4 text-muted-foreground" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Total Entropy: {Math.floor(length * Math.log2(type === 'alphanumeric' ? 62 : type === 'hex' ? 16 : type === 'base64' ? 64 : 32))} bits per token
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
