"use client";

import { ToolLayout } from "@/components/tool-layout";

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
  Info,
  Clock,
  History,
  ArrowDown01
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ulid } from "ulid";

export default function ULIDGenerator() {
  const [count, setCount] = useState(5);
  const [ids, setIds] = useState<string[]>([]);
  const [copied, setCopied] = useState<number | null>(null);

  const generateIds = () => {
    const newIds = Array.from({ length: count }, () => ulid());
    setIds(newIds);
  };

  useEffect(() => {
    generateIds();
  }, [count]);

  const copy = (val: string, index: number) => {
    navigator.clipboard.writeText(val);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(ids.join("\n"));
    setCopied(-1);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <ToolLayout toolId="ulid-generator">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Configuration Panel */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 space-y-8">
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <Settings2 className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Generation Settings</span>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-center px-1">
                    <Label className="text-sm font-bold">Batch Size</Label>
                    <span className="text-xs font-mono font-bold text-primary">{count} IDs</span>
                  </div>
                  <Slider 
                    value={[count]} 
                    onValueChange={([v]) => setCount(v)} 
                    max={50} 
                    min={1} 
                    step={1}
                    className="py-4"
                  />
                </div>
              </div>

              <Button 
                onClick={generateIds}
                className="w-full h-14 rounded-2xl text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Regenerate
              </Button>
            </CardContent>
          </Card>

          <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-4">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-primary">Why ULID?</h3>
            </div>
            <div className="space-y-3 text-[11px] text-muted-foreground leading-relaxed">
              <p><strong>Lexicographically Sortable:</strong> Unlike UUIDs, ULIDs can be sorted chronologically.</p>
              <p><strong>URL Safe:</strong> Uses Crockford's Base32 (no special characters).</p>
              <p><strong>Timestamped:</strong> The first 10 characters encode the timestamp in milliseconds.</p>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col h-full min-h-[500px]">
            <div className="px-8 py-6 border-b border-border/40 bg-primary/5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-primary">Generated ULIDs</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyAll}
                disabled={ids.length === 0}
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
                {ids.map((id, i) => (
                  <div 
                    key={i}
                    className="group flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/40 hover:bg-muted/50 hover:border-primary/20 transition-all animate-in fade-in slide-in-from-bottom-2"
                    style={{ animationDelay: `${i * 30}ms` }}
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-background flex items-center justify-center text-[10px] font-bold text-muted-foreground shadow-inner shrink-0">
                        {i + 1}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-mono text-sm font-bold break-all tracking-wider">{id}</span>
                        <span className="text-[9px] text-muted-foreground/60 font-mono mt-0.5">
                          Timestamp: {id.substring(0, 10)} | Random: {id.substring(10)}
                        </span>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => copy(id, i)}
                      className="h-10 w-10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                    >
                      {copied === i ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
