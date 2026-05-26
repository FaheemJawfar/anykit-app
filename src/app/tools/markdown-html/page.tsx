"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileText, 
  Copy, 
  Check, 
  Trash2,
  Eye,
  FileCode,
  Zap,
  Info,
  Maximize2,
  Minimize2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { ToolLayout } from "@/components/tool-layout";

export default function MarkdownToHTML() {
  const [input, setInput] = useState("# Welcome to AnyKit App\n\nThis is a **professional** Markdown to HTML converter.\n\n### Features:\n- Live Preview\n- XSS Sanitization\n- Code Highlighting support\n\n```javascript\nconsole.log('Hello World');\n```");
  const [html, setHtml] = useState("");
  const [previewMode, setPreviewMode] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const rawHtml = marked(input);
    const cleanHtml = DOMPurify.sanitize(rawHtml as string);
    setHtml(cleanHtml);
  }, [input]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clear = () => {
    setInput("");
  };

  return (
    <ToolLayout toolId="markdown-html">
      <div className={cn(
        "space-y-8 transition-all duration-300 relative",
        isFullscreen && "fixed inset-0 bg-background z-50 p-8 overflow-auto"
      )}>
        {/* Fullscreen Button Toggle */}
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="rounded-xl h-12 w-12 text-muted-foreground hover:text-primary"
          >
            {isFullscreen ? <Minimize2 className="w-6 h-6" /> : <Maximize2 className="w-6 h-6" />}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-250px)] min-h-[500px]">
        {/* Editor Panel */}
        <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col">
          <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <FileCode className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Markdown Editor</span>
            </div>
            <Button variant="ghost" size="icon" onClick={clear} className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          <CardContent className="p-0 flex-1">
            <Textarea
              placeholder="Start typing markdown here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-full p-8 bg-transparent border-none focus-visible:ring-0 resize-none font-mono text-sm leading-relaxed"
            />
          </CardContent>
        </Card>

        {/* Preview Panel */}
        <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col">
          <div className="px-8 py-6 border-b border-border/40 bg-primary/5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 p-1 bg-muted/50 rounded-xl border border-border/40">
              <Button
                variant={previewMode === "preview" ? "default" : "ghost"}
                size="sm"
                onClick={() => setPreviewMode("preview")}
                className={cn("rounded-lg h-8 text-[10px] font-bold uppercase tracking-wider", previewMode === "preview" && "shadow-md")}
              >
                <Eye className="w-3.5 h-3.5 mr-2" />
                Preview
              </Button>
              <Button
                variant={previewMode === "code" ? "default" : "ghost"}
                size="sm"
                onClick={() => setPreviewMode("code")}
                className={cn("rounded-lg h-8 text-[10px] font-bold uppercase tracking-wider", previewMode === "code" && "shadow-md")}
              >
                <FileCode className="w-3.5 h-3.5 mr-2" />
                HTML Code
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyToClipboard}
              disabled={!html}
              className={cn(
                "rounded-xl font-bold px-4 hover:bg-primary/10 transition-all",
                copied && "text-green-500 hover:text-green-500"
              )}
            >
              {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
              {copied ? "Copied" : "Copy HTML"}
            </Button>
          </div>
          <CardContent className="p-0 flex-1 overflow-auto bg-primary/[0.01]">
            {previewMode === "preview" ? (
              <div 
                className="p-8 prose prose-sm dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            ) : (
              <pre className="p-8 font-mono text-xs leading-relaxed whitespace-pre-wrap break-all">
                {html || <span className="text-muted-foreground italic">HTML will appear here...</span>}
              </pre>
            )}
          </CardContent>
        </Card>
      </div>

      {!isFullscreen && (
        <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-primary">Pro Tip</h3>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            All HTML output is passed through <strong>DOMPurify</strong> to remove any potentially dangerous scripts (XSS protection). This ensures the code is safe to embed in your own projects.
          </p>
        </div>
      )}
      </div>
    </ToolLayout>
  );
}
