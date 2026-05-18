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
  RefreshCw,
  Zap,
  Info,
  Globe,
  Lock,
  Server,
  Activity,
  ShieldCheck,
  Binary
} from "lucide-react";
import { cn } from "@/lib/utils";
import CryptoJS from "crypto-js";

export default function IPv6ULAGenerator() {
  const [prefix, setPrefix] = useState("");
  const [globalId, setGlobalId] = useState("");
  const [subnetId, setSubnetId] = useState("0000");
  const [copied, setCopied] = useState(false);

  const generateULA = () => {
    // RFC 4193 ULA generation
    // 1. Prefix: fd00::/8 (actually L bit is 1, so fd)
    // 2. Global ID: 40 random bits
    // 3. Subnet ID: 16 bits
    
    const randomBits = CryptoJS.lib.WordArray.random(5).toString(); // 40 bits = 5 bytes = 10 hex chars
    const global = randomBits.substring(0, 10).toLowerCase();
    const formattedGlobal = `${global.substring(0, 4)}:${global.substring(4, 8)}:${global.substring(8, 10)}`;
    
    setGlobalId(global);
    setPrefix(`fd${global.substring(0, 2)}:${global.substring(2, 6)}:${global.substring(6, 10)}`);
  };

  useEffect(() => {
    generateULA();
  }, []);

  const fullAddress = `${prefix}:${subnetId}::/64`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
          <Globe className="w-6 h-6" />
        </div>
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight">IPv6 ULA Generator</h1>
          <p className="text-sm text-muted-foreground">
            Generate Unique Local Addresses (ULA) for private IPv6 networks according to RFC 4193.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Generator Side */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 space-y-8">
              <div className="space-y-6">
                <div className="p-6 rounded-3xl bg-muted/30 border border-border/40 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Global ID (40 bits)</span>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-[10px] font-bold text-green-600 uppercase">Random</span>
                    </div>
                  </div>
                  <p className="text-3xl font-mono font-bold text-foreground/80 tracking-widest">
                    {globalId || "...."}
                  </p>
                </div>

                <div className="space-y-4">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Subnet ID (16 bits)</Label>
                  <Input 
                    value={subnetId}
                    onChange={(e) => setSubnetId(e.target.value.substring(0, 4).replace(/[^0-9a-fA-F]/g, ""))}
                    placeholder="0000"
                    className="h-14 px-6 rounded-2xl bg-muted/30 border-border/40 font-mono text-xl focus:ring-primary/20"
                    maxLength={4}
                  />
                </div>
              </div>

              <Button 
                onClick={generateULA}
                className="w-full h-14 rounded-2xl text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Regenerate Global ID
              </Button>
            </CardContent>
          </Card>

          <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-primary">RFC 4193 Standard</h3>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Unique Local Addresses are intended for local communications. They are not routable on the global internet but are globally unique to minimize conflicts during site merges.
            </p>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-7 h-full">
          <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col h-full min-h-[400px]">
            <div className="px-8 py-6 border-b border-border/40 bg-primary/5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-primary">Generated Prefix</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyToClipboard}
                className={cn(
                  "rounded-xl font-bold px-4 hover:bg-primary/10 transition-all",
                  copied && "text-green-500 hover:text-green-500"
                )}
              >
                {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied ? "Copied" : "Copy Prefix"}
              </Button>
            </div>
            <CardContent className="p-0 flex-1 relative bg-primary/[0.01] flex flex-col items-center justify-center space-y-8">
              <div className="space-y-4 text-center px-8">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">IPv6 ULA /64 Prefix</p>
                <div className="p-8 rounded-[2rem] bg-background border border-border/40 shadow-inner group transition-all hover:border-primary/20">
                  <span className="text-3xl md:text-5xl font-black font-mono tracking-tighter text-primary">
                    {fullAddress}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-8 w-full">
                {[
                  { label: "L Bit", val: "1", color: "bg-blue-500" },
                  { label: "Prefix", val: "fd", color: "bg-purple-500" },
                  { label: "Global ID", val: globalId, color: "bg-green-500" },
                  { label: "Subnet", val: subnetId, color: "bg-orange-500" }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-muted/20 border border-border/10">
                    <div className={cn("w-2 h-2 rounded-full", item.color)} />
                    <span className="text-[8px] font-black uppercase text-muted-foreground">{item.label}</span>
                    <span className="text-xs font-mono font-bold truncate w-full text-center">{item.val}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 p-6 rounded-3xl bg-muted/20 border border-border/40 flex items-center gap-6">
            <div className="w-12 h-12 rounded-2xl bg-background flex items-center justify-center text-muted-foreground/30 shadow-inner shrink-0">
              <Binary className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Uniqueness</h3>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                By using a 40-bit random global ID, the probability of two organizations having the same ULA prefix is extremely low (approximately 1 in 1 trillion).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
