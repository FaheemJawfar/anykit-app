"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Regex, 
  Copy, 
  Check, 
  Search,
  Zap,
  Info,
  BookOpen,
  Code,
  Hash,
  Filter
} from "lucide-react";
import { cn } from "@/lib/utils";

const REGEX_RULES = [
  {
    category: "Character Classes",
    items: [
      { name: "Any Character", exp: ".", desc: "Any character except newline" },
      { name: "Word", exp: "\\w", desc: "A-Z, a-z, 0-9, and underscore" },
      { name: "Digit", exp: "\\d", desc: "Any digit 0-9" },
      { name: "Whitespace", exp: "\\s", desc: "Space, tab, newline" },
      { name: "Non-Word", exp: "\\W", desc: "Anything NOT a word character" },
      { name: "Non-Digit", exp: "\\D", desc: "Anything NOT a digit" }
    ]
  },
  {
    category: "Quantifiers",
    items: [
      { name: "Zero or More", exp: "*", desc: "Match 0 or more times" },
      { name: "One or More", exp: "+", desc: "Match 1 or more times" },
      { name: "Optional", exp: "?", desc: "Match 0 or 1 time" },
      { name: "Exact Count", exp: "{n}", desc: "Match exactly n times" },
      { name: "Range Count", exp: "{n,m}", desc: "Match between n and m times" }
    ]
  },
  {
    category: "Anchors & Boundaries",
    items: [
      { name: "Start of String", exp: "^", desc: "Match beginning of input" },
      { name: "End of String", exp: "$", desc: "Match end of input" },
      { name: "Word Boundary", exp: "\\b", desc: "Match position between word and non-word" }
    ]
  },
  {
    category: "Groups & Sets",
    items: [
      { name: "Character Set", exp: "[abc]", desc: "Any character in the brackets" },
      { name: "Negated Set", exp: "[^abc]", desc: "Any character NOT in the brackets" },
      { name: "Capturing Group", exp: "(abc)", desc: "Group multiple tokens together" },
      { name: "Non-Capturing Group", exp: "(?:abc)", desc: "Group without capturing" }
    ]
  }
];

export default function RegexMemo() {
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (val: string) => {
    navigator.clipboard.writeText(val);
    setCopied(val);
    setTimeout(() => setCopied(null), 2000);
  };

  const filteredMemos = REGEX_RULES.map(cat => ({
    ...cat,
    items: cat.items.filter(item => 
      item.name.toLowerCase().includes(search.toLowerCase()) || 
      item.exp.toLowerCase().includes(search.toLowerCase()) ||
      item.desc.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(cat => cat.items.length > 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
          <Regex className="w-6 h-6" />
        </div>
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight">Regex Cheat Sheet</h1>
          <p className="text-sm text-muted-foreground">
            A professional reference for regular expression syntax and patterns.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search regex (e.g. digit, group, anchor)..."
            className="h-12 pl-12 pr-6 rounded-2xl bg-card border-border/40 font-bold focus:ring-primary/20 shadow-sm"
          />
        </div>
        
        <div className="flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-2xl border border-primary/10">
          <Zap className="w-4 h-4 text-primary" />
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Click pattern to copy</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {filteredMemos.map((cat, i) => (
          <div key={i} className="space-y-4 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${i * 100}ms` }}>
            <div className="flex items-center gap-2 px-1">
              <BookOpen className="w-4 h-4 text-primary/40" />
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">{cat.category}</h2>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {cat.items.map((item, j) => (
                <Card 
                  key={j} 
                  onClick={() => copy(item.exp)}
                  className="group cursor-pointer border-border/40 bg-card/40 backdrop-blur-sm rounded-3xl transition-all hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 active:scale-[0.98]"
                >
                  <CardContent className="p-6 space-y-3">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-sm text-foreground/90">{item.name}</h3>
                      <div className={cn(
                        "w-6 h-6 rounded-lg flex items-center justify-center transition-all",
                        copied === item.exp ? "bg-green-500 text-white" : "bg-muted text-muted-foreground opacity-0 group-hover:opacity-100"
                      )}>
                        {copied === item.exp ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                    
                    <div className="p-3 rounded-xl bg-muted/30 font-mono text-xs text-primary font-bold break-all border border-transparent group-hover:border-primary/10 group-hover:bg-primary/5 transition-all">
                      {item.exp}
                    </div>
                    
                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filteredMemos.length === 0 && (
        <div className="py-20 text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto">
            <Search className="w-10 h-10 text-muted-foreground/30" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-lg">No Results Found</h3>
            <p className="text-sm text-muted-foreground">Try searching for a different keyword.</p>
          </div>
        </div>
      )}

      <div className="p-8 rounded-[2.5rem] bg-primary/5 border border-primary/10 flex items-start gap-6">
        <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
          <Info className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-primary">Interactive Testing</h3>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
            Want to test these patterns live? Head over to our <a href="/tools/regex-tester" className="text-primary font-bold hover:underline">Regex Tester</a> to debug your regular expressions in real-time.
          </p>
        </div>
      </div>
    </div>
  );
}
