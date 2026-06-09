"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Code, Copy, CheckCircle2, Trash2, Upload, Download, AlertTriangle, Check } from "lucide-react";

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const formatJson = () => {
    setError("");
    if (!input.trim()) { setOutput(""); return; }
    try { const parsed = JSON.parse(input); setOutput(JSON.stringify(parsed, null, 2)); } catch (err) { setError("Invalid JSON: " + (err as Error).message); setOutput(""); }
  };

  const minifyJson = () => {
    setError("");
    if (!input.trim()) { setOutput(""); return; }
    try { const parsed = JSON.parse(input); setOutput(JSON.stringify(parsed)); } catch (err) { setError("Invalid JSON: " + (err as Error).message); setOutput(""); }
  };

  const copyToClipboard = async () => { if (!output) return; try { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch (err) { console.error(err); } };
  const clearAll = () => { setInput(""); setOutput(""); setError(""); };

  return (
    <ToolLayout toolId="json">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 lg:order-last space-y-6">
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <Button onClick={formatJson} className="w-full h-12 shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest text-xs rounded-xl"><Code className="w-5 h-5 mr-2" /> Format JSON</Button>
            <Button onClick={minifyJson} variant="outline" className="w-full h-12 border-border hover:bg-accent text-muted-foreground hover:text-foreground font-bold uppercase tracking-widest text-xs"><Code className="w-4 h-4 mr-2" /> Minify JSON</Button>
            <Button onClick={copyToClipboard} disabled={!output} variant="outline" className="w-full h-12 border-border hover:bg-accent text-muted-foreground hover:text-foreground font-bold uppercase tracking-widest text-xs">{copied ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}{copied ? "Copied!" : "Copy Result"}</Button>
            <Button onClick={clearAll} variant="outline" className="w-full h-12 border-border hover:bg-accent text-muted-foreground hover:text-foreground font-bold uppercase tracking-widest text-xs"><Trash2 className="w-4 h-4 mr-2" /> Clear All</Button>
          </div>
          {error && <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-4 text-sm font-bold flex items-center gap-2"><AlertTriangle className="w-5 h-5" />{error}</div>}
        </div>
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card rounded-[2rem] shadow-sm border border-border p-6"><h3 className="text-sm font-black text-foreground mb-4 flex items-center gap-2"><Code className="w-4 h-4 text-primary" /> Input</h3><textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder='Paste JSON here... e.g. {"key": "value"}' rows={20} className="w-full px-4 py-4 bg-muted border border-border rounded-2xl focus:bg-card focus:border-primary focus:outline-none transition-all text-sm font-mono text-foreground leading-relaxed resize-none placeholder:font-normal" /></div>
            <div className="bg-card rounded-[2rem] shadow-sm border border-border p-6"><h3 className="text-sm font-black text-foreground mb-4 flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> Result</h3><textarea value={output} readOnly placeholder="Formatted JSON will appear here..." rows={20} className="w-full px-4 py-4 bg-muted border border-border rounded-2xl focus:outline-none text-sm font-mono text-foreground leading-relaxed resize-none placeholder:font-normal" /></div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
