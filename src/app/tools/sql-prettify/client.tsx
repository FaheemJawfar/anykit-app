"use client";

import { ToolLayout } from "@/components/tool-layout";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { 
  Database, 
  Copy, 
  Check, 
  Trash2,
  Settings2,
  FileCode,
  Zap,
  AlignLeft,
  Braces
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "sql-formatter";

export default function SQLPrettify() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("sql");
  const [copied, setCopied] = useState(false);

  const process = (val: string, lang: string) => {
    setInput(val);
    if (!val.trim()) {
      setOutput("");
      return;
    }

    try {
      const formatted = format(val, {
        language: lang as any,
        keywordCase: "upper",
        indentStyle: "tabularLeft",
      });
      setOutput(formatted);
    } catch (e) {
      setOutput("Error formatting SQL. Please check your syntax.");
    }
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
    <ToolLayout toolId="sql-prettify">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input and Settings */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Settings2 className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Dialect</span>
              </div>
              <select 
                value={language} 
                onChange={(e) => {
                  setLanguage(e.target.value);
                  process(input, e.target.value);
                }}
                className="bg-transparent text-xs font-bold uppercase tracking-wider focus:outline-none cursor-pointer text-primary"
              >
                <option value="sql">Standard SQL</option>
                <option value="mysql">MySQL</option>
                <option value="postgresql">PostgreSQL</option>
                <option value="sqlite">SQLite</option>
                <option value="mariadb">MariaDB</option>
                <option value="tsql">T-SQL (SQL Server)</option>
              </select>
            </div>
            <CardContent className="p-0">
              <Textarea
                placeholder="Paste your raw SQL query here..."
                value={input}
                onChange={(e) => process(e.target.value, language)}
                className="w-full h-[400px] p-8 bg-transparent border-none focus-visible:ring-0 resize-none font-mono text-sm leading-relaxed"
              />
              <div className="p-4 bg-muted/20 border-t border-border/40 flex justify-end">
                <Button variant="ghost" size="sm" onClick={clear} className="rounded-xl font-bold h-10 px-4">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear Input
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-primary">Pro Tip</h3>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              This tool uses professional formatting rules, including keywords in UPPERCASE and tabular indentation for maximum clarity in complex JOINs and WHERE clauses.
            </p>
          </div>
        </div>

        {/* Right Column: Formatted Output */}
        <div className="lg:col-span-7 h-full">
          <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col h-full min-h-[550px]">
            <div className="px-8 py-6 border-b border-border/40 bg-primary/5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <AlignLeft className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-primary">Beautified SQL</span>
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
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Result
                  </>
                )}
              </Button>
            </div>
            <CardContent className="p-0 flex-1 overflow-auto bg-primary/[0.01]">
              <div className="p-8 font-mono text-sm leading-loose whitespace-pre tabular-nums">
                {output || <span className="text-muted-foreground italic">Formatted query will appear here...</span>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
