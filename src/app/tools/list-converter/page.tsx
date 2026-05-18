"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { 
  ListOrdered, 
  Copy, 
  Check, 
  Trash2,
  Settings2,
  Zap,
  SortAsc,
  SortDesc,
  Filter,
  RefreshCw,
  Shuffle
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ListConverter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const processList = (text: string, action: string) => {
    const list = text.split('\n').filter(line => line.trim() !== '');
    let result = [...list];

    switch (action) {
      case 'sort-asc':
        result.sort((a, b) => a.localeCompare(b));
        break;
      case 'sort-desc':
        result.sort((a, b) => b.localeCompare(a));
        break;
      case 'unique':
        result = [...new Set(list)];
        break;
      case 'reverse':
        result.reverse();
        break;
      case 'shuffle':
        result = result.sort(() => Math.random() - 0.5);
        break;
      case 'trim':
        result = list.map(line => line.trim());
        break;
      case 'lowercase':
        result = list.map(line => line.toLowerCase());
        break;
      case 'uppercase':
        result = list.map(line => line.toUpperCase());
        break;
      default:
        break;
    }

    setOutput(result.join('\n'));
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

  const ActionButton = ({ icon: Icon, label, action }: { icon: any, label: string, action: string }) => (
    <Button
      variant="outline"
      size="sm"
      onClick={() => processList(input, action)}
      disabled={!input}
      className="flex-1 min-w-[120px] h-12 rounded-xl border-border/40 hover:bg-primary/5 hover:text-primary hover:border-primary/20 transition-all font-bold text-[10px] uppercase tracking-wider"
    >
      <Icon className="w-3.5 h-3.5 mr-2" />
      {label}
    </Button>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
          <ListOrdered className="w-6 h-6" />
        </div>
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight">List Converter</h1>
          <p className="text-sm text-muted-foreground">
            Sort, deduplicate, reverse, and clean up your text lists instantly.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input and Controls */}
        <div className="lg:col-span-12 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col">
              <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Settings2 className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Input List (one per line)</span>
                </div>
                <Button variant="ghost" size="icon" onClick={clear} className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <CardContent className="p-0">
                <Textarea
                  placeholder="Paste your list here..."
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    setOutput("");
                  }}
                  className="w-full h-[300px] p-8 bg-transparent border-none focus-visible:ring-0 resize-none font-mono text-sm leading-relaxed"
                />
              </CardContent>
            </Card>

            <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col">
              <div className="px-8 py-6 border-b border-border/40 bg-primary/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Zap className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold uppercase tracking-widest text-primary">Result</span>
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
              <CardContent className="p-0">
                <Textarea
                  readOnly
                  value={output}
                  placeholder="The processed list will appear here..."
                  className="w-full h-[300px] p-8 bg-primary/[0.01] border-none focus-visible:ring-0 resize-none font-mono text-sm leading-relaxed"
                />
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 bg-muted/20 p-4 rounded-3xl border border-border/40">
            <ActionButton icon={SortAsc} label="Sort A-Z" action="sort-asc" />
            <ActionButton icon={SortDesc} label="Sort Z-A" action="sort-desc" />
            <ActionButton icon={Filter} label="Unique" action="unique" />
            <ActionButton icon={RefreshCw} label="Reverse" action="reverse" />
            <ActionButton icon={Shuffle} label="Shuffle" action="shuffle" />
            <ActionButton icon={Zap} label="Trim" action="trim" />
            <ActionButton icon={SortAsc} label="Lower" action="lowercase" />
            <ActionButton icon={SortDesc} label="Upper" action="uppercase" />
          </div>
        </div>
      </div>
    </div>
  );
}
