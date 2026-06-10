"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Lock, Copy, CheckCircle2, ArrowLeftRight, Settings2, Zap, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function EncryptionTool() {
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [input, setInput] = useState("");
  const [key, setKey] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const process = () => {
    setError("");
    if (!input) { setOutput(""); return; }
    if (!key) { setError("Please enter a key"); return; }
    try {
      if (mode === 'encrypt') {
        let result = "";
        for (let i = 0; i < input.length; i++) { result += String.fromCharCode(input.charCodeAt(i) ^ key.charCodeAt(i % key.length)); }
        setOutput(btoa(result));
      } else {
        const decoded = atob(input);
        let result = "";
        for (let i = 0; i < decoded.length; i++) { result += String.fromCharCode(decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length)); }
        setOutput(result);
      }
    } catch (err) { setError(mode === 'decrypt' ? "Invalid encrypted text" : "Encryption failed"); setOutput(""); }
  };

  const copyToClipboard = async () => { if (!output) return; try { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch (err) { console.error(err); } };

  return (
    <ToolLayout toolId="encryption">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
              <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center gap-2"><ArrowLeftRight className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Input</span></div>
              <CardContent className="p-6"><Textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder={mode === 'encrypt' ? "Enter text to encrypt..." : "Enter encrypted text..."} rows={14} className="w-full px-4 py-4 bg-muted/30 border-transparent rounded-2xl focus:border-primary/20 text-sm font-medium text-foreground resize-none placeholder:font-normal" /></CardContent>
            </Card>
            <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
              <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center gap-2"><ArrowLeftRight className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Result</span></div>
              <CardContent className="p-6"><Textarea value={output} readOnly placeholder="Result will appear here..." rows={14} className="w-full px-4 py-4 bg-muted/30 border-transparent rounded-2xl text-sm font-medium text-foreground resize-none placeholder:font-normal" /></CardContent>
            </Card>
          </div>
          {error && (<div className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-sm font-bold"><AlertCircle className="w-5 h-5 flex-shrink-0" />{error}</div>)}
        </div>

        <div className="lg:col-span-4 space-y-6 sticky top-24">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center gap-2"><Settings2 className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Mode</span></div>
            <CardContent className="p-8 space-y-6">
              <div className="bg-muted/30 p-1.5 rounded-xl flex items-center gap-1.5 border border-border/50">
                <button onClick={() => setMode('encrypt')} className={cn("flex-1 py-2.5 px-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all", mode === 'encrypt' ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground hover:bg-muted")}>Encrypt</button>
                <button onClick={() => setMode('decrypt')} className={cn("flex-1 py-2.5 px-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all", mode === 'decrypt' ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground hover:bg-muted")}>Decrypt</button>
              </div>
              <div className="space-y-3"><Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Secret Key</Label><Input type="text" value={key} onChange={(e) => setKey(e.target.value)} placeholder="Enter secret key..." className="h-12 px-4 rounded-xl bg-muted/30 border-transparent focus:border-primary/20 text-sm font-bold" /></div>
              <div className="space-y-3 pt-2">
                <Button onClick={process} className="w-full h-14 rounded-2xl text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"><Lock className="w-5 h-5 mr-2" /> {mode === 'encrypt' ? 'Encrypt' : 'Decrypt'}</Button>
                <Button onClick={copyToClipboard} disabled={!output} variant="outline" className="w-full h-12 rounded-xl border-border/50 font-bold">{copied ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}{copied ? "Copied!" : "Copy Result"}</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center gap-2"><Zap className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Info</span></div>
            <CardContent className="p-6"><p className="text-xs text-muted-foreground leading-relaxed font-medium">This tool uses XOR encryption with Base64 encoding. Both parties must share the same secret key to encrypt and decrypt messages.</p></CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
