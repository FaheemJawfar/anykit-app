"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Mail, 
  Copy, 
  Check, 
  Trash2,
  Zap,
  Info,
  ShieldCheck,
  Search,
  Filter,
  RefreshCw,
  User,
  Globe
} from "lucide-react";
import { cn } from "@/lib/utils";
import { normalizeEmail } from "email-normalizer";

export default function EmailNormalizer() {
  const [input, setInput] = useState("");
  const [normalized, setNormalized] = useState("");
  const [copied, setCopied] = useState(false);

  const handleNormalize = (val: string) => {
    setInput(val);
    if (!val.trim()) {
      setNormalized("");
      return;
    }
    try {
      setNormalized(normalizeEmail({ email: val }));
    } catch (e) {
      setNormalized("");
    }
  };

  const copyToClipboard = () => {
    if (!normalized) return;
    navigator.clipboard.writeText(normalized);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
          <Mail className="w-6 h-6" />
        </div>
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight">Email Normalizer</h1>
          <p className="text-sm text-muted-foreground">
            Clean and normalize email addresses by removing dots and plus-subaddressing for specific providers.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Editor Side */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 space-y-8">
              <div className="space-y-4">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Input Email</Label>
                <div className="relative">
                  <Input 
                    value={input}
                    onChange={(e) => handleNormalize(e.target.value)}
                    placeholder="e.g. john.doe+spam@gmail.com"
                    className="h-16 px-6 rounded-2xl bg-muted/30 border-border/40 font-mono text-xl focus:ring-primary/20"
                  />
                  {input && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleNormalize("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground italic px-1">
                  Works with Gmail, Outlook, Yahoo, and other major providers.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-4">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  <h3 className="font-bold text-xs uppercase tracking-wider text-primary">Normalization Logic</h3>
                </div>
                <ul className="space-y-2 text-[11px] text-muted-foreground leading-relaxed">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1" />
                    <span>Converts to lowercase for case-insensitive comparison.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1" />
                    <span>Removes dots from Gmail addresses (e.g. j.o.h.n → john).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1" />
                    <span>Removes subaddresses (e.g. john+spam → john).</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Output Side */}
        <div className="lg:col-span-7 h-full">
          <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col min-h-[400px]">
            <div className="px-8 py-6 border-b border-border/40 bg-primary/5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-primary">Normalized Result</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyToClipboard}
                disabled={!normalized}
                className={cn(
                  "rounded-xl font-bold px-4 hover:bg-primary/10 transition-all",
                  copied && "text-green-500 hover:text-green-500"
                )}
              >
                {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied ? "Copied" : "Copy Result"}
              </Button>
            </div>
            
            <CardContent className="p-0 flex-1 relative bg-primary/[0.01] flex flex-col items-center justify-center space-y-8">
              {normalized ? (
                <div className="space-y-6 text-center animate-in zoom-in-95 duration-500 w-full px-8">
                  <div className="p-8 rounded-[2rem] bg-background border border-border/40 shadow-inner group transition-all hover:border-primary/20">
                    <span className="text-3xl md:text-4xl font-black tracking-tight text-primary break-all">
                      {normalized}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-muted/20 border border-border/10 flex flex-col items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground/40" />
                      <span className="text-[10px] font-bold uppercase text-muted-foreground">Local Part</span>
                      <span className="text-sm font-mono font-bold">{normalized.split('@')[0]}</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-muted/20 border border-border/10 flex flex-col items-center gap-2">
                      <Globe className="w-4 h-4 text-muted-foreground/40" />
                      <span className="text-[10px] font-bold uppercase text-muted-foreground">Domain</span>
                      <span className="text-sm font-mono font-bold">{normalized.split('@')[1]}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-6 opacity-30">
                  <Search className="w-16 h-16" />
                  <div className="space-y-2">
                    <h3 className="font-bold text-lg">Waiting for Email</h3>
                    <p className="text-sm max-w-xs mx-auto">
                      Enter an email address on the left to see its normalized version.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
