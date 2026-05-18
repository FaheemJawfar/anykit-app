"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { 
  Code, 
  Copy, 
  Check, 
  Trash2,
  Settings2,
  FileCode,
  Zap,
  AlignLeft,
  Braces
} from "lucide-react";
import { cn } from "@/lib/utils";
import format from "xml-formatter";

export default function XMLFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [indent, setIndent] = useState("2");
  const [copied, setCopied] = useState(false);

  const process = (val: string, spaces: string) => {
    setInput(val);
    if (!val.trim()) {
      setOutput("");
      return;
    }

    try {
      const formatted = format(val, {
        indentation: " ".repeat(parseInt(spaces)),
        collapseContent: true,
      });
      setOutput(formatted);
    } catch (e) {
      setOutput("Error formatting XML. Please check your syntax.");
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
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
          <Code className="w-6 h-6" />
        </div>
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight">XML Formatter</h1>
          <p className="text-sm text-muted-foreground">
            Format and beautify your XML data for better readability.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input and Settings */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Settings2 className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Indentation</span>
              </div>
              <select 
                value={indent} 
                onChange={(e) => {
                  setIndent(e.target.value);
                  process(input, e.target.value);
                }}
                className="bg-transparent text-xs font-bold uppercase tracking-wider focus:outline-none cursor-pointer text-primary"
              >
                <option value="2">2 Spaces</option>
                <option value="4">4 Spaces</option>
                <option value="8">8 Spaces</option>
              </select>
            </div>
            <CardContent className="p-0">
              <Textarea
                placeholder="Paste your raw XML here..."
                value={input}
                onChange={(e) => process(e.target.value, indent)}
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

          <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-primary">Pro Tip</h3>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              This tool automatically collapses whitespace and preserves comments while applying your chosen indentation level.
            </p>
          </div>
        </div>

        {/* Right Column: Formatted Output */}
        <div className="lg:col-span-7 h-full">
          <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col h-full min-h-[550px]">
            <div className="px-8 py-6 border-b border-border/40 bg-primary/5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <AlignLeft className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-primary">Beautified XML</span>
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
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Result
                  </>
                )}
              </Button>
            </div>
            <CardContent className="p-0 flex-1 overflow-auto bg-primary/[0.01]">
              <div className="p-8 font-mono text-xs leading-loose whitespace-pre tabular-nums">
                {output || <span className="text-muted-foreground italic">Formatted XML will appear here...</span>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
