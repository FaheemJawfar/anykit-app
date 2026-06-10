"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Book, Copy, CheckCircle2, Hash, Type, List, Link as LinkIcon, Quote as QuoteIcon, Table as TableIcon, Code, Info } from "lucide-react";

interface CheatsheetItem { category: string; icon: React.ReactNode; items: { name: string; syntax: string }[]; }

const cheatsheetData: CheatsheetItem[] = [
  { category: "Headers", icon: <Hash className="w-4 h-4" />, items: [{ name: "H1", syntax: "# Heading 1" }, { name: "H2", syntax: "## Heading 2" }, { name: "H3", syntax: "### Heading 3" }, { name: "H4", syntax: "#### Heading 4" }] },
  { category: "Text Formatting", icon: <Type className="w-4 h-4" />, items: [{ name: "Bold", syntax: "**bold text**" }, { name: "Italic", syntax: "*italic text*" }, { name: "Bold & Italic", syntax: "***bold and italic***" }, { name: "Strikethrough", syntax: "~~strikethrough~~" }] },
  { category: "Lists", icon: <List className="w-4 h-4" />, items: [{ name: "Unordered", syntax: "- Item" }, { name: "Ordered", syntax: "1. Item" }, { name: "Task List", syntax: "- [ ] Todo" }, { name: "Nested", syntax: "- Item\n  - Nested" }] },
  { category: "Links & Images", icon: <LinkIcon className="w-4 h-4" />, items: [{ name: "Link", syntax: "[Title](URL)" }, { name: "Image", syntax: "![Alt](URL)" }] },
  { category: "Code", icon: <Code className="w-4 h-4" />, items: [{ name: "Inline", syntax: "`code`" }, { name: "Block", syntax: "```lang\ncode\n```" }] },
  { category: "Blockquotes", icon: <QuoteIcon className="w-4 h-4" />, items: [{ name: "Quote", syntax: "> Quote" }, { name: "Nested", syntax: "> Quote\n>> Nested" }] },
  { category: "Tables", icon: <TableIcon className="w-4 h-4" />, items: [{ name: "Basic", syntax: "| A | B |\n|---|---|\n| 1 | 2 |" }, { name: "Aligned", syntax: "| L | C | R |\n|:--|:-:|--:|" }] },
];

export default function MarkdownCheatsheet() {
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const copyToClipboard = async (syntax: string, id: string) => { try { await navigator.clipboard.writeText(syntax); setCopiedIndex(id); setTimeout(() => setCopiedIndex(null), 2000); } catch (err) { console.error(err); } };

  return (
    <ToolLayout toolId="markdown-cheatsheet">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cheatsheetData.map((section) => (
              <Card key={section.category} className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
                <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary">{section.icon}</div><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{section.category}</span></div>
                <CardContent className="p-8 space-y-3">{section.items.map((item, i) => (<div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-xl border border-border group hover:border-primary/20 transition-all"><code className="text-sm font-mono text-foreground">{item.syntax}</code><Button onClick={() => copyToClipboard(item.syntax, `${section.category}-${i}`)} variant="ghost" size="sm" className="rounded-lg">{copiedIndex === `${section.category}-${i}` ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-muted-foreground" />}</Button></div>))}</CardContent>
              </Card>
            ))}
          </div>
        </div>
        <div className="lg:col-span-4 space-y-6 sticky top-24">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center gap-2"><Info className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">About Markdown</span></div>
            <CardContent className="p-6"><p className="text-xs text-muted-foreground leading-relaxed font-medium">Markdown is a lightweight markup language for creating formatted text using a plain-text editor. Click any syntax example to copy it.</p></CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
