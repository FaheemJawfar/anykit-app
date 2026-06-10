"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Code, Copy, CheckCircle2, Eye, FileCode, Zap } from "lucide-react";

export default function HtmlEditor() {
  const [html, setHtml] = useState("<h1>Hello World</h1>\n<p>Edit this HTML and see the live preview.</p>");
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => { try { await navigator.clipboard.writeText(html); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch (err) { console.error(err); } };

  return (
    <ToolLayout toolId="html-editor">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center gap-3"><FileCode className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">HTML Editor</span></div>
            <CardContent className="p-8"><textarea value={html} onChange={(e) => setHtml(e.target.value)} rows={20} className="w-full px-6 py-6 bg-muted/30 border-transparent rounded-2xl focus:border-primary/20 text-sm font-mono text-foreground leading-relaxed resize-none placeholder:font-normal" /></CardContent>
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-6 sticky top-24">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center gap-2"><Zap className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Actions</span></div>
            <CardContent className="p-8">
              <Button onClick={copyToClipboard} className="w-full h-14 rounded-2xl text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]">{copied ? <CheckCircle2 className="w-5 h-5 mr-2" /> : <Copy className="w-5 h-5 mr-2" />}{copied ? "Copied!" : "Copy HTML"}</Button>
            </CardContent>
          </Card>
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center gap-2"><Eye className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Preview</span></div>
            <CardContent className="p-6"><div className="bg-white border border-border rounded-xl p-4 min-h-[200px] overflow-auto"><div dangerouslySetInnerHTML={{ __html: html }} /></div></CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
