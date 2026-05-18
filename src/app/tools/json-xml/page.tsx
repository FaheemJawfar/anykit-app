"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { 
  Braces, 
  Copy, 
  Check, 
  Trash2,
  ArrowRightLeft,
  FileJson,
  FileCode,
  Zap,
  AlertCircle,
  Code
} from "lucide-react";
import { cn } from "@/lib/utils";
import convert from "xml-js";

export default function JSONXMLConverter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"json-to-xml" | "xml-to-json">("json-to-xml");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const process = (val: string, currentMode: "json-to-xml" | "xml-to-json") => {
    setInput(val);
    setError(null);
    if (!val.trim()) {
      setOutput("");
      return;
    }

    try {
      if (currentMode === "json-to-xml") {
        const json = val; // xml-js can take json string or object
        const result = convert.json2xml(json, { compact: true, spaces: 2 });
        setOutput(result);
      } else {
        const result = convert.xml2json(val, { compact: true, spaces: 2 });
        setOutput(result);
      }
    } catch (e: any) {
      setError(e.message);
      setOutput("");
    }
  };

  const toggleMode = () => {
    const newMode = mode === "json-to-xml" ? "xml-to-json" : "json-to-xml";
    setMode(newMode);
    if (output) {
      const oldOutput = output;
      setInput(oldOutput);
      process(oldOutput, newMode);
    } else {
      process(input, newMode);
    }
  };

  const copyToClipboard = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
          <Code className="w-6 h-6" />
        </div>
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight">JSON ↔ XML Converter</h1>
          <p className="text-sm text-muted-foreground">
            Convert data between JSON and XML formats with customizable options.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* Input Panel */}
        <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col min-h-[500px]">
          <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              {mode === "json-to-xml" ? <FileJson className="w-4 h-4 text-primary" /> : <FileCode className="w-4 h-4 text-primary" />}
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                {mode === "json-to-xml" ? "JSON Input" : "XML Input"}
              </span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => process("", mode)} className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          <CardContent className="p-0 flex-1 relative">
            <Textarea
              placeholder={mode === "json-to-xml" ? '{\n  "note": {\n    "to": "Tove",\n    "from": "Jani",\n    "heading": "Reminder",\n    "body": "Don\'t forget me this weekend!"\n  }\n}' : '<note>\n  <to>Tove</to>\n  <from>Jani</from>\n  <heading>Reminder</heading>\n  <body>Don\'t forget me this weekend!</body>\n</note>'}
              value={input}
              onChange={(e) => process(e.target.value, mode)}
              className="w-full h-full min-h-[400px] p-8 bg-transparent border-none focus-visible:ring-0 resize-none font-mono text-sm leading-relaxed"
            />
          </CardContent>
        </Card>

        {/* Output Panel */}
        <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col min-h-[500px] relative">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden lg:block">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={toggleMode}
              className="w-12 h-12 rounded-full bg-background border-border/40 text-muted-foreground shadow-xl hover:text-primary hover:border-primary/20 transition-all hover:scale-110 active:scale-95"
            >
              <ArrowRightLeft className="w-5 h-5" />
            </Button>
          </div>

          <div className="px-8 py-6 border-b border-border/40 bg-primary/5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              {mode === "json-to-xml" ? <FileCode className="w-4 h-4 text-primary" /> : <FileJson className="w-4 h-4 text-primary" />}
              <span className="text-xs font-bold uppercase tracking-widest text-primary">
                {mode === "json-to-xml" ? "XML Result" : "JSON Result"}
              </span>
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
          <CardContent className="p-0 flex-1 relative">
            {error ? (
              <div className="p-8 h-full bg-destructive/5 text-destructive font-mono text-sm space-y-4">
                <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-[10px]">
                  <AlertCircle className="w-3 h-3" />
                  Format Error
                </div>
                <div className="bg-destructive/10 p-4 rounded-xl border border-destructive/20 whitespace-pre-wrap leading-relaxed">
                  {error}
                </div>
              </div>
            ) : (
              <pre className="w-full h-full min-h-[400px] p-8 bg-primary/[0.02] font-mono text-sm leading-relaxed overflow-auto whitespace-pre">
                {output || <span className="text-muted-foreground italic">Converted data will appear here...</span>}
              </pre>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-4">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary" />
          <h3 className="font-bold text-xs uppercase tracking-wider text-primary">Conversion Note</h3>
        </div>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          This tool uses a <strong>compact</strong> mapping strategy. Attributes are prefixed with `_attributes`, and text nodes use `_text`. This ensures a predictable structure when converting bidirectionally.
        </p>
      </div>
    </div>
  );
}
