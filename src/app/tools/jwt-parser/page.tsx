"use client";

import { ToolLayout } from "@/components/tool-layout";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { 
  ShieldCheck, 
  Copy, 
  Check, 
  Trash2,
  AlertCircle,
  Key,
  Info,
  Calendar,
  Lock,
  User,
  Fingerprint
} from "lucide-react";
import { cn } from "@/lib/utils";

interface JWTInfo {
  header: any;
  payload: any;
  signature: string;
}

export default function JWTParser() {
  const [input, setInput] = useState("");
  const [jwtData, setJwtData] = useState<JWTInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const decodeJWT = (token: string) => {
    setInput(token);
    setError(null);
    if (!token.trim()) {
      setJwtData(null);
      return;
    }

    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error("Invalid JWT format. A JWT must have 3 parts separated by dots.");
      }

      const [headerB64, payloadB64, signature] = parts;

      const header = JSON.parse(atob(headerB64.replace(/-/g, '+').replace(/_/g, '/')));
      const payload = JSON.parse(atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/')));

      setJwtData({ header, payload, signature });
    } catch (e: any) {
      setError(e.message);
      setJwtData(null);
    }
  };

  const copy = (val: string, id: string) => {
    navigator.clipboard.writeText(typeof val === 'string' ? val : JSON.stringify(val, null, 2));
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const clear = () => {
    setInput("");
    setJwtData(null);
    setError(null);
  };

  const formatDate = (timestamp: number) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp * 1000).toLocaleString();
  };

  return (
    <ToolLayout toolId="jwt-parser">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Section */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col h-[500px]">
            <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <Key className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Paste Token</span>
              </div>
              <Button variant="ghost" size="icon" onClick={clear} className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <CardContent className="p-0 flex-1">
              <Textarea
                placeholder="Paste your JWT here (header.payload.signature)"
                value={input}
                onChange={(e) => decodeJWT(e.target.value)}
                className="w-full h-full min-h-[400px] p-8 bg-transparent border-none focus-visible:ring-0 resize-none font-mono text-sm leading-relaxed break-all"
              />
            </CardContent>
          </Card>

          {error && (
            <div className="p-6 rounded-3xl bg-destructive/5 border border-destructive/10 text-destructive animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-2 mb-2 font-bold uppercase tracking-wider text-[10px]">
                <AlertCircle className="w-3 h-3" />
                Error Decoding Token
              </div>
              <p className="text-[11px] font-mono">{error}</p>
            </div>
          )}

          {!jwtData && !error && (
            <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-4">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-primary" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-primary">About JWT</h3>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed italic">
                JSON Web Token (JWT) is an open standard (RFC 7519) that defines a compact and self-contained way for securely transmitting information between parties as a JSON object.
              </p>
            </div>
          )}
        </div>

        {/* Output Section */}
        <div className="lg:col-span-7 space-y-6">
          {jwtData ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Stats/Quick View */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-3xl bg-card border border-border/40 shadow-sm flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase text-muted-foreground">Expires At</p>
                    <p className="text-xs font-mono font-bold">{formatDate(jwtData.payload.exp)}</p>
                  </div>
                </div>
                <div className="p-4 rounded-3xl bg-card border border-border/40 shadow-sm flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase text-muted-foreground">Subject (sub)</p>
                    <p className="text-xs font-mono font-bold truncate max-w-[150px]">{jwtData.payload.sub || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* Header */}
              <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
                <div className="px-8 py-4 border-b border-border/40 bg-pink-500/5 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-pink-500">Header (Algorithm & Type)</span>
                  <Button variant="ghost" size="sm" onClick={() => copy(jwtData.header, 'header')} className="h-8 rounded-xl font-bold">
                    {copied === 'header' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
                <CardContent className="p-6">
                  <pre className="text-sm font-mono text-pink-500/90 leading-relaxed overflow-auto max-h-[150px]">
                    {JSON.stringify(jwtData.header, null, 2)}
                  </pre>
                </CardContent>
              </Card>

              {/* Payload */}
              <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
                <div className="px-8 py-4 border-b border-border/40 bg-violet-500/5 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-violet-500">Payload (Data)</span>
                  <Button variant="ghost" size="sm" onClick={() => copy(jwtData.payload, 'payload')} className="h-8 rounded-xl font-bold">
                    {copied === 'payload' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
                <CardContent className="p-6">
                  <pre className="text-sm font-mono text-violet-500/90 leading-relaxed overflow-auto max-h-[300px]">
                    {JSON.stringify(jwtData.payload, null, 2)}
                  </pre>
                </CardContent>
              </Card>

              {/* Signature */}
              <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
                <div className="px-8 py-4 border-b border-border/40 bg-blue-500/5 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-blue-500">Signature</span>
                </div>
                <CardContent className="p-6">
                  <p className="text-sm font-mono text-blue-500/80 break-all leading-relaxed">
                    {jwtData.signature}
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-6 bg-muted/20 rounded-[2.5rem] border border-dashed border-border/40">
              <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center">
                <Lock className="w-10 h-10 text-muted-foreground/30" />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-lg">No Token Decoded</h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                  Paste a JWT in the input box to see its header, payload, and signature breakdown.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
