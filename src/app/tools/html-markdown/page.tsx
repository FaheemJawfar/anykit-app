"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileCode, 
  Copy, 
  Check, 
  Trash2,
  Zap,
  ArrowRightLeft,
  FileText,
  RefreshCw,
  Search,
  Code
} from "lucide-react";
import { cn } from "@/lib/utils";
import TurndownService from "turndown";

export default function HTMLToMarkdown() {
  const [input, setInput] = useState("<h1>Welcome to AnyKit App</h1>\n<p>This is <strong>bold</strong> and this is <em>italic</em>.</p>\n<ul>\n  <li>Item 1</li>\n  <li>Item 2</li>\n</ul>");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const convert = (val: string) => {
    setInput(val);
    setError(null);
    if (!val.trim()) {
      setOutput("");
      return;
    }

    try {
      const turndownService = new TurndownService({
        headingStyle: 'atx',
        codeBlockStyle: 'fenced',
        bulletListMarker: '-'
      });
      const markdown = turndownService.turndown(val);
      setOutput(markdown);
    } catch (e: any) {
      setError("Failed to convert HTML. Please check your source code.");
      setOutput("");
    }
  };

  const copyToClipboard = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8 text-foreground">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
          <FileText className="w-6 h-6" />
        </div>
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight">HTML to Markdown</h1>
          <p className="text-sm text-muted-foreground">
            Convert standard HTML code into clean, readable Markdown syntax.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch h-[calc(100vh-300px)] min-h-[500px]">
        {/* Input Panel */}
        <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col">
          <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <FileCode className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">HTML Source</span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => convert("")} className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          <CardContent className="p-0 flex-1 relative">
            <Textarea
              placeholder="Paste your HTML code here..."
              value={input}
              onChange={(e) => convert(e.target.value)}
              className="w-full h-full p-8 bg-transparent border-none focus-visible:ring-0 resize-none font-mono text-sm leading-relaxed"
            />
          </CardContent>
        </Card>

        {/* Output Panel */}
        <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col relative">
          <div className="px-8 py-6 border-b border-border/40 bg-primary/5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Markdown Result</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyToClipboard}
              disabled={!output}
              className={cn(
                "rounded-xl font-bold px-4 hover:bg-primary/10 transition-all",
                copied && "text-green-500 hover:text-green-500"
              )}
            >
              {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
              {copied ? "Copied" : "Copy Result"}
            </Button>
          </div>
          
          <CardContent className="p-0 flex-1 relative bg-primary/[0.01]">
            <pre className="w-full h-full min-h-[400px] p-8 font-mono text-sm leading-relaxed overflow-auto whitespace-pre selection:bg-primary/20 text-foreground/80">
              {output || <span className="text-muted-foreground italic opacity-50">Markdown will appear here...</span>}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
