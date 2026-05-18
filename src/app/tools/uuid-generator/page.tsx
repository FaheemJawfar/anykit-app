"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Fingerprint, 
  Copy, 
  Check, 
  RefreshCw, 
  Eraser, 
  Download, 
  List, 
  ShieldCheck,
  Settings2,
  Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function UuidGenerator() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(10);
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const generateUUID = () => {
    // Cryptographically secure UUID v4
    const array = new Uint8Array(16);
    window.crypto.getRandomValues(array);
    array[6] = (array[6] & 0x0f) | 0x40; // Version 4
    array[8] = (array[8] & 0x3f) | 0x80; // Variant 10xx
    
    const hex = Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
  };

  const generateBulk = useCallback(() => {
    const newUuids = Array.from({ length: Math.min(count, 500) }, () => generateUUID());
    setUuids(newUuids);
  }, [count]);

  useEffect(() => {
    generateBulk();
  }, []);

  const copyAll = () => {
    if (uuids.length === 0) return;
    navigator.clipboard.writeText(uuids.join("\n"));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const copySingle = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(index);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const downloadTxt = () => {
    if (uuids.length === 0) return;
    const blob = new Blob([uuids.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `anykit-uuids-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
          <Fingerprint className="w-6 h-6" />
        </div>
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight">UUID Generator</h1>
          <p className="text-sm text-muted-foreground">
            Generate cryptographically secure Version 4 UUIDs in bulk.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-3xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Configuration</span>
            </div>
            <CardContent className="p-8 space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Quantity</Label>
                  <span className="text-xl font-mono font-bold text-primary">{count}</span>
                </div>
                <Input 
                  type="number" 
                  min={1} 
                  max={500} 
                  value={count} 
                  onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                  className="h-12 px-4 rounded-xl bg-muted/30 border-transparent focus:border-primary/20 text-lg font-mono" 
                />
                <p className="text-[10px] text-muted-foreground leading-relaxed italic">
                  * Generate up to 500 secure UUIDs at once.
                </p>
              </div>

              <div className="space-y-3">
                <Button 
                  onClick={generateBulk}
                  className="w-full h-14 rounded-2xl text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Generate New List
                </Button>
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    onClick={copyAll}
                    disabled={uuids.length === 0}
                    className={cn(
                      "h-12 rounded-xl border-border/50 font-bold transition-all",
                      copiedAll && "text-green-500 border-green-500/20 bg-green-500/5"
                    )}
                  >
                    {copiedAll ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                    Copy All
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={downloadTxt}
                    disabled={uuids.length === 0}
                    className="h-12 rounded-xl border-border/50 font-bold"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
                <Button 
                  variant="ghost" 
                  className="w-full h-11 rounded-xl text-muted-foreground hover:text-red-500 transition-all font-bold"
                  onClick={() => setUuids([])}
                  disabled={uuids.length === 0}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="bg-primary/5 rounded-3xl p-6 border border-primary/10 space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-primary">Security Note</h3>
            </div>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              These UUIDs are generated using the <strong>window.crypto</strong> API, ensuring they are suitable for high-security applications and unique identifier needs.
            </p>
          </div>
        </div>

        <div className="lg:col-span-8">
          <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/30 backdrop-blur-sm rounded-[2.5rem] overflow-hidden min-h-[600px]">
            <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <List className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Generated List</span>
              </div>
              <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                {uuids.length} entries
              </div>
            </div>
            <CardContent className="p-0">
              {uuids.length > 0 ? (
                <div className="divide-y divide-border/40">
                  {uuids.map((uuid, i) => (
                    <div 
                      key={i} 
                      className="group flex items-center justify-between px-8 py-4 hover:bg-primary/[0.02] transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] font-mono text-muted-foreground/40 w-6">{i + 1}</span>
                        <span className="text-sm font-mono font-medium tracking-tight group-hover:text-primary transition-colors">
                          {uuid}
                        </span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className={cn(
                          "h-8 w-8 rounded-lg transition-all opacity-0 group-hover:opacity-100",
                          copiedId === i && "opacity-100 text-green-500 bg-green-500/5"
                        )}
                        onClick={() => copySingle(uuid, i)}
                      >
                        {copiedId === i ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[500px] text-center space-y-4 opacity-20">
                  <Fingerprint className="w-20 h-24" />
                  <p className="text-lg font-bold">List is empty</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

