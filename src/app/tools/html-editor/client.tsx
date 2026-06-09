"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Code, Copy, CheckCircle2, Eye, FileCode } from "lucide-react";

export default function HtmlEditor() {
  const [html, setHtml] = useState("<h1>Hello World</h1>\n<p>Edit this HTML and see the live preview.</p>");
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => { try { await navigator.clipboard.writeText(html); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch (err) { console.error(err); } };

  return (
    <ToolLayout toolId="html-editor">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 lg:order-last space-y-6">
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <Button onClick={copyToClipboard} className="w-full h-12 shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest text-xs rounded-xl">{copied ? <CheckCircle2 className="w-5 h-5 mr-2" /> : <Copy className="w-5 h-5 mr-2" />}{copied ? "Copied!" : "Copy HTML"}</Button>
          </div>
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">Preview</h3>
            <div className="bg-white border border-border rounded-xl p-4 min-h-[200px] overflow-auto"><div dangerouslySetInnerHTML={{ __html: html }} /></div>
          </div>
        </div>
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-card rounded-[2rem] shadow-sm border border-border p-8">
            <h3 className="text-lg font-black text-foreground mb-6 flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center"><FileCode className="w-5 h-5 text-primary" /></div>HTML Editor</h3>
            <textarea value={html} onChange={(e) => setHtml(e.target.value)} rows={20} className="w-full px-6 py-6 bg-muted border border-border rounded-[2rem] focus:bg-card focus:border-primary focus:outline-none transition-all text-sm font-mono text-foreground leading-relaxed resize-none placeholder:font-normal" />
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
