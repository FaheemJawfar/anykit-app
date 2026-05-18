"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Type, 
  Copy, 
  Check, 
  Eraser, 
  ArrowDown01,
  FileCode,
  Languages,
  RefreshCcw
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function CaseConverter() {
  const [input, setInput] = useState("");
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const convertCase = (type: string) => {
    if (!input.trim()) return "";
    switch (type) {
      case "uppercase":
        return input.toUpperCase();
      case "lowercase":
        return input.toLowerCase();
      case "title":
        return input
          .toLowerCase()
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
      case "sentence":
        return input
          .toLowerCase()
          .replace(/(^\s*\w|[.!?]\s+\w)/g, (c) => c.toUpperCase());
      case "camel":
        return input
          .toLowerCase()
          .split(/[\s_-]+/)
          .map((word, index) => 
            index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
          )
          .join("");
      case "pascal":
        return input
          .toLowerCase()
          .split(/[\s_-]+/)
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join("");
      case "snake":
        return input
          .toLowerCase()
          .split(/[\s-]+/)
          .join("_");
      case "kebab":
        return input
          .toLowerCase()
          .split(/[\s_]+/)
          .join("-");
      default:
        return input;
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const conversions = [
    { label: "Sentence Case", type: "sentence", group: "standard" },
    { label: "Title Case", type: "title", group: "standard" },
    { label: "UPPERCASE", type: "uppercase", group: "standard" },
    { label: "lowercase", type: "lowercase", group: "standard" },
    { label: "camelCase", type: "camel", group: "developer" },
    { label: "PascalCase", type: "pascal", group: "developer" },
    { label: "snake_case", type: "snake", group: "developer" },
    { label: "kebab-case", type: "kebab", group: "developer" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
          <Type className="w-6 h-6" />
        </div>
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight">Case Converter</h1>
          <p className="text-sm text-muted-foreground">
            Instantly transform text between different letter cases and formats.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-12 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2rem] overflow-hidden">
            <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Languages className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Text to Convert</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 rounded-lg hover:text-red-500 font-bold" 
                onClick={() => setInput("")}
                disabled={!input}
              >
                <Eraser className="w-3.5 h-3.5 mr-2" />
                Clear
              </Button>
            </div>
            <CardContent className="p-0">
              <Textarea
                placeholder="Type or paste your text here..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[200px] p-8 bg-transparent border-none focus-visible:ring-0 resize-none text-lg leading-relaxed placeholder:text-muted-foreground/30"
              />
            </CardContent>
          </Card>

          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 px-1">
                <ArrowDown01 className="w-4 h-4 text-primary" />
                <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Standard Formats</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {conversions.filter(c => c.group === "standard").map((conv) => (
                  <Card key={conv.type} className="border-border/40 shadow-lg shadow-primary/5 bg-card/50 backdrop-blur-sm rounded-2xl overflow-hidden group">
                    <CardContent className="p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{conv.label}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className={cn("h-7 w-7 rounded-lg", copiedType === conv.type && "text-green-500")}
                          onClick={() => copyToClipboard(convertCase(conv.type), conv.type)}
                          disabled={!input}
                        >
                          {copiedType === conv.type ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        </Button>
                      </div>
                      <div className="bg-muted/30 rounded-xl p-3 min-h-[60px] flex items-center border border-transparent group-hover:border-primary/10 transition-colors">
                        <p className="text-sm font-medium line-clamp-2 break-all">
                          {convertCase(conv.type) || <span className="opacity-20 italic">Waiting...</span>}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 px-1">
                <FileCode className="w-4 h-4 text-primary" />
                <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Developer Formats</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {conversions.filter(c => c.group === "developer").map((conv) => (
                  <Card key={conv.type} className="border-border/40 shadow-lg shadow-primary/5 bg-card/50 backdrop-blur-sm rounded-2xl overflow-hidden group">
                    <CardContent className="p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground font-mono">{conv.label}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className={cn("h-7 w-7 rounded-lg", copiedType === conv.type && "text-green-500")}
                          onClick={() => copyToClipboard(convertCase(conv.type), conv.type)}
                          disabled={!input}
                        >
                          {copiedType === conv.type ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        </Button>
                      </div>
                      <div className="bg-muted/30 rounded-xl p-3 min-h-[60px] flex items-center border border-transparent group-hover:border-primary/10 transition-colors">
                        <p className="text-sm font-mono break-all line-clamp-2">
                          {convertCase(conv.type) || <span className="opacity-20 italic">Waiting...</span>}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

