"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { 
  Link2, 
  Copy, 
  Check, 
  Trash2,
  Zap,
  Settings2,
  Type,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function SlugifyString() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const slugify = (text: string) => {
    setInput(text);
    if (!text.trim()) {
      setOutput("");
      return;
    }

    const result = text
      .toString()
      .normalize('NFD')                   // split accented characters into their base characters and diacritical marks
      .replace(/[\u0300-\u036f]/g, '')     // remove all the accents, which happen to be all in the \u03xx UNICODE block.
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')                // replace spaces with -
      .replace(/[^\w-]+/g, '')             // remove all non-word chars
      .replace(/--+/g, '-');               // replace multiple - with single -

    setOutput(result);
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
          <Link2 className="w-6 h-6" />
        </div>
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight">Slugify String</h1>
          <p className="text-sm text-muted-foreground">
            Convert any text into a URL-friendly slug with one click.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Input Panel */}
        <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col min-h-[400px]">
          <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <Type className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Original Text</span>
            </div>
            <Button variant="ghost" size="icon" onClick={clear} className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          <CardContent className="p-0 flex-1 relative">
            <Textarea
              placeholder="Enter your title or text here... e.g. How to use AnyKit for FREE!"
              value={input}
              onChange={(e) => slugify(e.target.value)}
              className="w-full h-full min-h-[300px] p-8 bg-transparent border-none focus-visible:ring-0 resize-none font-sans text-lg leading-relaxed"
            />
          </CardContent>
        </Card>

        {/* Output Panel */}
        <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col min-h-[400px] relative">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden lg:block">
            <div className="w-12 h-12 rounded-full bg-background border-border/40 flex items-center justify-center text-muted-foreground shadow-xl">
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>

          <div className="px-8 py-6 border-b border-border/40 bg-primary/5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <Link2 className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Slugified URL</span>
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
              {copied ? "Copied" : "Copy Slug"}
            </Button>
          </div>
          <CardContent className="p-8 flex-1 flex items-center justify-center">
            <div className="w-full">
              <div className={cn(
                "w-full p-8 rounded-2xl border font-mono text-xl transition-all break-all text-center",
                output ? "bg-primary/5 border-primary/20 text-primary font-bold" : "bg-muted/10 border-dashed border-border/20 text-muted-foreground italic"
              )}>
                {output || "waiting-for-input"}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-4">
        <div className="flex items-center gap-2">
          <Settings2 className="w-4 h-4 text-primary" />
          <h3 className="font-bold text-xs uppercase tracking-wider text-primary">Rules Applied</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary/40" /> Lowercase conversion</div>
          <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary/40" /> Spaces to dashes</div>
          <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary/40" /> Remove special chars</div>
          <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary/40" /> Accent normalization</div>
        </div>
      </div>
    </div>
  );
}
