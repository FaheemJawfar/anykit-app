"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Key, Copy, CheckCircle2, AlertTriangle, Code, Shield } from "lucide-react";

export default function JWTDebugger() {
  const [token, setToken] = useState("");
  const [decoded, setDecoded] = useState<{ header: string; payload: string; signature: string } | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

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

  const copyToClipboard = async (content: string) => { try { await navigator.clipboard.writeText(content); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch (err) { console.error(err); } };

  return (
    <ToolLayout toolId="jwt-debugger">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 lg:order-last space-y-6">
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <Button onClick={decodeJWT} className="w-full h-12 shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest text-xs rounded-xl"><Key className="w-5 h-5 mr-2" /> Decode JWT</Button>
          </div>
          {error && <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-4 text-sm font-bold flex items-center gap-2"><AlertTriangle className="w-5 h-5" />{error}</div>}
          {decoded && (
            <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">Parts</h3>
              <div className="space-y-2">
                <Button onClick={() => copyToClipboard(decoded.header)} variant="outline" className="w-full justify-start text-xs font-bold h-10"><Code className="w-3.5 h-3.5 mr-2" /> Copy Header</Button>
                <Button onClick={() => copyToClipboard(decoded.payload)} variant="outline" className="w-full justify-start text-xs font-bold h-10"><Shield className="w-3.5 h-3.5 mr-2" /> Copy Payload</Button>
                <Button onClick={() => copyToClipboard(decoded.signature)} variant="outline" className="w-full justify-start text-xs font-bold h-10"><Key className="w-3.5 h-3.5 mr-2" /> Copy Signature</Button>
              </div>
            </div>
          )}
        </div>
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-card rounded-[2rem] shadow-sm border border-border p-8">
            <h3 className="text-lg font-black text-foreground mb-6 flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center"><Key className="w-5 h-5 text-primary" /></div>JWT Token</h3>
            <textarea value={token} onChange={(e) => setToken(e.target.value)} placeholder="Paste JWT token here..." rows={6} className="w-full px-6 py-4 bg-muted border border-border rounded-2xl focus:bg-card focus:border-primary focus:outline-none transition-all text-sm font-mono text-foreground leading-relaxed resize-none placeholder:font-normal" />
          </div>
          {decoded && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card rounded-[2rem] shadow-sm border border-border p-6">
                <h3 className="text-sm font-black text-foreground mb-4 flex items-center gap-2"><Code className="w-4 h-4 text-primary" /> Header</h3>
                <pre className="p-4 bg-muted rounded-xl text-xs font-mono text-foreground overflow-auto">{decoded.header}</pre>
              </div>
              <div className="bg-card rounded-[2rem] shadow-sm border border-border p-6">
                <h3 className="text-sm font-black text-foreground mb-4 flex items-center gap-2"><Shield className="w-4 h-4 text-primary" /> Payload</h3>
                <pre className="p-4 bg-muted rounded-xl text-xs font-mono text-foreground overflow-auto">{decoded.payload}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
