"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { 
  Hash, 
  Type, 
  FileText, 
  Timer, 
  MousePointer2, 
  Eraser, 
  Copy, 
  Check,
  Languages,
  AlignLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function WordCounter() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState({
    words: 0,
    characters: 0,
    charactersNoSpaces: 0,
    lines: 0,
    paragraphs: 0,
    sentences: 0,
    readingTime: 0,
  });

  useEffect(() => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, "").length;
    const lines = text ? text.split("\n").filter(l => l.trim()).length : 0;
    const paragraphs = text ? text.split(/\n\n+/).filter(p => p.trim()).length : 0;
    const sentences = text ? text.split(/[.!?]+/).filter(s => s.trim()).length : 0;
    const readingTime = Math.ceil(words / 200);

    setStats({
      words,
      characters,
      charactersNoSpaces,
      lines,
      paragraphs,
      sentences,
      readingTime,
    });
  }, [text]);

  const copyToClipboard = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statItems = [
    { label: "Words", value: stats.words, icon: FileText, color: "text-blue-500" },
    { label: "Characters", value: stats.characters, icon: Type, color: "text-indigo-500" },
    { label: "Sentences", value: stats.sentences, icon: AlignLeft, color: "text-emerald-500" },
    { label: "Paragraphs", value: stats.paragraphs, icon: Languages, color: "text-orange-500" },
    { label: "Reading Time", value: `${stats.readingTime} min`, icon: Timer, color: "text-rose-500" },
    { label: "No Spaces", value: stats.charactersNoSpaces, icon: MousePointer2, color: "text-amber-500" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
          <Hash className="w-6 h-6" />
        </div>
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight">Word Counter</h1>
          <p className="text-sm text-muted-foreground">
            Analyze your text with real-time statistics and reading time.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-4">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2rem] overflow-hidden">
            <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/20" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                  <div className="w-3 h-3 rounded-full bg-green-500/20" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-2">Text Input</span>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={cn("h-8 rounded-lg font-bold gap-2", copied && "text-green-500")}
                  onClick={copyToClipboard}
                  disabled={!text}
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-lg hover:text-red-500" 
                  onClick={() => setText("")}
                  disabled={!text}
                >
                  <Eraser className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
            <CardContent className="p-0">
              <Textarea
                placeholder="Start typing or paste your text here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-[500px] p-8 bg-transparent border-none focus-visible:ring-0 resize-none font-mono text-sm leading-relaxed"
              />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-4 sticky top-24">
          <div className="grid grid-cols-2 gap-4">
            {statItems.map((item) => (
              <Card key={item.label} className="border-border/40 shadow-lg shadow-primary/5 bg-card/50 backdrop-blur-sm rounded-2xl overflow-hidden">
                <CardContent className="p-4 space-y-3">
                  <div className={cn("w-8 h-8 rounded-lg bg-current/10 flex items-center justify-center", item.color)}>
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{item.label}</p>
                    <p className="text-xl font-bold tracking-tight">{item.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-primary/[0.02] rounded-3xl overflow-hidden">
            <CardContent className="p-6">
              <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
                <AlignLeft className="w-4 h-4 text-primary" />
                Quick Tips
              </h3>
              <ul className="space-y-3">
                <li className="text-xs text-muted-foreground flex gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1 shrink-0" />
                  Average reading speed is about 200 words per minute.
                </li>
                <li className="text-xs text-muted-foreground flex gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1 shrink-0" />
                  For social media posts, aim for 20-50 words.
                </li>
                <li className="text-xs text-muted-foreground flex gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1 shrink-0" />
                  Meta descriptions should be under 160 characters.
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

