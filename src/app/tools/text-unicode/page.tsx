"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { 
  Type, 
  Copy, 
  Check, 
  Trash2,
  Zap,
  Info,
  RefreshCw,
  Search,
  Code,
  Globe,
  Terminal,
  FileCode
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function TextUnicodeConverter() {
  const [input, setInput] = useState("AnyKit 🚀");
  const [copied, setCopied] = useState<string | null>(null);

  const formats = {
    hex: (str: string) => str.split('').map(c => `\\u${c.charCodeAt(0).toString(16).padStart(4, '0')}`).join(''),
    dec: (str: string) => str.split('').map(c => `&#${c.charCodeAt(0)};`).join(''),
    css: (str: string) => str.split('').map(c => `\\${c.charCodeAt(0).toString(16).padStart(4, '0')}`).join(''),
    js: (str: string) => Array.from(str).map(c => `\\u{${c.codePointAt(0)?.toString(16)}}`).join('')
  };

  const copy = (val: string, id: string) => {
    navigator.clipboard.writeText(val);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const ResultCard = ({ label, value, id, icon: Icon }: { label: string, value: string, id: string, icon: any }) => (
    <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-3xl overflow-hidden transition-all hover:shadow-2xl hover:shadow-primary/10">
      <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="w-3.5 h-3.5 text-primary" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</span>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => copy(value, id)}
          className="h-7 px-3 rounded-lg font-bold text-[10px] uppercase hover:bg-primary/10"
        >
          {copied === id ? <Check className="w-3 h-3 mr-2" /> : <Copy className="w-3 h-3 mr-2" />}
          {copied === id ? "Copied" : "Copy"}
        </Button>
      </div>
      <CardContent className="p-6">
        <pre className="text-sm font-mono font-bold text-foreground/80 break-all whitespace-pre-wrap leading-relaxed">
          {value || <span className="text-muted-foreground italic font-normal opacity-50">Result will appear here...</span>}
        </pre>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
          <Code className="w-6 h-6" />
        </div>
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight">Text to Unicode</h1>
          <p className="text-sm text-muted-foreground">
            Convert text to Unicode escape sequences, HTML entities, and CSS escapes.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Editor Side */}
        <div className="lg:col-span-12 space-y-8">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col">
            <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Type className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Original Text</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setInput("")} className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <CardContent className="p-0">
              <Textarea
                placeholder="Enter text to convert... (emojis supported)"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full h-32 p-8 bg-transparent border-none focus-visible:ring-0 resize-none font-sans text-3xl font-black tracking-tight leading-relaxed"
              />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ResultCard label="Unicode Hex (\uXXXX)" value={formats.hex(input)} id="hex" icon={Terminal} />
            <ResultCard label="HTML Decimal (&#D;)" value={formats.dec(input)} id="dec" icon={Globe} />
            <ResultCard label="CSS Escape (\XXXX)" value={formats.css(input)} id="css" icon={FileCode} />
            <ResultCard label="JS ES6 Escape (\u{X})" value={formats.js(input)} id="js" icon={Zap} />
          </div>
        </div>
      </div>

      <div className="p-8 rounded-[2.5rem] bg-primary/5 border border-primary/10 flex items-start gap-6">
        <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
          <Info className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-primary">Encoding Reference</h3>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
            Unicode characters are often represented in code via escape sequences. <strong>\uXXXX</strong> is standard in most languages (C, Java, Python), <strong>{"&#...;"}</strong> is used for HTML rendering, and <strong>{"\\u{...}"}</strong> is the modern ES6 JavaScript format that supports characters beyond the basic plane (like modern emojis).
          </p>
        </div>
      </div>
    </div>
  );
}
