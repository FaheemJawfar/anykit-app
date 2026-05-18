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
  Settings2,
  Zap,
  Info,
  Globe,
  Lock,
  Server,
  Activity,
  Shield,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Address4 } from "ip-address";

export default function SubnetCalculator() {
  const [ip, setIp] = useState("192.168.1.1");
  const [mask, setMask] = useState("24");
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const calculate = (ipAddr: string, cidr: string) => {
    setError(null);
    try {
      const address = new Address4(`${ipAddr}/${cidr}`);
      
      const startAddress = address.startAddress();
      const endAddress = address.endAddress();
      const numHosts = (address as any).numAddresses();
      
      setResults({
        network: startAddress.address,
        broadcast: endAddress.address,
        firstHost: address.startAddress().address, // This logic might need refinement for actual usable hosts
        lastHost: address.endAddress().address,
        mask: address.mask(),
        cidr: address.subnetMask,
        hosts: numHosts.toLocaleString(),
        wildcard: address.wildcardMask(),
        binary: address.binaryZeroPad(),
      });
    } catch (e: any) {
      setError("Invalid IP address or CIDR mask");
      setResults(null);
    }
  };

  useEffect(() => {
    calculate(ip, mask);
  }, [ip, mask]);

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
          <p className="text-sm font-mono font-bold">{value}</p>
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
          <h1 className="text-2xl font-bold tracking-tight">IPv4 Subnet Calculator</h1>
          <p className="text-sm text-muted-foreground">
            Plan your network by calculating CIDR, masks, and usable host ranges.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Panel */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Settings2 className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Network Config</span>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">IP Address</Label>
                  <Input 
                    value={ip} 
                    onChange={(e) => setIp(e.target.value)}
                    placeholder="192.168.1.1"
                    className="h-14 rounded-xl bg-muted/30 border-border/40 font-mono text-lg focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">CIDR Mask (/{mask})</Label>
                  <Input 
                    type="number"
                    min="0"
                    max="32"
                    value={mask} 
                    onChange={(e) => setMask(e.target.value)}
                    className="h-14 rounded-xl bg-muted/30 border-border/40 font-mono text-lg focus:ring-primary/20"
                  />
                </div>
              </div>

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
              <h3 className="font-bold text-xs uppercase tracking-wider text-primary">CIDR Tips</h3>
            </div>
            <div className="space-y-2 text-[11px] text-muted-foreground">
              <p><strong>/24:</strong> Common home network (254 hosts)</p>
              <p><strong>/32:</strong> Single host IP</p>
              <p><strong>/8:</strong> Large Class A network</p>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-8 space-y-6">
          {results ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ResultRow label="Network Address" value={results.network} id="net" icon={Globe} />
                <ResultRow label="Broadcast Address" value={results.broadcast} id="broad" icon={Zap} />
                <ResultRow label="Subnet Mask" value={results.mask} id="mask" icon={Lock} />
                <ResultRow label="Wildcard Mask" value={results.wildcard} id="wild" icon={Shield} />
              </div>

              <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
                <div className="px-8 py-4 border-b border-border/40 bg-primary/5 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-primary">Usable Host Range</span>
                  <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                    {results.hosts} Addresses
                  </div>
                </div>
                <CardContent className="p-8">
                  <div className="flex items-center justify-between gap-8">
                    <div className="text-center flex-1">
                      <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest mb-1">First Host</p>
                      <p className="text-2xl font-mono font-bold text-foreground">{results.firstHost}</p>
                    </div>
                    <ArrowRight className="w-6 h-6 text-muted-foreground/30" />
                    <div className="text-center flex-1">
                      <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest mb-1">Last Host</p>
                      <p className="text-2xl font-mono font-bold text-foreground">{results.lastHost}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
                <div className="px-8 py-4 border-b border-border/40 bg-muted/30">
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Binary Representation</span>
                </div>
                <CardContent className="p-6">
                  <div className="p-4 rounded-xl bg-muted/20 font-mono text-[11px] break-all leading-relaxed text-center tracking-widest">
                    {results.binary.match(/.{1,8}/g).join('.')}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-6 bg-muted/20 rounded-[2.5rem] border border-dashed border-border/40 min-h-[500px]">
              <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center">
                <Server className="w-10 h-10 text-muted-foreground/30" />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-lg">Network Map Waiting</h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                  Enter a valid IPv4 address and subnet mask to generate the network map.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
