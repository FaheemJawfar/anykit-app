"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Building, 
  Copy, 
  Check, 
  Trash2,
  Zap,
  Info,
  ShieldCheck,
  ShieldAlert,
  Globe,
  Search,
  Landmark
} from "lucide-react";
import { cn } from "@/lib/utils";
import * as ibantools from "ibantools";

export default function IBANValidator() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const clean = input.replace(/\s/g, "");
    if (!clean) {
      setResult(null);
      return;
    }

    const isValid = ibantools.validateIBAN(clean);
    if (isValid.valid) {
      const parts = ibantools.extractIBAN(clean);
      setResult({
        isValid: true,
        country: parts?.countryCode,
        bban: (parts as any)?.bban || (parts as any)?.ban || "",
        formatted: ibantools.friendlyFormatIBAN(clean)
      });
    } else {
      setResult({
        isValid: false,
        error: isValid.errorCodes?.[0] || "Invalid IBAN format"
      });
    }
  }, [input]);

  const copyToClipboard = () => {
    if (!result?.formatted) return;
    navigator.clipboard.writeText(result.formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
          <Landmark className="w-6 h-6" />
        </div>
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight">IBAN Validator & Parser</h1>
          <p className="text-sm text-muted-foreground">
            Validate and parse International Bank Account Numbers for global transfers.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Editor Side */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 space-y-8">
              <div className="space-y-4">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Input IBAN</Label>
                <div className="relative">
                  <Input 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="e.g. DE89 3704 0044 0532..."
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

              <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 space-y-2">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-primary" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Verification Logic</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Validates IBAN structure, length, and checksum according to the ISO 13616 standard.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Output Side */}
        <div className="lg:col-span-7 h-full">
          {result ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className={cn(
                "p-8 rounded-[2.5rem] border-2 flex items-center gap-6",
                result.isValid ? "bg-green-500/10 border-green-500/30 text-green-600" : "bg-destructive/10 border-destructive/30 text-destructive"
              )}>
                <div className={cn(
                  "w-16 h-16 rounded-3xl flex items-center justify-center shrink-0 shadow-lg",
                  result.isValid ? "bg-green-500 text-white" : "bg-destructive text-white"
                )}>
                  {result.isValid ? <ShieldCheck className="w-8 h-8" /> : <ShieldAlert className="w-8 h-8" />}
                </div>
                <div>
                  <h3 className="text-2xl font-black tracking-tight">{result.isValid ? "Valid IBAN" : "Invalid IBAN"}</h3>
                  <p className="text-sm font-medium opacity-80">
                    {result.isValid ? "Checksum and structure are correct." : result.error}
                  </p>
                </div>
              </div>

              {result.isValid && (
                <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
                  <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Landmark className="w-4 h-4 text-primary" />
                      <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Account Breakdown</span>
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
                      {copied ? "Copied" : "Copy Formatted"}
                    </Button>
                  </div>
                  <CardContent className="p-8 space-y-8">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Formatted IBAN</p>
                      <p className="text-3xl font-mono font-bold tracking-wider">{result.formatted}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-8 pt-4">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Country</p>
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-primary/40" />
                          <p className="text-lg font-bold">{result.country}</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">BBAN</p>
                        <p className="text-sm font-mono font-bold truncate">{result.bban}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-6 bg-muted/20 rounded-[2.5rem] border border-dashed border-border/40 min-h-[400px]">
              <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center">
                <Search className="w-10 h-10 text-muted-foreground/30" />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-lg">Waiting for Input</h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                  Enter an IBAN to see its validity and account breakdown.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
