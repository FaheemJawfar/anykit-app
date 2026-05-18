"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowRightLeft, 
  Copy, 
  Check, 
  Trash2,
  FileJson,
  FileCode,
  AlertCircle,
  Braces
} from "lucide-react";
import { cn } from "@/lib/utils";
import yaml from "js-yaml";

export default function JSONYAMLConverter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"json-to-yaml" | "yaml-to-json">("json-to-yaml");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const process = (val: string, currentMode: "json-to-yaml" | "yaml-to-json") => {
    setInput(val);
    setError(null);
    if (!val.trim()) {
      setOutput("");
      return;
    }

    try {
      if (currentMode === "json-to-yaml") {
        const obj = JSON.parse(val);
        setOutput(yaml.dump(obj, { indent: 2 }));
      } else {
        const obj = yaml.load(val);
        setOutput(JSON.stringify(obj, null, 2));
      }
    } catch (e: any) {
      setError(e.message);
      setOutput("");
    }
  };

  const toggleMode = () => {
    const newMode = mode === "json-to-yaml" ? "yaml-to-json" : "json-to-yaml";
    setMode(newMode);
    // Swap input and output for convenience
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

  const clear = () => {
    setInput("");
    setOutput("");
    setError(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
          <Braces className="w-6 h-6" />
        </div>
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight">JSON ↔ YAML Converter</h1>
          <p className="text-sm text-muted-foreground">
            Convert data between JSON and YAML formats with instant validation.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* Input Panel */}
        <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col min-h-[500px]">
          <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              {mode === "json-to-yaml" ? <FileJson className="w-4 h-4 text-primary" /> : <FileCode className="w-4 h-4 text-primary" />}
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                {mode === "json-to-yaml" ? "JSON Input" : "YAML Input"}
              </span>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={clear}
              className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          <CardContent className="p-0 flex-1 relative">
            <Textarea
              placeholder={mode === "json-to-yaml" ? 'Paste JSON here... e.g. {"name": "AnyKit"}' : 'Paste YAML here... e.g. name: AnyKit'}
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
              {mode === "json-to-yaml" ? <FileCode className="w-4 h-4 text-primary" /> : <FileJson className="w-4 h-4 text-primary" />}
              <span className="text-xs font-bold uppercase tracking-widest text-primary">
                {mode === "json-to-yaml" ? "YAML Result" : "JSON Result"}
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
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </>
              )}
            </Button>
          </div>
          <CardContent className="p-0 flex-1 relative">
            {error ? (
              <div className="p-8 h-full bg-destructive/5 text-destructive font-mono text-sm">
                <div className="flex items-center gap-2 mb-2 font-bold uppercase tracking-wider text-[10px]">
                  <AlertCircle className="w-3 h-3" />
                  Invalid {mode === "json-to-yaml" ? "JSON" : "YAML"} Format
                </div>
                <div className="bg-destructive/10 p-4 rounded-xl border border-destructive/20 whitespace-pre-wrap">
                  {error}
                </div>
              </div>
            ) : (
              <pre className="w-full h-full min-h-[400px] p-8 bg-primary/[0.02] font-mono text-sm leading-relaxed overflow-auto">
                {output || <span className="text-muted-foreground italic">Output will appear here...</span>}
              </pre>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="p-6 rounded-3xl bg-muted/30 border border-border/40">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">About the Formats</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <p className="text-xs font-bold text-foreground">JSON (JavaScript Object Notation)</p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              A lightweight data-interchange format that is easy for humans to read and write and easy for machines to parse and generate. Used widely in APIs.
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-bold text-foreground">YAML (YAML Ain't Markup Language)</p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              A human-friendly data serialization standard for all programming languages. It's commonly used for configuration files (like Docker, Kubernetes, etc.) because of its readability.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
