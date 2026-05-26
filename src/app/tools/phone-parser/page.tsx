"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Phone, 
  Copy, 
  Check, 
  Trash2,
  Zap,
  Info,
  Globe,
  Search,
  Flag,
  MapPin
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ToolLayout } from "@/components/tool-layout";
import { parsePhoneNumber, type PhoneNumber, isValidPhoneNumber } from "libphonenumber-js";

export default function PhoneParser() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (!input.trim()) {
      setResult(null);
      return;
    }

    try {
      if (isValidPhoneNumber(input)) {
        const phoneNumber = parsePhoneNumber(input);
        setResult({
          isValid: true,
          formatted: {
            international: phoneNumber.formatInternational(),
            national: phoneNumber.formatNational(),
            uri: phoneNumber.getURI(),
            e164: phoneNumber.format('E.164')
          },
          details: {
            country: phoneNumber.country,
            countryCallingCode: `+${phoneNumber.countryCallingCode}`,
            number: phoneNumber.number,
            type: phoneNumber.getType() || "Unknown"
          }
        });
      } else {
        setResult({ isValid: false });
      }
    } catch (e) {
      setResult({ isValid: false });
    }
  }, [input]);

  const copy = (val: string, id: string) => {
    navigator.clipboard.writeText(val);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const InfoRow = ({ label, value, id, icon: Icon }: { label: string, value: string, id: string, icon: any }) => (
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
    <ToolLayout toolId="phone-parser">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Editor Side */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 space-y-8">
              <div className="space-y-4">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Phone Number</Label>
                <div className="relative">
                  <Input 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="e.g. +1 213 373 4253"
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
                <p className="text-[10px] text-muted-foreground italic px-1">
                  Include international prefix (e.g. <strong>+1</strong> for USA, <strong>+44</strong> for UK).
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-4">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  <h3 className="font-bold text-xs uppercase tracking-wider text-primary">Pro Tip</h3>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  This tool uses <strong>libphonenumber-js</strong>, Google's phone number library, to ensure maximum accuracy and support for all global formats.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Output Side */}
        <div className="lg:col-span-7 h-full">
          {result ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              {result.isValid ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoRow label="International" value={result.formatted.international} id="intl" icon={Globe} />
                    <InfoRow label="National" value={result.formatted.national} id="nat" icon={MapPin} />
                    <InfoRow label="E.164" value={result.formatted.e164} id="e164" icon={Phone} />
                    <InfoRow label="RFC 3966 (URI)" value={result.formatted.uri} id="uri" icon={Zap} />
                  </div>

                  <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
                    <div className="px-8 py-6 border-b border-border/40 bg-muted/30">
                      <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Number Details</span>
                    </div>
                    <CardContent className="p-8 grid grid-cols-2 md:grid-cols-3 gap-8">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Country</p>
                        <div className="flex items-center gap-2">
                          <Flag className="w-4 h-4 text-primary/40" />
                          <p className="text-lg font-bold">{result.details.country}</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Prefix</p>
                        <p className="text-lg font-bold font-mono">{result.details.countryCallingCode}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Type</p>
                        <p className="text-lg font-bold capitalize">{result.details.type.toLowerCase()}</p>
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <div className="p-8 rounded-[2.5rem] border-2 border-destructive/30 bg-destructive/5 flex items-center gap-6">
                  <div className="w-16 h-16 rounded-3xl bg-destructive text-white flex items-center justify-center shrink-0 shadow-lg shadow-destructive/20">
                    <Info className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black tracking-tight text-destructive">Invalid Number</h3>
                    <p className="text-sm font-medium text-destructive/80">
                      Please check the format and include the country prefix.
                    </p>
                  </div>
                </div>
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
                  Enter a phone number to validate and see all available formats.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
