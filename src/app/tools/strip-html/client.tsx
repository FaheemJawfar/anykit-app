"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Eraser, Copy, CheckCircle2, Trash2, FileCode, Zap } from "lucide-react";

export default function StripHtml() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const strip = () => {
    if (!input) { setOutput(""); return; }
    const temp = document.createElement("div");
    temp.innerHTML = input;
    setOutput(temp.textContent || temp.innerText || "");
  };

  const copyToClipboard = async () => { if (!output) return; try { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch (err) { console.error(err); } };
  const clearAll = () => { setInput(""); setOutput(""); };

  return (
    <ToolLayout toolId="strip-html">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
              <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center gap-2"><FileCode className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">HTML Input</span></div>
              <CardContent className="p-6"><textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="<p>This is <b>HTML</b> content.</p>" rows={16} className="w-full px-4 py-4 bg-muted/30 border-transparent rounded-2xl focus:border-primary/20 text-sm font-mono text-foreground leading-relaxed resize-none placeholder:font-normal" /></CardContent>
            </Card>
            <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
              <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center gap-2"><Eraser className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Plain Text</span></div>
              <CardContent className="p-6"><textarea value={output} readOnly placeholder="Plain text will appear here..." rows={16} className="w-full px-4 py-4 bg-muted/30 border-transparent rounded-2xl text-sm font-medium text-foreground leading-relaxed resize-none placeholder:font-normal" /></CardContent>
            </Card>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6 sticky top-24">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center gap-2"><Zap className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Actions</span></div>
            <CardContent className="p-8 space-y-3">
              <Button onClick={strip} className="w-full h-14 rounded-2xl text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"><Eraser className="w-5 h-5 mr-2" /> Strip HTML</Button>
              <Button onClick={copyToClipboard} disabled={!output} variant="outline" className="w-full h-12 rounded-xl border-border/50 font-bold text-muted-foreground">{copied ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}{copied ? "Copied!" : "Copy Result"}</Button>
              <Button onClick={clearAll} variant="outline" className="w-full h-12 rounded-xl border-border/50 font-bold text-muted-foreground"><Trash2 className="w-4 h-4 mr-2" /> Clear All</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
