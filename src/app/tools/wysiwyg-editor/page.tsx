"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Quote, 
  Link, 
  Code, 
  Undo, 
  Redo,
  Trash2,
  Copy,
  Check,
  Zap,
  Eye,
  FileCode,
  Heading1,
  Heading2,
  AlignLeft,
  AlignCenter,
  AlignRight
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function HTMLEditor() {
  const [html, setHtml] = useState("<h1>Welcome to AnyKit App Editor</h1><p>Start typing here to create beautiful HTML content.</p>");
  const [mode, setMode] = useState<"edit" | "code">("edit");
  const [copied, setCopied] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  const execCommand = (command: string, value: string = "") => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      setHtml(editorRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      setHtml(editorRef.current.innerHTML);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const ToolbarButton = ({ icon: Icon, onClick, title, active = false }: { icon: any, onClick: () => void, title: string, active?: boolean }) => (
    <Button
      variant={active ? "default" : "ghost"}
      size="icon"
      onClick={onClick}
      title={title}
      className={cn(
        "h-9 w-9 rounded-lg transition-all",
        active ? "bg-primary text-white shadow-md" : "text-muted-foreground hover:text-primary hover:bg-primary/5"
      )}
    >
      <Icon className="w-4 h-4" />
    </Button>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
          <FileCode className="w-6 h-6" />
        </div>
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight">WYSIWYG HTML Editor</h1>
          <p className="text-sm text-muted-foreground">
            A professional rich-text editor that generates clean, semantic HTML code.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col min-h-[600px]">
          {/* Toolbar */}
          <div className="px-8 py-4 border-b border-border/40 bg-muted/30 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 p-1 bg-background/50 rounded-xl border border-border/20">
              <ToolbarButton icon={Undo} onClick={() => execCommand("undo")} title="Undo" />
              <ToolbarButton icon={Redo} onClick={() => execCommand("redo")} title="Redo" />
              <div className="w-px h-6 bg-border/40 mx-1" />
              <ToolbarButton icon={Bold} onClick={() => execCommand("bold")} title="Bold" />
              <ToolbarButton icon={Italic} onClick={() => execCommand("italic")} title="Italic" />
              <div className="w-px h-6 bg-border/40 mx-1" />
              <ToolbarButton icon={Heading1} onClick={() => execCommand("formatBlock", "H1")} title="Heading 1" />
              <ToolbarButton icon={Heading2} onClick={() => execCommand("formatBlock", "H2")} title="Heading 2" />
              <div className="w-px h-6 bg-border/40 mx-1" />
              <ToolbarButton icon={AlignLeft} onClick={() => execCommand("justifyLeft")} title="Align Left" />
              <ToolbarButton icon={AlignCenter} onClick={() => execCommand("justifyCenter")} title="Align Center" />
              <ToolbarButton icon={AlignRight} onClick={() => execCommand("justifyRight")} title="Align Right" />
              <div className="w-px h-6 bg-border/40 mx-1" />
              <ToolbarButton icon={List} onClick={() => execCommand("insertUnorderedList")} title="Bullet List" />
              <ToolbarButton icon={ListOrdered} onClick={() => execCommand("insertOrderedList")} title="Numbered List" />
              <ToolbarButton icon={Quote} onClick={() => execCommand("formatBlock", "BLOCKQUOTE")} title="Quote" />
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 p-1 bg-primary/5 rounded-xl border border-primary/10">
                <Button
                  variant={mode === "edit" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setMode("edit")}
                  className={cn("rounded-lg h-8 text-[10px] font-bold uppercase tracking-wider", mode === "edit" && "shadow-md")}
                >
                  <Eye className="w-3.5 h-3.5 mr-2" />
                  Editor
                </Button>
                <Button
                  variant={mode === "code" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setMode("code")}
                  className={cn("rounded-lg h-8 text-[10px] font-bold uppercase tracking-wider", mode === "code" && "shadow-md")}
                >
                  <FileCode className="w-3.5 h-3.5 mr-2" />
                  HTML Source
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyToClipboard}
                className={cn(
                  "rounded-xl font-bold h-10 px-4 hover:bg-primary/10 transition-all",
                  copied && "text-green-500 hover:text-green-500"
                )}
              >
                {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied ? "Copied" : "Copy HTML"}
              </Button>
            </div>
          </div>

          <CardContent className="p-0 flex-1 relative flex flex-col">
            {mode === "edit" ? (
              <div 
                ref={editorRef}
                contentEditable
                onInput={handleInput}
                className="flex-1 p-12 focus:outline-none prose prose-lg dark:prose-invert max-w-none overflow-auto"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            ) : (
              <textarea
                value={html}
                onChange={(e) => {
                  setHtml(e.target.value);
                }}
                className="flex-1 p-12 bg-primary/[0.02] font-mono text-sm leading-relaxed resize-none focus:outline-none"
                placeholder="HTML Source Code..."
              />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="p-8 rounded-[2.5rem] bg-primary/5 border border-primary/10 flex items-start gap-6">
        <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
          <Zap className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-primary">Pro Tip</h3>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
            This editor generates standard semantic HTML. You can switch to the <strong>HTML Source</strong> tab at any time to manually tweak the code or paste existing HTML to edit it visually.
          </p>
        </div>
      </div>
    </div>
  );
}
