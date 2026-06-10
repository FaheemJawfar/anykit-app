"use client";

import React, { useState, useEffect } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Copy, CheckCircle2, Download, Trash2, Code, Eye, FileCode, Zap } from "lucide-react";
import { marked } from "marked";

export default function MarkdownToHTML() {
  const [markdown, setMarkdown] = useState("");
  const [htmlOutput, setHtmlOutput] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => { if (!markdown) { setHtmlOutput(""); return; } try { setHtmlOutput(marked.parse(markdown) as string); } catch { setHtmlOutput("Error parsing markdown"); } }, [markdown]);

  const copyToClipboard = async () => { if (!htmlOutput) return; try { await navigator.clipboard.writeText(htmlOutput); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch (err) { console.error(err); } };
  const downloadHTML = () => { if (!htmlOutput) return; const blob = new Blob([htmlOutput], { type: 'text/html' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'converted.html'; a.click(); URL.revokeObjectURL(url); };
  const insertExample = () => { setMarkdown(`# Heading 1\n## Heading 2\n\n**Bold** and *Italic*\n\n- List item 1\n- List item 2\n\n[Link](https://example.com)\n\n\`\`\`javascript\nconsole.log("Hello");\n\`\`\`\n\n| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |\n`); };

  return (
    <ToolLayout toolId="markdown-to-html">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
              <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center gap-2"><Code className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Markdown</span></div>
              <CardContent className="p-6"><textarea value={markdown} onChange={(e) => setMarkdown(e.target.value)} placeholder="Paste markdown here..." rows={18} className="w-full px-4 py-4 bg-muted/30 border-transparent rounded-2xl focus:border-primary/20 text-sm font-mono text-foreground leading-relaxed resize-none placeholder:font-normal" /></CardContent>
            </Card>
            <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
              <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center gap-2"><Eye className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">HTML Output</span></div>
              <CardContent className="p-6"><textarea value={htmlOutput} readOnly placeholder="HTML will appear here..." rows={18} className="w-full px-4 py-4 bg-muted/30 border-transparent rounded-2xl text-sm font-mono text-foreground leading-relaxed resize-none placeholder:font-normal" /></CardContent>
            </Card>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6 sticky top-24">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center gap-2"><Zap className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Actions</span></div>
            <CardContent className="p-8 space-y-3">
              <Button onClick={copyToClipboard} disabled={!htmlOutput} className="w-full h-14 rounded-2xl text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]">{copied ? <CheckCircle2 className="w-5 h-5 mr-2" /> : <Copy className="w-5 h-5 mr-2" />}{copied ? "Copied!" : "Copy HTML"}</Button>
              <Button onClick={downloadHTML} disabled={!htmlOutput} variant="outline" className="w-full h-12 rounded-xl border-border/50 font-bold text-muted-foreground"><Download className="w-4 h-4 mr-2" /> Download HTML</Button>
              <Button onClick={insertExample} variant="outline" className="w-full h-12 rounded-xl border-border/50 font-bold text-muted-foreground"><FileCode className="w-4 h-4 mr-2" /> Load Example</Button>
              <Button onClick={() => setMarkdown("")} variant="outline" className="w-full h-12 rounded-xl border-border/50 font-bold text-muted-foreground"><Trash2 className="w-4 h-4 mr-2" /> Clear</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
