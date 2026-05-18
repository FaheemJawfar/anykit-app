"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Code, 
  Copy, 
  Check, 
  ArrowRightLeft,
  Hash,
  FileCode,
  Zap,
  Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function HTMLEntities() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [copied, setCopied] = useState(false);

  const encode = (str: string) => {
    return str.replace(/[\u00A0-\u9999<>\&]/g, (i) => {
      return '&#' + i.charCodeAt(0) + ';';
    });
  };

  const decode = (str: string) => {
    const doc = new DOMParser().parseFromString(str, "text/html");
    return doc.documentElement.textContent || "";
  };

  const process = (val: string, currentMode: "encode" | "decode") => {
    setInput(val);
    if (!val) {
      setOutput("");
      return;
    }
    try {
      if (currentMode === "encode") {
        setOutput(encode(val));
      } else {
        setOutput(decode(val));
      }
    } catch (e) {
      setOutput("Error processing text");
    }
  };

  const toggleMode = () => {
    const newMode = mode === "encode" ? "decode" : "encode";
    setMode(newMode);
    process(input, newMode);
  };

  const copyToClipboard = () => {
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
          <h1 className="text-2xl font-bold tracking-tight">HTML Entities</h1>
          <p className="text-sm text-muted-foreground">
            Encode and decode HTML entities to prevent XSS or display special characters.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
        {/* Input Panel */}
        <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col min-h-[500px]">
          <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <FileCode className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                {mode === "encode" ? "Source Text" : "HTML Entities"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={clear}
                className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <CardContent className="p-0 flex-1 relative">
            <Textarea
              placeholder={mode === "encode" ? "Enter text to encode (e.g. <script>)" : "Enter entities to decode (e.g. &#60;)"}
              value={input}
              onChange={(e) => process(e.target.value, mode)}
              className="w-full h-full min-h-[400px] p-8 bg-transparent border-none focus-visible:ring-0 resize-none text-lg font-mono leading-relaxed"
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
              <Hash className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-primary">
                {mode === "encode" ? "Encoded Result" : "Decoded Result"}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyToClipboard}
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
          <CardContent className="p-0 flex-1">
            <div className="w-full h-full min-h-[400px] p-8 bg-primary/[0.02] text-lg font-mono leading-relaxed break-all whitespace-pre-wrap">
              {output || <span className="text-muted-foreground italic">Output will appear here...</span>}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-primary">Security Note</h3>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Encoding special characters as HTML entities is a key step in preventing Cross-Site Scripting (XSS) attacks by ensuring the browser interprets the characters as text, not as code.
          </p>
        </div>
        
        <div className="md:col-span-2 p-6 rounded-3xl bg-muted/30 border border-border/40 space-y-3">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-muted-foreground" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Common Entities</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            {[
              { char: '<', ent: '&lt;' },
              { char: '>', ent: '&gt;' },
              { char: '&', ent: '&amp;' },
              { char: '"', ent: '&quot;' },
            ].map((item) => (
              <div key={item.char} className="flex flex-col items-center p-2 rounded-xl bg-background/50 border border-border/20">
                <span className="text-lg font-bold">{item.char}</span>
                <span className="text-[10px] font-mono text-muted-foreground">{item.ent}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
