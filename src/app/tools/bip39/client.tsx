"use client";

import { ToolLayout } from "@/components/tool-layout";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { 
  Key, 
  Copy, 
  Check, 
  RefreshCw,
  Zap,
  Lock,
  Settings2,
  Fingerprint,
  Info,
  ShieldCheck,
  Building,
  Coins,
  History
} from "lucide-react";
import { cn } from "@/lib/utils";
import * as bip39 from "bip39";

export default function BIP39Generator() {
  const [entropy, setEntropy] = useState<128 | 160 | 192 | 224 | 256>(128);
  const [mnemonic, setMnemonic] = useState("");
  const [seed, setSeed] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const generateMnemonic = async () => {
    const newMnemonic = bip39.generateMnemonic(entropy);
    setMnemonic(newMnemonic);
    const newSeed = await bip39.mnemonicToSeed(newMnemonic);
    setSeed(newSeed.toString('hex'));
  };

  useEffect(() => {
    generateMnemonic();
  }, [entropy]);

  const copy = (val: string, id: string) => {
    navigator.clipboard.writeText(val);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <ToolLayout toolId="bip39">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Configuration Panel */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 space-y-8">
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <Settings2 className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Phrase Settings</span>
                </div>

                <div className="space-y-4">
                  <Label className="text-sm font-bold">Number of Words</Label>
                  <div className="grid grid-cols-3 gap-2 p-1 bg-muted/50 rounded-xl border border-border/40">
                    {[
                      { label: "12 Words", val: 128 },
                      { label: "15 Words", val: 160 },
                      { label: "18 Words", val: 192 },
                      { label: "21 Words", val: 224 },
                      { label: "24 Words", val: 256 }
                    ].map((opt) => (
                      <Button
                        key={opt.val}
                        variant={entropy === opt.val ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setEntropy(opt.val as any)}
                        className={cn(
                          "rounded-lg text-[10px] font-bold h-9",
                          entropy === opt.val && "shadow-md"
                        )}
                      >
                        {opt.label.split(' ')[0]}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <Button 
                onClick={generateMnemonic}
                className="w-full h-14 rounded-2xl text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Generate New Phrase
              </Button>
            </CardContent>
          </Card>

          <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-primary">Security Standard</h3>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed italic">
              BIP39 describes the implementation of a mnemonic sentence—a group of easy-to-remember words—for the generation of deterministic wallets.
            </p>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-8 space-y-8">
          <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col h-full min-h-[400px]">
            <div className="px-8 py-6 border-b border-border/40 bg-primary/5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <Lock className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-primary">Mnemonic Phrase</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copy(mnemonic, 'mnemonic')}
                className={cn(
                  "rounded-xl font-bold px-4 hover:bg-primary/10 transition-all",
                  copied === 'mnemonic' && "text-green-500 hover:text-green-500"
                )}
              >
                {copied === 'mnemonic' ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied === 'mnemonic' ? "Copied" : "Copy Phrase"}
              </Button>
            </div>
            <CardContent className="p-8 flex-1 overflow-auto bg-primary/[0.01]">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {mnemonic.split(' ').map((word, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-card border border-border/40 shadow-sm animate-in zoom-in-95" style={{ animationDelay: `${i * 30}ms` }}>
                    <span className="text-[10px] font-bold text-muted-foreground/50 w-4">{i + 1}</span>
                    <span className="font-mono text-sm font-bold text-foreground">{word}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <div className="px-8 py-4 border-b border-border/40 bg-muted/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Deterministic Seed (HEX)</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => copy(seed, 'seed')} className="h-8 rounded-xl font-bold">
                {copied === 'seed' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <CardContent className="p-6">
              <pre className="text-[10px] font-mono text-muted-foreground break-all whitespace-pre-wrap leading-relaxed max-h-[100px] overflow-auto">
                {seed}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
