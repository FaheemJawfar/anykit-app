"use client";

import React, { useState, useEffect } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Table as TableIcon, Copy, CheckCircle2, Plus, Minus, Trash2 } from "lucide-react";

type Alignment = "left" | "center" | "right";

export default function MarkdownTableGenerator() {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [tableData, setTableData] = useState<string[][]>(Array(3).fill(null).map(() => Array(3).fill("")));
  const [headers, setHeaders] = useState<string[]>(Array(3).fill(""));
  const [alignments, setAlignments] = useState<Alignment[]>(Array(3).fill("left"));
  const [markdownOutput, setMarkdownOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const updateTableSize = (newRows: number, newCols: number) => {
    const updatedData = Array(newRows).fill(null).map((_, i) => Array(newCols).fill(null).map((_, j) => i < tableData.length && j < tableData[0].length ? tableData[i][j] : ""));
    const updatedHeaders = Array(newCols).fill(null).map((_, j) => j < headers.length ? headers[j] : "");
    const updatedAlignments = Array(newCols).fill(null).map((_, j) => j < alignments.length ? alignments[j] : "left") as Alignment[];
    setTableData(updatedData); setHeaders(updatedHeaders); setAlignments(updatedAlignments); setRows(newRows); setCols(newCols);
  };

  const updateCell = (rowIndex: number, colIndex: number, value: string) => { const newData = [...tableData]; newData[rowIndex][colIndex] = value; setTableData(newData); };
  const updateHeader = (colIndex: number, value: string) => { const newHeaders = [...headers]; newHeaders[colIndex] = value; setHeaders(newHeaders); };
  const toggleAlignment = (colIndex: number) => { const newAlignments = [...alignments]; const current = newAlignments[colIndex]; newAlignments[colIndex] = current === "left" ? "center" : current === "center" ? "right" : "left"; setAlignments(newAlignments); };

  useEffect(() => {
    let md = "| "; headers.forEach((h, i) => { md += (h || `Column ${i + 1}`) + " | "; }); md += "\n| ";
    alignments.forEach((a) => { if (a === "center") md += ":---: | "; else if (a === "right") md += "---: | "; else md += "--- | "; }); md += "\n";
    tableData.forEach((row) => { md += "| "; row.forEach((cell) => { md += (cell || " ") + " | "; }); md += "\n"; });
    setMarkdownOutput(md);
  }, [tableData, headers, alignments]);

  const copyToClipboard = async () => { try { await navigator.clipboard.writeText(markdownOutput); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch (err) { console.error(err); } };

  return (
    <ToolLayout toolId="markdown-table-generator">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 lg:order-last space-y-6">
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <Button onClick={copyToClipboard} className="w-full h-12 shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest text-xs rounded-xl">{copied ? <CheckCircle2 className="w-5 h-5 mr-2" /> : <Copy className="w-5 h-5 mr-2" />}{copied ? "Copied!" : "Copy Markdown"}</Button>
            <Button onClick={() => updateTableSize(rows + 1, cols)} variant="outline" className="w-full h-12 border-border hover:bg-accent text-muted-foreground hover:text-foreground font-bold uppercase tracking-widest text-xs"><Plus className="w-4 h-4 mr-2" /> Add Row</Button>
            <Button onClick={() => rows > 1 && updateTableSize(rows - 1, cols)} variant="outline" className="w-full h-12 border-border hover:bg-accent text-muted-foreground hover:text-foreground font-bold uppercase tracking-widest text-xs"><Minus className="w-4 h-4 mr-2" /> Remove Row</Button>
            <Button onClick={() => updateTableSize(rows, cols + 1)} variant="outline" className="w-full h-12 border-border hover:bg-accent text-muted-foreground hover:text-foreground font-bold uppercase tracking-widest text-xs"><Plus className="w-4 h-4 mr-2" /> Add Column</Button>
            <Button onClick={() => cols > 1 && updateTableSize(rows, cols - 1)} variant="outline" className="w-full h-12 border-border hover:bg-accent text-muted-foreground hover:text-foreground font-bold uppercase tracking-widest text-xs"><Minus className="w-4 h-4 mr-2" /> Remove Column</Button>
          </div>
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">Generated Markdown</h3>
            <pre className="p-4 bg-muted rounded-xl text-xs font-mono text-foreground overflow-auto">{markdownOutput}</pre>
          </div>
        </div>
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-card rounded-[2rem] shadow-sm border border-border p-8 overflow-auto">
            <h3 className="text-lg font-black text-foreground mb-6 flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center"><TableIcon className="w-5 h-5 text-primary" /></div>Table Editor</h3>
            <table className="w-full border-collapse">
              <thead><tr>{headers.map((h, i) => (<th key={i} className="p-2 border border-border bg-muted"><div className="flex items-center gap-2"><input type="text" value={h} onChange={(e) => updateHeader(i, e.target.value)} placeholder={`Col ${i + 1}`} className="w-full px-2 py-1 bg-transparent border-none text-sm font-bold text-foreground focus:outline-none" /><button onClick={() => toggleAlignment(i)} className="text-[10px] text-muted-foreground uppercase font-black">{alignments[i][0]}</button></div></th>))}</tr></thead>
              <tbody>{tableData.map((row, ri) => (<tr key={ri}>{row.map((cell, ci) => (<td key={ci} className="p-2 border border-border"><input type="text" value={cell} onChange={(e) => updateCell(ri, ci, e.target.value)} className="w-full px-2 py-1 bg-transparent border-none text-sm text-foreground focus:outline-none" /></td>))}</tr>))}</tbody>
            </table>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
