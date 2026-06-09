"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Eraser, Copy, CheckCircle2, Trash2, FileCode } from "lucide-react";

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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 lg:order-last space-y-6">
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <Button onClick={strip} className="w-full h-12 shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest text-xs rounded-xl"><Eraser className="w-5 h-5 mr-2" /> Strip HTML</Button>
            <Button onClick={copyToClipboard} disabled={!output} variant="outline" className="w-full h-12 border-border hover:bg-accent text-muted-foreground hover:text-foreground font-bold uppercase tracking-widest text-xs">{copied ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}{copied ? "Copied!" : "Copy Result"}</Button>
            <Button onClick={clearAll} variant="outline" className="w-full h-12 border-border hover:bg-accent text-muted-foreground hover:text-foreground font-bold uppercase tracking-widest text-xs"><Trash2 className="w-4 h-4 mr-2" /> Clear All</Button>
          </div>
        </div>
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card rounded-[2rem] shadow-sm border border-border p-6">
              <h3 className="text-sm font-black text-foreground mb-4 flex items-center gap-2"><FileCode className="w-4 h-4 text-primary" /> HTML Input</h3>
              <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="<p>This is <b>HTML</b> content.</p>" rows={16} className="w-full px-4 py-4 bg-muted border border-border rounded-2xl focus:bg-card focus:border-primary focus:outline-none transition-all text-sm font-mono text-foreground leading-relaxed resize-none placeholder:font-normal" />
            </div>
            <div className="bg-card rounded-[2rem] shadow-sm border border-border p-6">
              <h3 className="text-sm font-black text-foreground mb-4 flex items-center gap-2"><Eraser className="w-4 h-4 text-primary" /> Plain Text</h3>
              <textarea value={output} readOnly placeholder="Plain text will appear here..." rows={16} className="w-full px-4 py-4 bg-muted border border-border rounded-2xl focus:outline-none text-sm font-medium text-foreground leading-relaxed resize-none placeholder:font-normal" />
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
