"use client";

import { ToolLayout } from "@/components/tool-layout";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Database, 
  Copy, 
  Check, 
  Trash2,
  Zap,
  AlertCircle,
  FileJson,
  FileCode,
  Settings2,
  Code
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function JSONToSQLSchema() {
  const [input, setInput] = useState('{\n  "id": 1,\n  "username": "faheem",\n  "email": "faheem@example.com",\n  "is_active": true,\n  "created_at": "2026-05-18T10:00:00Z",\n  "balance": 1500.50\n}');
  const [tableName, setTableName] = useState("users");
  const [dialect, setDialect] = useState<"mysql" | "postgres" | "sqlite">("mysql");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const inferType = (val: any, d: string) => {
    if (val === null) return "TEXT";
    const type = typeof val;
    
    if (type === "number") {
      if (Number.isInteger(val)) return d === "postgres" ? "INTEGER" : "INT";
      return d === "postgres" ? "DECIMAL" : "FLOAT";
    }
    if (type === "boolean") return d === "postgres" ? "BOOLEAN" : "TINYINT(1)";
    if (type === "string") {
      // Basic date check
      if (/^\d{4}-\d{2}-\d{2}/.test(val)) return d === "postgres" ? "TIMESTAMP" : "DATETIME";
      return d === "postgres" ? "VARCHAR(255)" : "VARCHAR(255)";
    }
    return "TEXT";
  };

  useMemo(() => {
    setError(null);
    if (!input.trim()) {
      setOutput("");
      return;
    }

    try {
      const json = JSON.parse(input);
      const data = Array.isArray(json) ? json[0] : json;
      if (!data || typeof data !== "object") throw new Error("Input must be a JSON object or array of objects.");

      const columns = Object.entries(data).map(([key, val]) => {
        const sqlType = inferType(val, dialect);
        const quote = dialect === "mysql" ? "`" : '"';
        return `  ${quote}${key}${quote} ${sqlType}`;
      });

      const quote = dialect === "mysql" ? "`" : '"';
      let schema = `CREATE TABLE ${quote}${tableName || "table_name"}${quote} (\n`;
      schema += columns.join(",\n");
      schema += "\n);";

      setOutput(schema);
    } catch (e: any) {
      setError(e.message);
      setOutput("");
    }
  }, [input, tableName, dialect]);

  const copyToClipboard = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout toolId="json-sql-schema">

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch h-[calc(100vh-300px)] min-h-[500px]">
        {/* Input Panel */}
        <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col">
          <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <FileJson className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Source JSON</span>
            </div>
            <div className="flex items-center gap-4">
              <Input 
                value={tableName}
                onChange={(e) => setTableName(e.target.value)}
                placeholder="Table Name"
                className="h-8 w-32 rounded-lg bg-background/50 border-border/40 text-[10px] font-bold"
              />
              <Button variant="ghost" size="icon" onClick={() => setInput("")} className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <CardContent className="p-0 flex-1 relative">
            <Textarea
              placeholder="Paste JSON object here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-full p-8 bg-transparent border-none focus-visible:ring-0 resize-none font-mono text-sm leading-relaxed"
            />
          </CardContent>
        </Card>

        {/* Output Panel */}
        <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col relative">
          <div className="px-8 py-6 border-b border-border/40 bg-primary/5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <Settings2 className="w-4 h-4 text-primary" />
              <select 
                value={dialect}
                onChange={(e) => setDialect(e.target.value as any)}
                className="bg-transparent text-xs font-bold uppercase tracking-widest text-primary focus:outline-none cursor-pointer"
              >
                <option value="mysql">MySQL / MariaDB</option>
                <option value="postgres">PostgreSQL</option>
                <option value="sqlite">SQLite</option>
              </select>
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
              {copied ? "Copied" : "Copy SQL"}
            </Button>
          </div>
          
          <CardContent className="p-0 flex-1 relative bg-primary/[0.01]">
            {error ? (
              <div className="p-8 h-full bg-destructive/5 text-destructive font-mono text-sm space-y-4">
                <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-[10px]">
                  <AlertCircle className="w-3 h-3" />
                  Inference Error
                </div>
                <div className="bg-destructive/10 p-4 rounded-xl border border-destructive/20 whitespace-pre-wrap leading-relaxed">
                  {error}
                </div>
              </div>
            ) : (
              <pre className="w-full h-full min-h-[400px] p-8 font-mono text-sm leading-loose text-foreground/80 overflow-auto whitespace-pre selection:bg-primary/20">
                {output || <span className="text-muted-foreground italic opacity-50">SQL Schema will appear here...</span>}
              </pre>
            )}
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
