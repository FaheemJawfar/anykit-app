"use client";

import React, { useState, useEffect } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Play, Copy, CheckCircle2, BookOpen, AlertTriangle } from "lucide-react";

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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 lg:order-last space-y-6">
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">Common Patterns</h3>
            <div className="space-y-2">{commonPatterns.map((p) => (<button key={p.name} onClick={() => setPattern(p.pattern)} className="w-full text-left px-4 py-3 bg-muted border border-border rounded-xl text-sm font-bold text-foreground hover:bg-primary/5 hover:border-primary/30 transition-all"><div className="text-xs text-muted-foreground font-medium">{p.name}</div></button>))}</div>
          </div>
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">Flags</h3>
            <label className="flex items-center cursor-pointer gap-3"><input type="checkbox" checked={globalFlag} onChange={(e) => setGlobalFlag(e.target.checked)} className="w-5 h-5 text-primary border-border rounded focus:ring-primary" /><span className="text-sm text-muted-foreground font-medium">Global (g)</span></label>
            <label className="flex items-center cursor-pointer gap-3"><input type="checkbox" checked={caseSensitive} onChange={(e) => setCaseSensitive(e.target.checked)} className="w-5 h-5 text-primary border-border rounded focus:ring-primary" /><span className="text-sm text-muted-foreground font-medium">Case sensitive</span></label>
          </div>
          {error && <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-4 text-sm font-bold flex items-center gap-2"><AlertTriangle className="w-5 h-5" />{error}</div>}
        </div>
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-card rounded-[2rem] shadow-sm border border-border p-8">
            <h3 className="text-lg font-black text-foreground mb-6 flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center"><Play className="w-5 h-5 text-primary" /></div>Regular Expression</h3>
            <input type="text" value={pattern} onChange={(e) => setPattern(e.target.value)} placeholder="Enter regex pattern..." className="w-full px-5 py-3.5 bg-muted border border-border rounded-2xl focus:bg-card focus:border-primary focus:outline-none transition-all text-sm font-mono font-bold text-foreground placeholder:font-normal" />
          </div>
          <div className="bg-card rounded-[2rem] shadow-sm border border-border p-8">
            <h3 className="text-lg font-black text-foreground mb-6 flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center"><BookOpen className="w-5 h-5 text-primary" /></div>Test String</h3>
            <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter text to test against the pattern..." rows={8} className="w-full px-6 py-4 bg-muted border border-border rounded-2xl focus:bg-card focus:border-primary focus:outline-none transition-all text-sm font-medium text-foreground resize-none placeholder:font-normal" />
          </div>
          {matches.length > 0 && (
            <div className="bg-card rounded-[2rem] shadow-sm border border-border p-8">
              <h3 className="text-lg font-black text-foreground mb-4">Matches ({matches.length})</h3>
              <div className="space-y-2">{matches.map((match, i) => (<div key={i} className="flex items-center justify-between p-3 bg-muted rounded-xl border border-border"><code className="text-sm font-mono text-foreground">{match}</code><Button onClick={() => copyToClipboard(match)} variant="ghost" size="sm"><Copy className="w-3.5 h-3.5" /></Button></div>))}</div>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
