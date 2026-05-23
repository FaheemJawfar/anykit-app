"use client";

import { useState, useEffect } from "react";
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
  Settings2,
  Braces
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function JSONToSQL() {
  const [input, setInput] = useState('[\n  {\n    "id": 1,\n    "name": "Faheem",\n    "email": "faheem@example.com"\n  },\n  {\n    "id": 2,\n    "name": "AnyKit App",\n    "email": "tools@anykit.com"\n  }\n]');
  const [tableName, setTableName] = useState("users");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const convertToSQL = (val: string, table: string) => {
    setInput(val);
    setTableName(table);
    setError(null);
    if (!val.trim()) {
      setOutput("");
      return;
    }

    try {
      const data = JSON.parse(val);
      const rows = Array.isArray(data) ? data : [data];
      if (rows.length === 0) throw new Error("JSON array is empty.");

      const columns = Object.keys(rows[0]);
      const sqlColumns = columns.map(c => `\`${c}\``).join(", ");
      
      const sqlValues = rows.map(row => {
        const values = columns.map(col => {
          const v = row[col];
          if (v === null) return "NULL";
          if (typeof v === "string") return `'${v.replace(/'/g, "''")}'`;
          return v;
        });
        return `(${values.join(", ")})`;
      }).join(",\n");

      setOutput(`INSERT INTO \`${table || "table_name"}\` (${sqlColumns}) VALUES\n${sqlValues};`);
    } catch (e: any) {
      setError(e.message);
      setOutput("");
    }
  };

  useEffect(() => {
    convertToSQL(input, tableName);
  }, []);

  const copyToClipboard = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8 text-foreground">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
          <FileJson className="w-6 h-6" />
        </div>
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight">JSON to SQL</h1>
          <p className="text-sm text-muted-foreground">
            Generate SQL INSERT statements from JSON objects and arrays.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch h-[calc(100vh-300px)] min-h-[500px]">
        {/* Input Panel */}
        <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col">
          <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <Braces className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Source JSON</span>
            </div>
            <div className="flex items-center gap-4">
              <input 
                value={tableName}
                onChange={(e) => {
                  setTableName(e.target.value);
                  convertToSQL(input, e.target.value);
                }}
                placeholder="Table Name"
                className="bg-background/50 border border-border/40 rounded-lg px-3 py-1 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary/20 w-32"
              />
              <Button variant="ghost" size="icon" onClick={() => convertToSQL("", tableName)} className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <CardContent className="p-0 flex-1 relative">
            <Textarea
              placeholder="Paste JSON array here..."
              value={input}
              onChange={(e) => convertToSQL(e.target.value, tableName)}
              className="w-full h-full p-8 bg-transparent border-none focus-visible:ring-0 resize-none font-mono text-xs leading-relaxed"
            />
          </CardContent>
        </Card>

        {/* Output Panel */}
        <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col relative">
          <div className="px-8 py-6 border-b border-border/40 bg-primary/5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-primary">SQL Result</span>
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
              {copied ? "Copied" : "Copy Style"}
            </Button>
          </div>
          
          <CardContent className="p-0 flex-1 relative bg-primary/[0.01]">
            {error ? (
              <div className="p-8 h-full bg-destructive/5 text-destructive font-mono text-sm space-y-4">
                <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-[10px]">
                  <AlertCircle className="w-3 h-3" />
                  Format Error
                </div>
                <div className="bg-destructive/10 p-4 rounded-xl border border-destructive/20 whitespace-pre-wrap leading-relaxed">
                  {error}
                </div>
              </div>
            ) : (
              <pre className="w-full h-full min-h-[400px] p-8 font-mono text-xs leading-relaxed overflow-auto whitespace-pre selection:bg-primary/20 text-foreground/80">
                {output || <span className="text-muted-foreground italic opacity-50">SQL INSERT will appear here...</span>}
              </pre>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
