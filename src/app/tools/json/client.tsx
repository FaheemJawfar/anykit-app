"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Code, Copy, CheckCircle2, Trash2, AlertCircle, Check, Settings2, Zap, Braces } from "lucide-react";

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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
              <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center gap-2"><Code className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Input</span></div>
              <CardContent className="p-6"><Textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder='Paste JSON here... e.g. {"key": "value"}' rows={16} className="w-full px-4 py-4 bg-muted/30 border-transparent rounded-2xl focus:border-primary/20 text-sm font-mono text-foreground leading-relaxed resize-none placeholder:font-normal" /></CardContent>
            </Card>
            <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
              <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center gap-2"><Check className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Result</span></div>
              <CardContent className="p-6"><Textarea value={output} readOnly placeholder="Formatted JSON will appear here..." rows={16} className="w-full px-4 py-4 bg-muted/30 border-transparent rounded-2xl text-sm font-mono text-foreground leading-relaxed resize-none placeholder:font-normal" /></CardContent>
            </Card>
          </div>
          {error && (<div className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-sm font-bold"><AlertCircle className="w-5 h-5 flex-shrink-0" />{error}</div>)}
        </div>

        <div className="lg:col-span-4 space-y-6 sticky top-24">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center gap-2"><Settings2 className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Actions</span></div>
            <CardContent className="p-8 space-y-3">
              <Button onClick={formatJson} className="w-full h-14 rounded-2xl text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"><Braces className="w-5 h-5 mr-2" /> Format</Button>
              <Button onClick={minifyJson} variant="outline" className="w-full h-12 rounded-xl border-border/50 font-bold"><Code className="w-4 h-4 mr-2" /> Minify</Button>
              <Button onClick={copyToClipboard} disabled={!output} variant="outline" className="w-full h-12 rounded-xl border-border/50 font-bold">{copied ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}{copied ? "Copied!" : "Copy Result"}</Button>
              <Button onClick={clearAll} variant="outline" className="w-full h-12 rounded-xl border-border/50 font-bold text-muted-foreground"><Trash2 className="w-4 h-4 mr-2" /> Clear All</Button>
            </CardContent>
          </Card>

          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center gap-2"><Zap className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Info</span></div>
            <CardContent className="p-6"><p className="text-xs text-muted-foreground leading-relaxed font-medium"><strong>Format</strong> pretty-prints JSON with indentation. <strong>Minify</strong> removes all whitespace for compact output.</p></CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
