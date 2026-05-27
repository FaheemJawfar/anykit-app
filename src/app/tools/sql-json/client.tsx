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
  Zap,
  AlertCircle,
  FileJson,
  FileCode,
  ArrowRight,
  Braces
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function SQLToJSON() {
  const [input, setInput] = useState("INSERT INTO users (id, name, email) VALUES\n(1, 'Faheem', 'faheem@example.com'),\n(2, 'AnyKit App', 'tools@anykit.com');");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const parseSQL = (sql: string) => {
    setInput(sql);
    setError(null);
    if (!sql.trim()) {
      setOutput("");
      return;
    }

    try {
      // Basic INSERT INTO parser
      const tableMatch = sql.match(/INSERT INTO\s+(\w+)\s*\((.*?)\)\s*VALUES\s*(.*);?/is);
      if (!tableMatch) {
        throw new Error("Only basic 'INSERT INTO table (cols) VALUES (...)' statements are supported currently.");
      }

      const columns = tableMatch[2].split(',').map(c => c.trim().replace(/[`"']/g, ''));
      const valuesStr = tableMatch[3].trim();
      
      // Split rows by ),( but be careful with values containing commas
      // This is a simplified parser for a utility tool
      const rows = valuesStr.split(/\),\s*\(/).map(row => {
        const cleanRow = row.replace(/^\s*\(/, '').replace(/\)\s*;?\s*$/, '');
        // Match values considering strings and numbers
        const values = cleanRow.match(/('(?:''|[^'])*'|"(?:""|[^"])*"|[^,]+)/g);
        return values?.map(v => v.trim().replace(/^['"](.*)['"]$/, '$1')) || [];
      });

      const result = rows.map(row => {
        const obj: any = {};
        columns.forEach((col, i) => {
          const val = row[i];
          // Try to convert to number or boolean if possible
          if (val === 'NULL' || val === 'null') obj[col] = null;
          else if (val === 'true') obj[col] = true;
          else if (val === 'false') obj[col] = false;
          else if (!isNaN(Number(val)) && val !== '') obj[col] = Number(val);
          else obj[col] = val;
        });
        return obj;
      });

      setOutput(JSON.stringify(result, null, 2));
    } catch (e: any) {
      setError(e.message);
      setOutput("");
    }
  };

  const copyToClipboard = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout toolId="sql-json">

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch h-[calc(100vh-300px)] min-h-[500px]">
        {/* Input Panel */}
        <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col">
          <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <FileCode className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">SQL INSERT</span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => parseSQL("")} className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          <CardContent className="p-0 flex-1 relative">
            <Textarea
              placeholder="INSERT INTO table (col1, col2) VALUES (val1, val2)..."
              value={input}
              onChange={(e) => parseSQL(e.target.value)}
              className="w-full h-full p-8 bg-transparent border-none focus-visible:ring-0 resize-none font-mono text-xs leading-relaxed"
            />
          </CardContent>
        </Card>

        {/* Output Panel */}
        <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col relative">
          <div className="px-8 py-6 border-b border-border/40 bg-primary/5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-primary">JSON Array</span>
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
          
          <CardContent className="p-0 flex-1 relative bg-primary/[0.01]">
            {error ? (
              <div className="p-8 h-full bg-destructive/5 text-destructive font-mono text-sm space-y-4">
                <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-[10px]">
                  <AlertCircle className="w-3 h-3" />
                  Parse Error
                </div>
                <div className="bg-destructive/10 p-4 rounded-xl border border-destructive/20 whitespace-pre-wrap leading-relaxed">
                  {error}
                </div>
              </div>
            ) : (
              <pre className="w-full h-full min-h-[400px] p-8 font-mono text-xs leading-relaxed overflow-auto whitespace-pre selection:bg-primary/20 text-foreground/80">
                {output || <span className="text-muted-foreground italic opacity-50">JSON array will appear here...</span>}
              </pre>
            )}
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
