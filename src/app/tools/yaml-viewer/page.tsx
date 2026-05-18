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
  Settings2,
  Zap,
  AlignLeft,
  AlertCircle,
  Eye
} from "lucide-react";
import { cn } from "@/lib/utils";
import yaml from "js-yaml";

export default function YAMLViewer() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [indent, setIndent] = useState("2");
  const [sortKeys, setSortKeys] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const process = (val: string, spaces: string, sort: boolean) => {
    setInput(val);
    setError(null);
    if (!val.trim()) {
      setOutput("");
      return;
    }

    try {
      const obj = yaml.load(val);
      const formatted = yaml.dump(obj, {
        indent: parseInt(spaces),
        sortKeys: sort,
        noRefs: true,
      });
      setOutput(formatted);
    } catch (e: any) {
      setError(e.message);
      setOutput("");
    }
  };

  const copyToClipboard = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clear = () => {
    setInput("");
    setOutput("");
    setError(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
          <Eye className="w-6 h-6" />
        </div>
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight">YAML Viewer & Formatter</h1>
          <p className="text-sm text-muted-foreground">
            Format, beautify, and sort your YAML data for better readability.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input and Settings */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <div className="px-8 py-6 border-b border-border/40 bg-muted/30 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Settings2 className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Indentation</span>
                </div>
                <select 
                  value={indent} 
                  onChange={(e) => {
                    setIndent(e.target.value);
                    process(input, e.target.value, sortKeys);
                  }}
                  className="bg-transparent text-xs font-bold uppercase tracking-wider focus:outline-none cursor-pointer text-primary"
                >
                  <option value="2">2 Spaces</option>
                  <option value="4">4 Spaces</option>
                  <option value="8">8 Spaces</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Zap className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Sort Keys</span>
                </div>
                <Button
                  variant={sortKeys ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setSortKeys(!sortKeys);
                    process(input, indent, !sortKeys);
                  }}
                  className="rounded-xl h-8 font-bold text-[10px] uppercase"
                >
                  {sortKeys ? "Enabled" : "Disabled"}
                </Button>
              </div>
            </div>
            <CardContent className="p-0">
              <Textarea
                placeholder="Paste your raw YAML here..."
                value={input}
                onChange={(e) => process(e.target.value, indent, sortKeys)}
                className="w-full h-[400px] p-8 bg-transparent border-none focus-visible:ring-0 resize-none font-mono text-sm leading-relaxed"
              />
              <div className="p-4 bg-muted/20 border-t border-border/40 flex justify-end">
                <Button variant="ghost" size="sm" onClick={clear} className="rounded-xl font-bold h-10 px-4">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear Input
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Formatted Output */}
        <div className="lg:col-span-7 h-full">
          <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col h-full min-h-[550px]">
            <div className="px-8 py-6 border-b border-border/40 bg-primary/5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <AlignLeft className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-primary">Beautified YAML</span>
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
              {error ? (
                <div className="p-8 h-full bg-destructive/5 text-destructive font-mono text-sm space-y-4">
                  <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-[10px]">
                    <AlertCircle className="w-3 h-3" />
                    YAML Parse Error
                  </div>
                  <div className="bg-destructive/10 p-4 rounded-xl border border-destructive/20 whitespace-pre-wrap leading-relaxed">
                    {error}
                  </div>
                </div>
              ) : (
                <pre className="w-full h-full min-h-[400px] p-8 bg-primary/[0.02] font-mono text-sm leading-relaxed overflow-auto whitespace-pre">
                  {output || <span className="text-muted-foreground italic">Formatted YAML will appear here...</span>}
                </pre>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
