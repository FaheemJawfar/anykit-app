"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  Search,
  RefreshCw,
  Cpu,
  Monitor,
  HardDrive
} from "lucide-react";
import { cn } from "@/lib/utils";
import ouiData from "oui-data";

export default function MACAddressTool() {
  const [input, setInput] = useState("");
  const [vendor, setVendor] = useState<string | null>(null);
  const [generatedMac, setGeneratedMac] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const generateMac = () => {
    const hex = "0123456789ABCDEF";
    let mac = "";
    for (let i = 0; i < 6; i++) {
      mac += hex.charAt(Math.floor(Math.random() * 16));
      mac += hex.charAt(Math.floor(Math.random() * 16));
      if (i < 5) mac += ":";
    }
    setGeneratedMac(mac);
    setInput(mac);
  };

  useEffect(() => {
    if (!input.trim()) {
      setVendor(null);
      return;
    }

    const clean = input.replace(/[:.-]/g, "").toUpperCase();
    if (clean.length >= 6) {
      const oui = clean.substring(0, 6);
      const result = (ouiData as any)[oui];
      setVendor(result || "Unknown Vendor");
    } else {
      setVendor(null);
    }
  }, [input]);

  const copy = (val: string, id: string) => {
    navigator.clipboard.writeText(val);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
          <Monitor className="w-6 h-6" />
        </div>
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight">MAC Address Tool</h1>
          <p className="text-sm text-muted-foreground">
            Generate random MAC addresses and lookup manufacturer (OUI) information.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Editor Side */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 space-y-8">
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Input or Lookup</Label>
                  <div className="relative">
                    <Input 
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="e.g. 00:1A:2B:3C:4D:5E"
                      className="h-16 px-6 rounded-2xl bg-muted/30 border-border/40 font-mono text-xl focus:ring-primary/20"
                    />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setInput("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                <div className="pt-4 flex flex-col gap-4">
                  <Button 
                    onClick={generateMac}
                    className="w-full h-14 rounded-2xl text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                  >
                    <RefreshCw className="w-5 h-5 mr-2" />
                    Generate Random MAC
                  </Button>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-4">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  <h3 className="font-bold text-xs uppercase tracking-wider text-primary">Lookup Info</h3>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  The first 3 bytes (6 hex digits) of a MAC address are the <strong>OUI</strong> (Organizationally Unique Identifier) which identifies the manufacturer.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Output Side */}
        <div className="lg:col-span-7 h-full">
          {vendor ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
                <div className="px-8 py-6 border-b border-border/40 bg-primary/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Cpu className="w-4 h-4 text-primary" />
                    <span className="text-xs font-bold uppercase tracking-widest text-primary">Manufacturer Details</span>
                  </div>
                </div>
                <CardContent className="p-8 space-y-8 text-center">
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Organization Name</p>
                    <h3 className={cn(
                      "text-3xl font-black tracking-tight",
                      vendor === "Unknown Vendor" ? "text-muted-foreground" : "text-foreground"
                    )}>
                      {vendor}
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="p-4 rounded-2xl bg-muted/30 border border-border/40">
                      <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest mb-1">OUI Prefix</p>
                      <p className="text-xl font-mono font-bold text-primary">
                        {input.replace(/[:.-]/g, "").substring(0, 6).toUpperCase()}
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-muted/30 border border-border/40 flex flex-col justify-center">
                      <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest mb-1">Status</p>
                      <div className="flex items-center justify-center gap-2">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          vendor === "Unknown Vendor" ? "bg-orange-500" : "bg-green-500"
                        )} />
                        <span className="text-sm font-bold">{vendor === "Unknown Vendor" ? "Unidentified" : "Identified"}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-3xl bg-card border border-border/40 shadow-sm flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                      <Copy className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase text-muted-foreground">Colon Format</p>
                      <p className="text-xs font-mono font-bold">{input.replace(/[:.-]/g, "").replace(/(.{2})(?=.)/g, "$1:").toUpperCase()}</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => copy(input.replace(/[:.-]/g, "").replace(/(.{2})(?=.)/g, "$1:").toUpperCase(), 'colon')}
                    className="h-10 w-10 rounded-xl"
                  >
                    {copied === 'colon' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>

                <div className="p-4 rounded-3xl bg-card border border-border/40 shadow-sm flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                      <Copy className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase text-muted-foreground">Dash Format</p>
                      <p className="text-xs font-mono font-bold">{input.replace(/[:.-]/g, "").replace(/(.{2})(?=.)/g, "$1-").toUpperCase()}</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => copy(input.replace(/[:.-]/g, "").replace(/(.{2})(?=.)/g, "$1-").toUpperCase(), 'dash')}
                    className="h-10 w-10 rounded-xl"
                  >
                    {copied === 'dash' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-6 bg-muted/20 rounded-[2.5rem] border border-dashed border-border/40 min-h-[400px]">
              <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center">
                <Network className="w-10 h-10 text-muted-foreground/30" />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-lg">Waiting for Input</h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                  Enter a MAC address or generate a random one to see its manufacturer.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
