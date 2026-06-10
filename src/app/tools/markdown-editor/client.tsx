"use client";

import React, { useState, useRef, useEffect } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Copy, CheckCircle2, Download, Trash2, Eye, Code, FileText, Zap, LayoutTemplate } from "lucide-react";
import { marked } from "marked";
import { cn } from "@/lib/utils";

export default function MarkdownEditor() {
  const [markdown, setMarkdown] = useState(`# Welcome to Markdown Editor

## Edit on the left, preview on the right

**Features:**
- Real-time preview
- Syntax highlighting
- File upload/download
- Responsive layout

Try these examples:

\`\`\`javascript
function hello() {
  console.log("Markdown is awesome!");
}
\`\`\`

> This is a blockquote example

| Feature | Status |
|---------|--------|
| Preview | Yes |
| Upload  | Yes |
| Export  | Yes |

[Learn more about Markdown](https://www.markdownguide.org)
`);
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'split' | 'edit' | 'preview'>('split');
  const [html, setHtml] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { try { setHtml(marked.parse(markdown) as string); } catch { setHtml(""); } }, [markdown]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => { const content = e.target?.result as string; setMarkdown(content); };
    reader.readAsText(file); e.target.value = '';
  };

  const copyToClipboard = async () => { try { await navigator.clipboard.writeText(markdown); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch (err) { console.error(err); } };
  const downloadMarkdown = () => { const blob = new Blob([markdown], { type: 'text/markdown' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'document.md'; a.click(); URL.revokeObjectURL(url); };

  return (
    <ToolLayout toolId="markdown-editor">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          <div className={`grid ${viewMode === 'split' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'} gap-6`}>
            {(viewMode === 'split' || viewMode === 'edit') && (
              <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
                <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center gap-2"><Code className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Editor</span></div>
                <CardContent className="p-6"><textarea value={markdown} onChange={(e) => setMarkdown(e.target.value)} rows={20} className="w-full px-4 py-4 bg-muted/30 border-transparent rounded-2xl focus:border-primary/20 text-sm font-mono text-foreground leading-relaxed resize-none placeholder:font-normal" /></CardContent>
              </Card>
            )}
            {(viewMode === 'split' || viewMode === 'preview') && (
              <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
                <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center gap-2"><Eye className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Preview</span></div>
                <CardContent className="p-6"><div className="prose dark:prose-invert max-w-none p-4 bg-muted/30 rounded-2xl overflow-auto min-h-[500px]"><div dangerouslySetInnerHTML={{ __html: html }} /></div></CardContent>
              </Card>
            )}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6 sticky top-24">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center gap-2"><LayoutTemplate className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">View Mode</span></div>
            <CardContent className="p-8 space-y-4">
              <div className="bg-muted/30 p-1.5 rounded-xl flex items-center gap-1.5 border border-border/50">
                <button onClick={() => setViewMode('split')} className={cn("flex-1 py-2.5 px-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all", viewMode === 'split' ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground hover:bg-muted")}>Split</button>
                <button onClick={() => setViewMode('edit')} className={cn("flex-1 py-2.5 px-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all", viewMode === 'edit' ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground hover:bg-muted")}>Edit</button>
                <button onClick={() => setViewMode('preview')} className={cn("flex-1 py-2.5 px-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all", viewMode === 'preview' ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground hover:bg-muted")}>Preview</button>
              </div>
              <Button onClick={copyToClipboard} className="w-full h-14 rounded-2xl text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]">{copied ? <CheckCircle2 className="w-5 h-5 mr-2" /> : <Copy className="w-5 h-5 mr-2" />}{copied ? "Copied!" : "Copy Markdown"}</Button>
              <Button onClick={downloadMarkdown} variant="outline" className="w-full h-12 rounded-xl border-border/50 font-bold text-muted-foreground"><Download className="w-4 h-4 mr-2" /> Download .md</Button>
              <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="w-full h-12 rounded-xl border-border/50 font-bold text-muted-foreground"><FileText className="w-4 h-4 mr-2" /> Upload .md</Button>
              <input type="file" accept=".md,.markdown" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
