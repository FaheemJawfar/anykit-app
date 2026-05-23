"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileJson, 
  Copy, 
  Check, 
  Trash2,
  Zap,
  AlertCircle,
  FileCode,
  Braces,
  Settings2,
  Code2
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function JSONToTypeScript() {
  const [input, setInput] = useState('{\n  "id": 1,\n  "name": "AnyKit App User",\n  "active": true,\n  "tags": ["developer", "utility"],\n  "profile": {\n    "bio": "Coding is life",\n    "followers": 1500\n  }\n}');
  const [output, setOutput] = useState("");
  const [interfaceName, setInterfaceName] = useState("RootObject");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const generateTypes = (json: any, name: string): string => {
    let result = `interface ${name} {\n`;
    const nestedInterfaces: string[] = [];

    const getTsType = (val: any, key: string): string => {
      if (val === null) return "any";
      const type = typeof val;
      if (type === "string") return "string";
      if (type === "number") return "number";
      if (type === "boolean") return "boolean";
      if (Array.isArray(val)) {
        if (val.length === 0) return "any[]";
        const innerType = getTsType(val[0], key);
        return `${innerType}[]`;
      }
      if (type === "object") {
        const subName = key.charAt(0).toUpperCase() + key.slice(1);
        nestedInterfaces.push(generateTypes(val, subName));
        return subName;
      }
      return "any";
    };

    for (const [key, value] of Object.entries(json)) {
      const tsType = getTsType(value, key);
      result += `  ${key}: ${tsType};\n`;
    }

    result += "}";
    return [...nestedInterfaces, result].join("\n\n");
  };

  useMemo(() => {
    setError(null);
    if (!input.trim()) {
      setOutput("");
      return;
    }
    try {
      const parsed = JSON.parse(input);
      const types = generateTypes(parsed, interfaceName || "RootObject");
      setOutput(types);
    } catch (e: any) {
      setError(e.message);
      setOutput("");
    }
  }, [input, interfaceName]);

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
          <Code2 className="w-6 h-6" />
        </div>
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight">JSON to TypeScript</h1>
          <p className="text-sm text-muted-foreground">
            Instantly generate TypeScript interfaces from your JSON data.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch h-[calc(100vh-300px)] min-h-[500px]">
        {/* Input Panel */}
        <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col">
          <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <FileJson className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">JSON Input</span>
            </div>
            <div className="flex items-center gap-4">
              <input 
                value={interfaceName}
                onChange={(e) => setInterfaceName(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))}
                placeholder="Interface Name"
                className="bg-background/50 border border-border/40 rounded-lg px-3 py-1 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary/20 w-32"
              />
              <Button variant="ghost" size="icon" onClick={() => setInput("")} className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <CardContent className="p-0 flex-1 relative">
            <Textarea
              placeholder="Paste JSON here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-full p-8 bg-transparent border-none focus-visible:ring-0 resize-none font-mono text-xs leading-relaxed"
            />
          </CardContent>
        </Card>

        {/* Output Panel */}
        <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col relative">
          <div className="px-8 py-6 border-b border-border/40 bg-primary/5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-primary">TypeScript Interfaces</span>
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
              {copied ? "Copied" : "Copy Code"}
            </Button>
          </div>
          
          <CardContent className="p-0 flex-1 relative bg-primary/[0.01]">
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
              <pre className="w-full h-full p-8 font-mono text-xs leading-relaxed overflow-auto whitespace-pre text-foreground/80 selection:bg-primary/20">
                {output || <span className="text-muted-foreground italic opacity-50">TypeScript code will appear here...</span>}
              </pre>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-4">
        <div className="flex items-center gap-2">
          <Settings2 className="w-4 h-4 text-primary" />
          <h3 className="font-bold text-xs uppercase tracking-wider text-primary">Generation Logic</h3>
        </div>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          This tool recursively analyzes your JSON structure to create optimized TypeScript interfaces. It automatically handles nested objects by creating separate interfaces and maps array types based on their contents.
        </p>
      </div>
    </div>
  );
}
