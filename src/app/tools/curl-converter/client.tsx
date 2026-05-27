"use client";

import { ToolLayout } from "@/components/tool-layout";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { 
  Terminal, 
  Copy, 
  Check, 
  Trash2,
  Zap,
  AlertCircle,
  FileCode,
  Settings2,
  Code
} from "lucide-react";
import { cn } from "@/lib/utils";
export default function CurlConverter() {
  const [input, setInput] = useState("curl 'https://api.example.com/v1/users' \\\n  -H 'Authorization: Bearer secret_token' \\\n  -H 'Content-Type: application/json' \\\n  --data-raw '{\"name\":\"Faheem\"}'");
  const [output, setOutput] = useState("");
  const [target, setTarget] = useState<"javascript" | "python">("javascript");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const convert = (val: string, lang: string) => {
    setInput(val);
    setError(null);
    if (!val.trim()) {
      setOutput("");
      return;
    }

    try {
      // Basic manual parser for common curl patterns
      const urlMatch = val.match(/curl\s+['"]?(https?:\/\/.*?)['" \s]/);
      const url = urlMatch ? urlMatch[1] : "https://api.example.com";
      
      const methodMatch = val.match(/-X\s+(\w+)/);
      const method = methodMatch ? methodMatch[1] : (val.includes('--data') || val.includes('-d') ? 'POST' : 'GET');

      const headers: Record<string, string> = {};
      const headerMatches = val.matchAll(/-H\s+['"](.*?): (.*?)['"]/g);
      for (const m of headerMatches) {
        headers[m[1]] = m[2];
      }

      const dataMatch = val.match(/--data(-raw)?\s+['"](\{.*?\})['"]/s);
      const data = dataMatch ? dataMatch[2] : null;

      if (lang === "javascript") {
        let code = `fetch("${url}", {\n`;
        code += `  method: "${method}",\n`;
        if (Object.keys(headers).length > 0) {
          code += `  headers: {\n`;
          Object.entries(headers).forEach(([k, v]) => {
            code += `    "${k}": "${v}",\n`;
          });
          code += `  },\n`;
        }
        if (data) {
          code += `  body: JSON.stringify(${data})\n`;
        }
        code += `});`;
        setOutput(code);
      } else {
        let code = `import requests\n\n`;
        code += `url = "${url}"\n`;
        if (Object.keys(headers).length > 0) {
          code += `headers = {\n`;
          Object.entries(headers).forEach(([k, v]) => {
            code += `    "${k}": "${v}",\n`;
          });
          code += `}\n`;
        }
        if (data) {
          code += `data = ${data}\n`;
          code += `response = requests.${method.toLowerCase()}(url, headers=headers, json=data)\n`;
        } else {
          code += `response = requests.${method.toLowerCase()}(url, headers=headers)\n`;
        }
        code += `print(response.json())`;
        setOutput(code);
      }
    } catch (e: any) {
      setError("Simplified parser failed. Please use a standard curl command.");
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
    <ToolLayout toolId="curl-converter">

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch h-[calc(100vh-300px)] min-h-[500px]">
        {/* Input Panel */}
        <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col">
          <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <Terminal className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Curl Command</span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => convert("", target)} className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          <CardContent className="p-0 flex-1 relative">
            <Textarea
              placeholder="Paste curl command here..."
              value={input}
              onChange={(e) => convert(e.target.value, target)}
              className="w-full h-full p-8 bg-transparent border-none focus-visible:ring-0 resize-none font-mono text-xs leading-relaxed"
            />
          </CardContent>
        </Card>

        {/* Output Panel */}
        <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col relative">
          <div className="px-8 py-6 border-b border-border/40 bg-primary/5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <Settings2 className="w-4 h-4 text-primary" />
              <select 
                value={target}
                onChange={(e) => {
                  setTarget(e.target.value as any);
                  convert(input, e.target.value);
                }}
                className="bg-transparent text-xs font-bold uppercase tracking-widest text-primary focus:outline-none cursor-pointer"
              >
                <option value="javascript">JavaScript (Fetch)</option>
                <option value="python">Python (Requests)</option>
              </select>
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
                  Convert Error
                </div>
                <div className="bg-destructive/10 p-4 rounded-xl border border-destructive/20 whitespace-pre-wrap leading-relaxed">
                  {error}
                </div>
              </div>
            ) : (
              <pre className="w-full h-full min-h-[400px] p-8 font-mono text-xs leading-relaxed overflow-auto whitespace-pre selection:bg-primary/20 text-foreground/80">
                {output || <span className="text-muted-foreground italic opacity-50">Converted code will appear here...</span>}
              </pre>
            )}
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
