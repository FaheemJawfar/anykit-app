"use client";

import { ToolLayout } from "@/components/tool-layout";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { 
  Braces, 
  Copy, 
  Check, 
  Trash2,
  Zap,
  Info,
  ChevronRight,
  ChevronDown,
  FileJson,
  Search,
  Maximize2,
  Minimize2
} from "lucide-react";
import { cn } from "@/lib/utils";

const JsonTreeNode = ({ label, value, depth = 0 }: { label?: string; value: any; depth?: number }) => {
  const [isExpanded, setIsExpanded] = useState(depth < 2);
  const isObject = value !== null && typeof value === "object";
  const isArray = Array.isArray(value);

  const toggle = () => setIsExpanded(!isExpanded);

  if (!isObject) {
    return (
      <div className="flex items-center gap-2 py-1 px-2 rounded-lg hover:bg-muted/30 transition-colors">
        {label && <span className="text-primary/70 font-mono text-xs">{label}:</span>}
        <span className={cn(
          "font-mono text-xs",
          typeof value === "string" ? "text-green-600" : 
          typeof value === "number" ? "text-blue-600" : 
          typeof value === "boolean" ? "text-purple-600" : 
          "text-muted-foreground"
        )}>
          {typeof value === "string" ? `"${value}"` : String(value)}
        </span>
      </div>
    );
  }

  const entries = isArray ? value : Object.entries(value);
  const isEmpty = isArray ? value.length === 0 : entries.length === 0;

  return (
    <div className="space-y-1">
      <div 
        onClick={toggle}
        className="flex items-center gap-2 py-1 px-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-all group"
      >
        {!isEmpty ? (
          isExpanded ? <ChevronDown className="w-3 h-3 text-muted-foreground" /> : <ChevronRight className="w-3 h-3 text-muted-foreground" />
        ) : <div className="w-3" />}
        
        {label && <span className="text-primary/70 font-mono text-xs">{label}:</span>}
        <span className="text-muted-foreground font-mono text-xs opacity-60">
          {isArray ? `Array[${value.length}]` : `Object{${Object.keys(value).length}}`}
        </span>
      </div>
      
      {isExpanded && !isEmpty && (
        <div className="ml-4 pl-4 border-l border-border/40 space-y-1 animate-in fade-in slide-in-from-left-2 duration-200">
          {isArray ? (
            value.map((item: any, i: number) => (
              <JsonTreeNode key={i} label={String(i)} value={item} depth={depth + 1} />
            ))
          ) : (
            Object.entries(value).map(([key, val]) => (
              <JsonTreeNode key={key} label={key} value={val} depth={depth + 1} />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default function JSONViewer() {
  const [input, setInput] = useState('{\n  "name": "AnyKit App",\n  "version": "1.0.0",\n  "description": "Professional tool suite",\n  "features": [\n    "Fast",\n    "Secure",\n    "Client-side"\n  ],\n  "author": {\n    "name": "Faheem",\n    "active": true\n  }\n}');
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useMemo(() => {
    try {
      if (!input.trim()) {
        setData(null);
        setError(null);
        return;
      }
      const parsed = JSON.parse(input);
      setData(parsed);
      setError(null);
    } catch (e: any) {
      setError(e.message);
      setData(null);
    }
  }, [input]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(input);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clear = () => {
    setInput("");
    setData(null);
    setError(null);
  };

  return (
    <ToolLayout toolId="json-viewer">

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch h-[calc(100vh-250px)] min-h-[600px]">
        {/* Editor Side */}
        <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col">
          <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <Braces className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">JSON Editor</span>
            </div>
            <Button variant="ghost" size="icon" onClick={clear} className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          <CardContent className="p-0 flex-1 relative">
            <Textarea
              placeholder="Paste your JSON here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-full p-8 bg-transparent border-none focus-visible:ring-0 resize-none font-mono text-sm leading-relaxed"
            />
          </CardContent>
        </Card>

        {/* Viewer Side */}
        <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col relative">
          <div className="px-8 py-6 border-b border-border/40 bg-primary/5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Tree Preview</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyToClipboard}
              disabled={!input}
              className={cn(
                "rounded-xl font-bold px-4 hover:bg-primary/10 transition-all",
                copied && "text-green-500 hover:text-green-500"
              )}
            >
              {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
              {copied ? "Copied" : "Copy JSON"}
            </Button>
          </div>
          
          <CardContent className="p-8 flex-1 overflow-auto bg-primary/[0.01]">
            {error ? (
              <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
                  <Maximize2 className="w-8 h-8 rotate-45" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-destructive">Invalid JSON</h3>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
                    {error}
                  </p>
                </div>
              </div>
            ) : data ? (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <JsonTreeNode value={data} />
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center py-20 text-center opacity-30 gap-4">
                <Search className="w-12 h-12" />
                <p className="italic font-medium">Tree structure will appear here...</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
