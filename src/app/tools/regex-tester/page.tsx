"use client";

import { ToolLayout } from "@/components/tool-layout";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Search, 
  Copy, 
  Check, 
  Trash2,
  Zap,
  Info,
  Regex,
  AlertCircle,
  Hash,
  Filter
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function RegexTester() {
  const [regex, setRegex] = useState("([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\\.[a-zA-Z0-9._-]+)");
  const [flags, setFlags] = useState("g");
  const [testText, setTestText] = useState("Contact us at support@anykit.com or hello@example.org for more info.");
  const [matches, setMatches] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const testRegex = () => {
    setError(null);
    if (!regex) {
      setMatches([]);
      return;
    }

    try {
      const re = new RegExp(regex, flags.includes('g') ? flags : flags + 'g');
      const found = [];
      let match;
      
      // Prevent infinite loops with empty matches
      let lastIndex = -1;
      while ((match = re.exec(testText)) !== null) {
        if (re.lastIndex === lastIndex) {
          re.lastIndex++;
          continue;
        }
        lastIndex = re.lastIndex;
        found.push({
          text: match[0],
          index: match.index,
          groups: match.slice(1)
        });
        if (!flags.includes('g')) break;
      }
      setMatches(found);
    } catch (e: any) {
      setError(e.message);
      setMatches([]);
    }
  };

  useEffect(() => {
    testRegex();
  }, [regex, flags, testText]);

  const toggleFlag = (f: string) => {
    setFlags(prev => prev.includes(f) ? prev.replace(f, '') : prev + f);
  };

  const HighlightedText = () => {
    if (error || !regex || matches.length === 0) return <div className="whitespace-pre-wrap">{testText}</div>;

    const parts = [];
    let lastIndex = 0;

    matches.forEach((match, i) => {
      // Add text before match
      parts.push(testText.substring(lastIndex, match.index));
      // Add highlighted match
      parts.push(
        <span 
          key={i} 
          className="bg-primary/20 text-primary border-b-2 border-primary font-bold px-0.5 rounded-sm"
          title={`Match ${i + 1}: ${match.text}`}
        >
          {match.text}
        </span>
      );
      lastIndex = match.index + match.text.length;
    });
    // Add remaining text
    parts.push(testText.substring(lastIndex));

    return <div className="whitespace-pre-wrap leading-relaxed">{parts}</div>;
  };

  return (
    <ToolLayout toolId="regex-tester">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Panel */}
        <div className="lg:col-span-12 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
                <div className="lg:col-span-8 space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Regular Expression</Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-xl">/</span>
                    <Input 
                      value={regex}
                      onChange={(e) => setRegex(e.target.value)}
                      placeholder="Enter regex pattern..."
                      className="h-14 pl-8 pr-24 rounded-2xl bg-muted/30 border-border/40 font-mono text-lg focus:ring-primary/20"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-xl">/{flags}</span>
                  </div>
                </div>
                <div className="lg:col-span-4 flex gap-2 h-14 p-1.5 bg-muted/50 rounded-2xl border border-border/40">
                  {['g', 'i', 'm', 'u', 's'].map((f) => (
                    <Button
                      key={f}
                      variant={flags.includes(f) ? "default" : "ghost"}
                      size="sm"
                      onClick={() => toggleFlag(f)}
                      className={cn(
                        "flex-1 rounded-xl font-mono font-bold text-sm",
                        flags.includes(f) && "shadow-md"
                      )}
                      title={f === 'g' ? 'Global' : f === 'i' ? 'Case Insensitive' : f === 'm' ? 'Multiline' : f === 'u' ? 'Unicode' : 'Dotall'}
                    >
                      {f}
                    </Button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="p-4 rounded-2xl bg-destructive/5 border border-destructive/10 text-destructive text-xs font-mono flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
            <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col min-h-[400px]">
              <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Filter className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Test String</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setTestText("")} className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <CardContent className="p-0 flex-1">
                <Textarea
                  placeholder="Enter text to test your regex against..."
                  value={testText}
                  onChange={(e) => setTestText(e.target.value)}
                  className="w-full h-full min-h-[300px] p-8 bg-transparent border-none focus-visible:ring-0 resize-none font-sans text-lg leading-relaxed"
                />
              </CardContent>
            </Card>

            <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col min-h-[400px]">
              <div className="px-8 py-6 border-b border-border/40 bg-primary/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Zap className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold uppercase tracking-widest text-primary">Live Highlighting</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full">
                  <Hash className="w-3 h-3 text-primary" />
                  <span className="text-[10px] font-bold text-primary">{matches.length} Matches</span>
                </div>
              </div>
              <CardContent className="p-8 flex-1 overflow-auto bg-primary/[0.01]">
                <div className="font-sans text-lg">
                  <HighlightedText />
                </div>
                
                {matches.length > 0 && (
                  <div className="mt-8 pt-8 border-t border-border/40 space-y-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Match Groups</span>
                    <div className="space-y-3">
                      {matches.slice(0, 5).map((match, i) => (
                        <div key={i} className="p-3 rounded-xl bg-muted/30 border border-border/40 font-mono text-xs">
                          <span className="text-primary font-bold mr-2">#{i+1}:</span> {match.text}
                          {match.groups.length > 0 && (
                            <div className="mt-2 pl-4 border-l border-primary/20 space-y-1">
                              {match.groups.map((g: string, j: number) => (
                                <div key={j} className="text-muted-foreground">Group {j+1}: {g || "null"}</div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                      {matches.length > 5 && (
                        <div className="text-[10px] text-center text-muted-foreground italic">
                          Showing first 5 of {matches.length} matches
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
