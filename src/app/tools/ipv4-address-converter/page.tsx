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
  RefreshCw,
  Search,
  Hash,
  Binary,
  Code
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function IPv4AddressConverter() {
  const [ip, setIp] = useState("192.168.1.1");
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const convertIP = (val: string) => {
    setIp(val);
    setError(null);
    if (!val.trim()) {
      setResults(null);
      return;
    }

    const isValid = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/.test(val.trim());
    if (!isValid) {
      setError("Invalid IPv4 address format.");
      setResults(null);
      return;
    }

    try {
      const parts = val.trim().split('.').map(Number);
      
      // Integer
      const integer = parts.reduce((acc, part, index) => acc + part * 256 ** (3 - index), 0);
      
      // Binary
      const binary = parts.map(p => p.toString(2).padStart(8, '0')).join('.');
      
      // Hexadecimal
      const hex = parts.map(p => p.toString(16).padStart(2, '0')).join('').toUpperCase();
      
      // IPv6 Mapped
      const ipv6Mapped = `0000:0000:0000:0000:0000:ffff:${parts[0].toString(16).padStart(2, '0')}${parts[1].toString(16).padStart(2, '0')}:${parts[2].toString(16).padStart(2, '0')}${parts[3].toString(16).padStart(2, '0')}`;

      setResults({
        integer: integer.toString(),
        binary,
        hex: `0x${hex}`,
        ipv6: ipv6Mapped.toLowerCase()
      });
    } catch (e) {
      setError("Failed to convert IP address.");
      setResults(null);
    }
  };

  useEffect(() => {
    convertIP(ip);
  }, []);

  const copy = (val: string, id: string) => {
    navigator.clipboard.writeText(val);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const ResultRow = ({ label, value, id, icon: Icon }: { label: string, value: string, id: string, icon: any }) => (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/40 group transition-all hover:bg-muted/50">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">{label}</p>
          <p className="text-sm font-mono font-bold break-all">{value}</p>
        </div>
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => copy(value, id)}
        className="opacity-0 group-hover:opacity-100 transition-opacity rounded-lg h-8 w-8"
      >
        {copied === id ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
      </Button>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
          <Network className="w-6 h-6" />
        </div>
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight">IPv4 Address Converter</h1>
          <p className="text-sm text-muted-foreground">
            Convert an IPv4 address into various representations like Integer, Binary, Hex, and IPv6.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Side */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 space-y-8">
              <div className="space-y-4">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">IP Address</Label>
                <div className="relative">
                  <Input 
                    value={ip}
                    onChange={(e) => convertIP(e.target.value)}
                    placeholder="e.g. 127.0.0.1"
                    className="h-16 px-6 rounded-2xl bg-muted/30 border-border/40 font-mono text-xl focus:ring-primary/20"
                  />
                  {ip && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => convertIP("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  )}
                </div>
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-bold flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  {error}
                </div>
              )}

              <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-4">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  <h3 className="font-bold text-xs uppercase tracking-wider text-primary">Conversion Note</h3>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed italic">
                  IPv4 addresses can be represented as a single 32-bit integer, which is often used in networking and database storage for performance.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Output Side */}
        <div className="lg:col-span-7 h-full">
          {results ? (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
              <ResultRow label="Integer (Decimal)" value={results.integer} id="int" icon={Hash} />
              <ResultRow label="Binary" value={results.binary} id="bin" icon={Binary} />
              <ResultRow label="Hexadecimal" value={results.hex} id="hex" icon={Code} />
              <ResultRow label="IPv6 Mapped" value={results.ipv6} id="ipv6" icon={Globe} />
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-6 bg-muted/20 rounded-[2.5rem] border border-dashed border-border/40 min-h-[400px]">
              <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center">
                <Network className="w-10 h-10 text-muted-foreground/30" />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-lg">Waiting for Input</h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                  Enter a valid IPv4 address to see its different numerical representations.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
