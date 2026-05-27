"use client";

import { ToolLayout } from "@/components/tool-layout";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { 
  Shield, 
  Copy, 
  Check, 
  Trash2,
  Zap,
  ExternalLink,
  Search,
  Lock,
  Unlock,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function SafelinkDecoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const decodeSafelink = (val: string) => {
    setInput(val);
    setError(null);
    if (!val.trim()) {
      setOutput("");
      return;
    }

    try {
      if (val.includes(".safelinks.protection.outlook.com")) {
        const urlObj = new URL(val);
        const targetUrl = urlObj.searchParams.get("url");
        if (targetUrl) {
          setOutput(decodeURIComponent(targetUrl));
        } else {
          throw new Error("Target URL not found in Safelink.");
        }
      } else {
        throw new Error("Invalid Safelink. Please use a Microsoft Outlook Safelink.");
      }
    } catch (e: any) {
      setError(e.message || "Failed to decode link.");
      setOutput("");
    }
  };

  const copyToClipboard = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout toolId="safelink-decoder">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Editor Side */}
        <div className="lg:col-span-12 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col">
            <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Lock className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Encoded Safelink</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => decodeSafelink("")} className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <CardContent className="p-0">
              <Textarea
                placeholder="Paste the safelink here... (starts with https://*.safelinks.protection.outlook.com/...)"
                value={input}
                onChange={(e) => decodeSafelink(e.target.value)}
                className="w-full h-32 p-8 bg-transparent border-none focus-visible:ring-0 resize-none font-mono text-xs leading-relaxed break-all"
              />
            </CardContent>
          </Card>

          <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col min-h-[300px]">
            <div className="px-8 py-6 border-b border-border/40 bg-primary/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Unlock className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-primary">Decoded Destination</span>
              </div>
              <div className="flex gap-2">
                {output && (
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="rounded-xl font-bold px-4 hover:bg-primary/10"
                  >
                    <a href={output} target="_blank" rel="noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Visit URL
                    </a>
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyToClipboard}
                  disabled={!output}
                  className={cn(
                    "rounded-xl font-bold px-4 hover:bg-primary/10 transition-all",
                    copied && "text-green-500 hover:text-green-500"
                  )}
                >
                  {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                  {copied ? "Copied" : "Copy URL"}
                </Button>
              </div>
            </div>
            <CardContent className="p-0 flex-1 relative bg-primary/[0.01]">
              {error ? (
                <div className="p-8 h-full bg-destructive/5 text-destructive font-mono text-sm space-y-4">
                  <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-[10px]">
                    <AlertCircle className="w-3 h-3" />
                    Decode Error
                  </div>
                  <div className="bg-destructive/10 p-4 rounded-xl border border-destructive/20">
                    {error}
                  </div>
                </div>
              ) : (
                <div className="p-8 font-mono text-lg font-bold leading-relaxed break-all whitespace-pre-wrap h-full flex items-center justify-center text-center">
                  {output || <span className="text-muted-foreground italic font-normal opacity-50">Decoded link will appear here...</span>}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
