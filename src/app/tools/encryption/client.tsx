"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Lock, Copy, CheckCircle2, ArrowLeftRight } from "lucide-react";

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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 lg:order-last space-y-6">
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <div className="bg-muted p-1.5 rounded-xl flex items-center gap-1.5 border border-border/50">
              <button onClick={() => setMode('encrypt')} className={`flex-1 py-2 px-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${mode === 'encrypt' ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}>Encrypt</button>
              <button onClick={() => setMode('decrypt')} className={`flex-1 py-2 px-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${mode === 'decrypt' ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}>Decrypt</button>
            </div>
            <Button onClick={process} className="w-full h-12 shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest text-xs rounded-xl"><Lock className="w-5 h-5 mr-2" /> {mode === 'encrypt' ? 'Encrypt' : 'Decrypt'}</Button>
            <Button onClick={copyToClipboard} disabled={!output} variant="outline" className="w-full h-12 border-border hover:bg-accent text-muted-foreground hover:text-foreground font-bold uppercase tracking-widest text-xs">{copied ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}{copied ? "Copied!" : "Copy Result"}</Button>
          </div>
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">Key</h3>
            <input type="text" value={key} onChange={(e) => setKey(e.target.value)} placeholder="Enter secret key..." className="w-full px-4 py-3 bg-muted border border-border rounded-xl focus:border-primary focus:outline-none text-sm font-bold text-foreground placeholder:font-normal" />
          </div>
          {error && <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-4 text-sm font-bold">{error}</div>}
        </div>
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card rounded-[2rem] shadow-sm border border-border p-6"><h3 className="text-sm font-black text-foreground mb-4 flex items-center gap-2"><ArrowLeftRight className="w-4 h-4 text-primary" /> Input</h3><textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder={mode === 'encrypt' ? "Enter text to encrypt..." : "Enter encrypted text..."} rows={12} className="w-full px-4 py-4 bg-muted border border-border rounded-2xl focus:bg-card focus:border-primary focus:outline-none text-sm font-medium text-foreground resize-none placeholder:font-normal" /></div>
            <div className="bg-card rounded-[2rem] shadow-sm border border-border p-6"><h3 className="text-sm font-black text-foreground mb-4 flex items-center gap-2"><ArrowLeftRight className="w-4 h-4 text-primary" /> Result</h3><textarea value={output} readOnly placeholder="Result will appear here..." rows={12} className="w-full px-4 py-4 bg-muted border border-border rounded-2xl focus:outline-none text-sm font-medium text-foreground resize-none placeholder:font-normal" /></div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
