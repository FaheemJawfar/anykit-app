"use client";

import { ToolLayout } from "@/components/tool-layout";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Network, 
  Copy, 
  Check, 
  Trash2,
  Zap,
  Info,
  Globe,
  Maximize2,
  ArrowRight,
  Activity,
  ListOrdered
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Address4 } from "ip-address";

export default function IPRangeExpander() {
  const [input, setInput] = useState("192.168.1.0/24");
  const [results, setResults] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const expandRange = () => {
    setError(null);
    setResults([]);
    
    if (!input.trim()) return;

    try {
      if (input.includes('/')) {
        // CIDR notation
        const address = new Address4(input);
        const hosts = [];
        const start = address.startAddress();
        const end = address.endAddress();
        
        // Limit to prevent browser crash (max 1000 hosts)
        const numAddresses = Number((address as any).numAddresses());
        if (numAddresses > 2048) {
          throw new Error("Range too large. Max 2048 addresses for expansion.");
        }

        // Generate addresses
        let current = address.startAddress();
        for (let i = 0; i < numAddresses; i++) {
          hosts.push(current.address);
          // @ts-ignore - ip-address has some internal methods
          const next = current.nextAddress();
          if (!next) break;
          current = next;
        }
        setResults(hosts);
      } else if (input.includes('-')) {
        // Range notation (e.g. 192.168.1.1-10)
        const [base, range] = input.split('-');
        const parts = base.split('.');
        const start = parseInt(parts[3]);
        const end = parseInt(range);
        
        if (isNaN(start) || isNaN(end) || end < start) throw new Error("Invalid range format.");
        
        const hosts = [];
        for (let i = start; i <= end; i++) {
          hosts.push(`${parts[0]}.${parts[1]}.${parts[2]}.${i}`);
        }
        setResults(hosts);
      } else {
        throw new Error("Please use CIDR (1.1.1.0/24) or Range (1.1.1.1-10) format.");
      }
    } catch (e: any) {
      setError(e.message || "Invalid IP range or CIDR");
    }
  };

  const copyToClipboard = () => {
    if (results.length === 0) return;
    navigator.clipboard.writeText(results.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout toolId="ip-range-expander">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Editor Side */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 space-y-8">
              <div className="space-y-4">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">IP Range / CIDR</Label>
                <div className="relative">
                  <Input 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="e.g. 192.168.1.0/24 or 192.168.1.1-50"
                    className="h-16 px-6 rounded-2xl bg-muted/30 border-border/40 font-mono text-xl focus:ring-primary/20"
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

              <Button 
                onClick={expandRange}
                className="w-full h-14 rounded-2xl text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
              >
                <Zap className="w-5 h-5 mr-2" />
                Expand Range
              </Button>

              {error && (
                <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-bold flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  {error}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-primary">Usage Guide</h3>
            </div>
            <div className="space-y-3 text-[11px] text-muted-foreground leading-relaxed">
              <p><strong>CIDR:</strong> <code>10.0.0.0/29</code> expands to 8 addresses.</p>
              <p><strong>Range:</strong> <code>192.168.0.1-25</code> expands to 25 addresses.</p>
              <p className="italic text-primary/60">Maximum 2048 addresses per expansion for stability.</p>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-7 h-full">
          <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col h-full min-h-[500px]">
            <div className="px-8 py-6 border-b border-border/40 bg-primary/5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <ListOrdered className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-primary">Expanded List</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-primary px-3 py-1 bg-primary/10 rounded-full">
                  {results.length} Hosts
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyToClipboard}
                  disabled={results.length === 0}
                  className={cn(
                    "rounded-xl font-bold px-4 hover:bg-primary/10 transition-all",
                    copied && "text-green-500 hover:text-green-500"
                  )}
                >
                  {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                  {copied ? "Copied" : "Copy List"}
                </Button>
              </div>
            </div>
            <CardContent className="p-0 flex-1 relative bg-primary/[0.01]">
              <div className="p-8 font-mono text-sm leading-relaxed overflow-auto max-h-[600px]">
                {results.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
                    {results.map((ip, i) => (
                      <div key={i} className="flex items-center gap-3 group">
                        <span className="text-[10px] font-bold text-muted-foreground/30 w-8">{i + 1}</span>
                        <span className="text-foreground/80 group-hover:text-primary transition-colors">{ip}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center py-20 text-center opacity-30 gap-4">
                    <Globe className="w-12 h-12" />
                    <p className="italic font-medium">Click expand to generate the list...</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
