"use client";

import React, { useState, useEffect } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Copy, CheckCircle2, Download, Trash2, Code, Eye, FileCode } from "lucide-react";
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 lg:order-last space-y-6">
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <Button onClick={copyToClipboard} disabled={!htmlOutput} className="w-full h-12 shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest text-xs rounded-xl">{copied ? <CheckCircle2 className="w-5 h-5 mr-2" /> : <Copy className="w-5 h-5 mr-2" />}{copied ? "Copied!" : "Copy HTML"}</Button>
            <Button onClick={downloadHTML} disabled={!htmlOutput} variant="outline" className="w-full h-12 border-border hover:bg-accent text-muted-foreground hover:text-foreground font-bold uppercase tracking-widest text-xs"><Download className="w-4 h-4 mr-2" /> Download HTML</Button>
            <Button onClick={insertExample} variant="outline" className="w-full h-12 border-border hover:bg-accent text-muted-foreground hover:text-foreground font-bold uppercase tracking-widest text-xs"><FileCode className="w-4 h-4 mr-2" /> Load Example</Button>
            <Button onClick={() => setMarkdown("")} variant="outline" className="w-full h-12 border-border hover:bg-accent text-muted-foreground hover:text-foreground font-bold uppercase tracking-widest text-xs"><Trash2 className="w-4 h-4 mr-2" /> Clear</Button>
          </div>
        </div>
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card rounded-[2rem] shadow-sm border border-border p-6">
              <h3 className="text-sm font-black text-foreground mb-4 flex items-center gap-2"><Code className="w-4 h-4 text-primary" /> Markdown</h3>
              <textarea value={markdown} onChange={(e) => setMarkdown(e.target.value)} placeholder="Paste markdown here..." rows={18} className="w-full px-4 py-4 bg-muted border border-border rounded-2xl focus:bg-card focus:border-primary focus:outline-none transition-all text-sm font-mono text-foreground leading-relaxed resize-none placeholder:font-normal" />
            </div>
            <div className="bg-card rounded-[2rem] shadow-sm border border-border p-6">
              <h3 className="text-sm font-black text-foreground mb-4 flex items-center gap-2"><Eye className="w-4 h-4 text-primary" /> HTML Output</h3>
              <textarea value={htmlOutput} readOnly placeholder="HTML will appear here..." rows={18} className="w-full px-4 py-4 bg-muted border border-border rounded-2xl focus:outline-none text-sm font-mono text-foreground leading-relaxed resize-none placeholder:font-normal" />
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
