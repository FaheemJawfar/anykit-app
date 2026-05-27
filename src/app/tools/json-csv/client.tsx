"use client";

import { ToolLayout } from "@/components/tool-layout";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileSpreadsheet, 
  Copy, 
  Check, 
  Trash2,
  ArrowRightLeft,
  FileJson,
  Table,
  Zap,
  AlertCircle,
  Download
} from "lucide-react";
import { cn } from "@/lib/utils";
import Papa from "papaparse";

export default function JSONCSVConverter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"json-to-csv" | "csv-to-json">("json-to-csv");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const process = (val: string, currentMode: "json-to-csv" | "csv-to-json") => {
    setInput(val);
    setError(null);
    if (!val.trim()) {
      setOutput("");
      return;
    }

    try {
      if (currentMode === "json-to-csv") {
        const json = JSON.parse(val);
        // Ensure it's an array for CSV conversion
        const data = Array.isArray(json) ? json : [json];
        const csv = Papa.unparse(data);
        setOutput(csv);
      } else {
        const result = Papa.parse(val, { header: true, skipEmptyLines: true });
        if (result.errors.length > 0) {
          throw new Error(result.errors[0].message);
        }
        setOutput(JSON.stringify(result.data, null, 2));
      }
    } catch (e: any) {
      setError(e.message);
      setOutput("");
    }
  };

  const toggleMode = () => {
    const newMode = mode === "json-to-csv" ? "csv-to-json" : "json-to-csv";
    setMode(newMode);
    if (output) {
      const oldOutput = output;
      setInput(oldOutput);
      process(oldOutput, newMode);
    } else {
      process(input, newMode);
    }
  };

  const copyToClipboard = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = () => {
    if (!output) return;
    const blob = new Blob([output], { type: mode === 'json-to-csv' ? 'text/csv' : 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = mode === 'json-to-csv' ? 'converted.csv' : 'converted.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <ToolLayout toolId="json-csv">

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* Input Panel */}
        <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col min-h-[500px]">
          <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              {mode === "json-to-csv" ? <FileJson className="w-4 h-4 text-primary" /> : <Table className="w-4 h-4 text-primary" />}
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                {mode === "json-to-csv" ? "JSON Array" : "CSV Data"}
              </span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => process("", mode)} className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          <CardContent className="p-0 flex-1 relative">
            <Textarea
              placeholder={mode === "json-to-csv" ? '[\n  {"id": 1, "name": "AnyKit App"},\n  {"id": 2, "name": "Tools"}\n]' : 'id,name\n1,AnyKit App\n2,Tools'}
              value={input}
              onChange={(e) => process(e.target.value, mode)}
              className="w-full h-full min-h-[400px] p-8 bg-transparent border-none focus-visible:ring-0 resize-none font-mono text-sm leading-relaxed"
            />
          </CardContent>
        </Card>

        {/* Output Panel */}
        <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col min-h-[500px] relative">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden lg:block">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={toggleMode}
              className="w-12 h-12 rounded-full bg-background border-border/40 text-muted-foreground shadow-xl hover:text-primary hover:border-primary/20 transition-all hover:scale-110 active:scale-95"
            >
              <ArrowRightLeft className="w-5 h-5" />
            </Button>
          </div>

          <div className="px-8 py-6 border-b border-border/40 bg-primary/5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              {mode === "json-to-csv" ? <Table className="w-4 h-4 text-primary" /> : <FileJson className="w-4 h-4 text-primary" />}
              <span className="text-xs font-bold uppercase tracking-widest text-primary">
                {mode === "json-to-csv" ? "CSV Result" : "JSON Array Result"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={downloadFile}
                disabled={!output}
                className="rounded-xl font-bold px-3 hover:bg-primary/10"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
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
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
          </div>
          <CardContent className="p-0 flex-1 relative">
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
              <pre className="w-full h-full min-h-[400px] p-8 bg-primary/[0.02] font-mono text-sm leading-relaxed overflow-auto whitespace-pre">
                {output || <span className="text-muted-foreground italic">Converted data will appear here...</span>}
              </pre>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-4">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary" />
          <h3 className="font-bold text-xs uppercase tracking-wider text-primary">Conversion Logic</h3>
        </div>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          <strong>JSON to CSV:</strong> The JSON must be an array of objects. Each object represents a row, and keys represent the column headers.
          <br />
          <strong>CSV to JSON:</strong> The first row is treated as the header row. Each subsequent row is converted into a JSON object.
        </p>
      </div>
    </ToolLayout>
  );
}
