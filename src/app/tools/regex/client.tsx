"use client";

import React, { useState, useEffect } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Play, Copy, CheckCircle2, BookOpen, AlertCircle, Settings2, Flag, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface RegexPattern { name: string; pattern: string; description: string; }

const commonPatterns: RegexPattern[] = [
  { name: "Email Address", pattern: "\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}\\b", description: "Matches standard email formats" },
  { name: "Phone (US)", pattern: "(?:\\+?1[-.\\s]?)?\\(?(?:\\d{3})\\)?[-.\\s]?(?:\\d{3})[-.\\s]?(?:\\d{4})", description: "Matches US phone number variants" },
  { name: "URL", pattern: "https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)", description: "Matches HTTP/HTTPS web links" },
  { name: "IPv4 Address", pattern: "(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)", description: "Matches IPv4 addresses" },
  { name: "Hex Color", pattern: "#(?:[0-9a-fA-F]{3}){1,2}\\b", description: "Matches CSS hex colors" },
  { name: "Date (YYYY-MM-DD)", pattern: "\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])", description: "Matches ISO dates" },
];

export default function RegexTester() {
  const [pattern, setPattern] = useState("");
  const [text, setText] = useState("");
  const [matches, setMatches] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [globalFlag, setGlobalFlag] = useState(true);

  useEffect(() => {
    setError("");
    setMatches([]);
    if (!pattern || !text) return;
    try {
      const flags = (globalFlag ? "g" : "") + (caseSensitive ? "" : "i");
      const regex = new RegExp(pattern, flags);
      const found = text.match(regex);
      setMatches(found || []);
    } catch (err) { setError("Invalid regular expression"); }
  }, [pattern, text, caseSensitive, globalFlag]);

  const copyToClipboard = async (content: string) => { try { await navigator.clipboard.writeText(content); } catch (err) { console.error(err); } };

  return (
    <ToolLayout toolId="regex">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center gap-3"><Play className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Regular Expression</span></div>
            <CardContent className="p-8">
              <Input type="text" value={pattern} onChange={(e) => setPattern(e.target.value)} placeholder="Enter regex pattern..." className="h-14 px-5 bg-muted/30 border-transparent rounded-2xl focus:border-primary/20 text-sm font-mono font-bold" />
            </CardContent>
          </Card>
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center gap-3"><BookOpen className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Test String</span></div>
            <CardContent className="p-8">
              <Textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter text to test against the pattern..." rows={8} className="w-full px-4 py-4 bg-muted/30 border-transparent rounded-2xl focus:border-primary/20 text-sm font-medium text-foreground resize-none placeholder:font-normal" />
            </CardContent>
          </Card>
          {matches.length > 0 && (
            <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
              <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Matches ({matches.length})</span></div>
              <CardContent className="p-8 space-y-2">
                {matches.map((match, i) => (<div key={i} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border hover:border-primary/20 transition-all"><code className="text-sm font-mono text-foreground">{match}</code><Button onClick={() => copyToClipboard(match)} variant="ghost" size="sm" className="rounded-lg"><Copy className="w-4 h-4" /></Button></div>))}
              </CardContent>
            </Card>
          )}
          {error && (<div className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-sm font-bold"><AlertCircle className="w-5 h-5 flex-shrink-0" />{error}</div>)}
        </div>

        <div className="lg:col-span-4 space-y-6 sticky top-24">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center gap-2"><Settings2 className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Common Patterns</span></div>
            <CardContent className="p-6 space-y-2">
              {commonPatterns.map((p) => (<button key={p.name} onClick={() => setPattern(p.pattern)} className="w-full text-left p-4 bg-muted/30 border border-border rounded-xl text-sm font-bold text-foreground hover:bg-primary/5 hover:border-primary/30 transition-all"><div className="text-sm font-bold">{p.name}</div><div className="text-xs text-muted-foreground font-medium mt-1">{p.description}</div></button>))}
            </CardContent>
          </Card>
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center gap-2"><Flag className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Flags</span></div>
            <CardContent className="p-6 space-y-3">
              <label className="flex items-center cursor-pointer gap-3 p-3 bg-muted/30 rounded-xl border border-border"><input type="checkbox" checked={globalFlag} onChange={(e) => setGlobalFlag(e.target.checked)} className="w-5 h-5 accent-primary" /><span className="text-sm font-medium">Global (g)</span></label>
              <label className="flex items-center cursor-pointer gap-3 p-3 bg-muted/30 rounded-xl border border-border"><input type="checkbox" checked={caseSensitive} onChange={(e) => setCaseSensitive(e.target.checked)} className="w-5 h-5 accent-primary" /><span className="text-sm font-medium">Case sensitive</span></label>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
