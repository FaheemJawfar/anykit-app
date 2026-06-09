"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Book, Copy, CheckCircle2, Hash, Type, List, Link as LinkIcon, Quote as QuoteIcon, Table as TableIcon, Code } from "lucide-react";

interface CheatsheetItem { category: string; icon: React.ReactNode; items: { name: string; syntax: string }[]; }

const cheatsheetData: CheatsheetItem[] = [
  { category: "Headers", icon: <Hash className="w-5 h-5" />, items: [{ name: "H1", syntax: "# Heading 1" }, { name: "H2", syntax: "## Heading 2" }, { name: "H3", syntax: "### Heading 3" }, { name: "H4", syntax: "#### Heading 4" }] },
  { category: "Text Formatting", icon: <Type className="w-5 h-5" />, items: [{ name: "Bold", syntax: "**bold text**" }, { name: "Italic", syntax: "*italic text*" }, { name: "Bold & Italic", syntax: "***bold and italic***" }, { name: "Strikethrough", syntax: "~~strikethrough~~" }] },
  { category: "Lists", icon: <List className="w-5 h-5" />, items: [{ name: "Unordered", syntax: "- Item" }, { name: "Ordered", syntax: "1. Item" }, { name: "Task List", syntax: "- [ ] Todo" }, { name: "Nested", syntax: "- Item\n  - Nested" }] },
  { category: "Links & Images", icon: <LinkIcon className="w-5 h-5" />, items: [{ name: "Link", syntax: "[Title](URL)" }, { name: "Image", syntax: "![Alt](URL)" }] },
  { category: "Code", icon: <Code className="w-5 h-5" />, items: [{ name: "Inline", syntax: "`code`" }, { name: "Block", syntax: "```lang\ncode\n```" }] },
  { category: "Blockquotes", icon: <QuoteIcon className="w-5 h-5" />, items: [{ name: "Quote", syntax: "> Quote" }, { name: "Nested", syntax: "> Quote\n>> Nested" }] },
  { category: "Tables", icon: <TableIcon className="w-5 h-5" />, items: [{ name: "Basic", syntax: "| A | B |\n|---|---|\n| 1 | 2 |" }, { name: "Aligned", syntax: "| L | C | R |\n|:--|:-:|--:|" }] },
];

export default function MarkdownCheatsheet() {
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const copyToClipboard = async (syntax: string, id: string) => { try { await navigator.clipboard.writeText(syntax); setCopiedIndex(id); setTimeout(() => setCopiedIndex(null), 2000); } catch (err) { console.error(err); } };

  return (
    <ToolLayout toolId="markdown-cheatsheet">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 lg:order-last space-y-6">
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">About Markdown</h3>
            <p className="text-xs text-muted-foreground leading-relaxed font-medium">Markdown is a lightweight markup language for creating formatted text using a plain-text editor. Click any syntax example to copy it.</p>
          </div>
        </div>
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cheatsheetData.map((section) => (
              <div key={section.category} className="bg-card rounded-[2rem] shadow-sm border border-border p-8">
                <div className="flex items-center gap-3 mb-6"><div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">{section.icon}</div><h3 className="text-lg font-black text-foreground">{section.category}</h3></div>
                <div className="space-y-3">{section.items.map((item, i) => (<div key={i} className="flex items-center justify-between p-3 bg-muted rounded-xl border border-border group hover:border-primary/30 transition-all"><code className="text-sm font-mono text-foreground">{item.syntax}</code><Button onClick={() => copyToClipboard(item.syntax, `${section.category}-${i}`)} variant="ghost" size="sm">{copiedIndex === `${section.category}-${i}` ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-muted-foreground" />}</Button></div>))}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
