"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Key, Copy, CheckCircle2, AlertCircle, Code, Shield, Zap, Settings2 } from "lucide-react";

export default function JWTDebugger() {
  const [token, setToken] = useState("");
  const [decoded, setDecoded] = useState<{ header: string; payload: string; signature: string } | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const decodeJWT = () => {
    setError("");
    if (!token.trim()) { setDecoded(null); return; }
    try {
      const parts = token.split(".");
      if (parts.length !== 3) throw new Error("Invalid JWT format");
      const header = JSON.parse(atob(parts[0].replace(/-/g, "+").replace(/_/g, "/")));
      const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
      setDecoded({ header: JSON.stringify(header, null, 2), payload: JSON.stringify(payload, null, 2), signature: parts[2] });
    } catch (err) { setError("Invalid JWT token"); setDecoded(null); }
  };

  const copyToClipboard = async (content: string, label: string) => { try { await navigator.clipboard.writeText(content); setCopied(label); setTimeout(() => setCopied(null), 2000); } catch (err) { console.error(err); } };

  return (
    <ToolLayout toolId="jwt-debugger">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center gap-3"><Key className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">JWT Token</span></div>
            <CardContent className="p-8">
              <Textarea value={token} onChange={(e) => setToken(e.target.value)} placeholder="Paste JWT token here... eyJhbGciOiJIUzI1NiIs..." rows={6} className="w-full px-4 py-4 bg-muted/30 border-transparent rounded-2xl focus:border-primary/20 text-sm font-mono text-foreground leading-relaxed resize-none placeholder:font-normal" />
            </CardContent>
          </Card>
          {decoded && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
                <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center gap-2"><Code className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Header</span></div>
                <CardContent className="p-6"><pre className="p-4 bg-muted/30 rounded-xl text-xs font-mono text-foreground overflow-auto">{decoded.header}</pre></CardContent>
              </Card>
              <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
                <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center gap-2"><Shield className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Payload</span></div>
                <CardContent className="p-6"><pre className="p-4 bg-muted/30 rounded-xl text-xs font-mono text-foreground overflow-auto">{decoded.payload}</pre></CardContent>
              </Card>
            </div>
          )}
          {error && (<div className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-sm font-bold"><AlertCircle className="w-5 h-5 flex-shrink-0" />{error}</div>)}
        </div>

        <div className="lg:col-span-4 space-y-6 sticky top-24">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center gap-2"><Settings2 className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Actions</span></div>
            <CardContent className="p-8 space-y-4">
              <Button onClick={decodeJWT} className="w-full h-14 rounded-2xl text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"><Key className="w-5 h-5 mr-2" /> Decode JWT</Button>
            </CardContent>
          </Card>

          {decoded && (
            <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden">
              <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center gap-2"><Zap className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Copy Parts</span></div>
              <CardContent className="p-6 space-y-2">
                <Button onClick={() => copyToClipboard(decoded.header, 'header')} variant="outline" className="w-full justify-start text-xs font-bold h-12 rounded-xl border-border/50">{copied === 'header' ? <CheckCircle2 className="w-4 h-4 mr-2 text-primary" /> : <Copy className="w-4 h-4 mr-2" />} Header</Button>
                <Button onClick={() => copyToClipboard(decoded.payload, 'payload')} variant="outline" className="w-full justify-start text-xs font-bold h-12 rounded-xl border-border/50">{copied === 'payload' ? <CheckCircle2 className="w-4 h-4 mr-2 text-primary" /> : <Copy className="w-4 h-4 mr-2" />} Payload</Button>
                <Button onClick={() => copyToClipboard(decoded.signature, 'sig')} variant="outline" className="w-full justify-start text-xs font-bold h-12 rounded-xl border-border/50">{copied === 'sig' ? <CheckCircle2 className="w-4 h-4 mr-2 text-primary" /> : <Copy className="w-4 h-4 mr-2" />} Signature</Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
