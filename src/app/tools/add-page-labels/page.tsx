"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Type, FileUp, FileText, RefreshCw, AlertCircle, Plus, Trash2 } from "lucide-react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

type LabelStyle = "decimal" | "roman" | "roman-upper" | "letters" | "letters-upper";

interface LabelRule {
  id: string;
  pageRange: string;
  style: LabelStyle;
  prefix: string;
  startValue: number;
}

function toRoman(num: number): string {
  const roman: Record<string, number> = {
    M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90,
    L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1,
  };
  let result = "";
  for (const [letter, value] of Object.entries(roman)) {
    while (num >= value) {
      result += letter;
      num -= value;
    }
  }
  return result;
}

function toLetters(num: number): string {
  let result = "";
  while (num > 0) {
    num--;
    result = String.fromCharCode(97 + (num % 26)) + result;
    num = Math.floor(num / 26);
  }
  return result;
}

function formatLabel(num: number, style: LabelStyle): string {
  switch (style) {
    case "roman": return toRoman(num);
    case "roman-upper": return toRoman(num).toUpperCase();
    case "letters": return toLetters(num);
    case "letters-upper": return toLetters(num).toUpperCase();
    default: return String(num);
  }
}

function parsePageRange(range: string, maxPages: number): number[] {
  if (!range.trim()) {
    return Array.from({ length: maxPages }, (_, i) => i + 1);
  }
  const pages = new Set<number>();
  const parts = range.split(/,\s*/);
  for (const part of parts) {
    if (part.includes("-")) {
      const [start, end] = part.split("-").map(Number);
      for (let i = start; i <= end && i <= maxPages; i++) pages.add(i);
    } else if (part.toLowerCase() === "odd") {
      for (let i = 1; i <= maxPages; i += 2) pages.add(i);
    } else if (part.toLowerCase() === "even") {
      for (let i = 2; i <= maxPages; i += 2) pages.add(i);
    } else {
      const n = Number(part);
      if (n > 0 && n <= maxPages) pages.add(n);
    }
  }
  return Array.from(pages).sort((a, b) => a - b);
}

let ruleCounter = 0;
function createRule(overrides: Partial<LabelRule> = {}): LabelRule {
  ruleCounter++;
  return {
    id: `rule-${ruleCounter}`,
    pageRange: "",
    style: "decimal",
    prefix: "",
    startValue: 1,
    ...overrides,
  };
}

export default function AddPageLabels() {
  const [file, setFile] = useState<File | null>(null);
  const [pdfDoc, setPdfDoc] = useState<PDFDocument | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [rules, setRules] = useState<LabelRule[]>([createRule()]);
  const [position, setPosition] = useState<"top-left" | "top-right" | "bottom-left" | "bottom-right">("bottom-right");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (f: File) => {
    if (f.type !== "application/pdf") return;
    setFile(f);
    setError(null);

    try {
      const buffer = await f.arrayBuffer();
      const doc = await PDFDocument.load(buffer);
      setPdfDoc(doc);
      setPageCount(doc.getPageCount());
    } catch (e: any) {
      setError(e.message || "Failed to load PDF.");
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const addRule = () => setRules((prev) => [...prev, createRule()]);
  const removeRule = (id: string) => setRules((prev) => prev.filter((r) => r.id !== id));
  const updateRule = (id: string, updates: Partial<LabelRule>) => {
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
  };

  const applyLabels = async () => {
    if (!pdfDoc || !file || pageCount === 0) return;
    setLoading(true);
    setError(null);

    try {
      const newPdfDoc = await PDFDocument.create();
      const font = await newPdfDoc.embedFont(StandardFonts.Helvetica);

      for (let i = 0; i < pdfDoc.getPageCount(); i++) {
        const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [i]);
        const { width, height } = copiedPage.getSize();
        const newPage = newPdfDoc.addPage([width, height]);
        newPage.drawPage(await newPdfDoc.embedPage(copiedPage), { x: 0, y: 0, width, height });

        const pageNum = i + 1;
        let label = "";

        for (const rule of rules) {
          const range = parsePageRange(rule.pageRange, pageCount);
          if (range.includes(pageNum)) {
            const index = range.indexOf(pageNum);
            label = rule.prefix + formatLabel(rule.startValue + index, rule.style);
            break;
          }
        }

        if (label) {
          const fontSize = 10;
          const textWidth = font.widthOfTextAtSize(label, fontSize);
          const margin = 20;

          let x = margin;
          let y = margin;

          switch (position) {
            case "top-left": y = height - margin - fontSize; break;
            case "top-right": x = width - textWidth - margin; y = height - margin - fontSize; break;
            case "bottom-right": x = width - textWidth - margin; break;
            default: break;
          }

          newPage.drawText(label, {
            x,
            y,
            font,
            size: fontSize,
            color: rgb(0.5, 0.5, 0.5),
          });
        }
      }

      const bytes = await newPdfDoc.save();
      const blob = new Blob([bytes.slice()], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `labeled-${file.name}`;
      a.click();
      URL.revokeObjectURL(url);

      setRules([createRule()]);
      setFile(null);
      setPdfDoc(null);
      setPageCount(0);
    } catch (e: any) {
      setError(e.message || "Failed to add page labels.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-8 text-foreground">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
          <Type className="w-6 h-6" />
        </div>
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight">Add Page Labels</h1>
          <p className="text-sm text-muted-foreground">
            Apply visual page labels with Roman numerals, prefixes, and custom starts.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
          <CardContent className="p-8">
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const f = e.dataTransfer.files[0];
                if (f) handleFile(f);
              }}
              className="relative group h-48 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center transition-all cursor-pointer border-border/60 hover:border-primary/40 hover:bg-primary/5"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                className="hidden"
                accept="application/pdf"
              />
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                <FileUp className="w-8 h-8" />
              </div>
              <div className="text-center">
                <h3 className="font-bold text-lg">Upload PDF</h3>
                <p className="text-sm text-muted-foreground mt-1">Click or drag PDF here</p>
              </div>
            </div>

            {file && (
              <div className="mt-6 flex items-center gap-3 p-4 rounded-2xl bg-card/60 border border-border/40">
                <FileText className="w-5 h-5 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{formatSize(file.size)} • {pageCount} pages</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
          <CardContent className="p-8 space-y-6">
            <div className="flex items-center gap-2">
              <Type className="w-5 h-5 text-primary" />
              <h3 className="font-bold">Label Rules</h3>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">Position</Label>
              <select
                value={position}
                onChange={(e) => setPosition(e.target.value as any)}
                className="w-full h-10 px-3 rounded-xl border border-border/40 bg-card/60 text-sm"
              >
                <option value="bottom-left">Bottom Left</option>
                <option value="bottom-right">Bottom Right</option>
                <option value="top-left">Top Left</option>
                <option value="top-right">Top Right</option>
              </select>
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto">
              {rules.map((rule, index) => (
                <div key={rule.id} className="p-4 rounded-2xl bg-card/60 border border-border/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Rule {index + 1}</span>
                    {rules.length > 1 && (
                      <button
                        onClick={() => removeRule(rule.id)}
                        className="text-destructive hover:text-destructive/80"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={rule.pageRange}
                    onChange={(e) => updateRule(rule.id, { pageRange: e.target.value })}
                    placeholder="e.g. 1-4, 7, odd, or leave empty for all"
                    className="w-full h-9 px-3 rounded-lg border border-border/40 bg-background text-sm"
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <select
                      value={rule.style}
                      onChange={(e) => updateRule(rule.id, { style: e.target.value as LabelStyle })}
                      className="h-9 px-2 rounded-lg border border-border/40 bg-background text-sm"
                    >
                      <option value="decimal">1, 2, 3</option>
                      <option value="roman">i, ii, iii</option>
                      <option value="roman-upper">I, II, III</option>
                      <option value="letters">a, b, c</option>
                      <option value="letters-upper">A, B, C</option>
                    </select>
                    <input
                      type="text"
                      value={rule.prefix}
                      onChange={(e) => updateRule(rule.id, { prefix: e.target.value })}
                      placeholder="Prefix"
                      className="h-9 px-2 rounded-lg border border-border/40 bg-background text-sm"
                    />
                    <input
                      type="number"
                      min={0}
                      value={rule.startValue}
                      onChange={(e) => updateRule(rule.id, { startValue: Math.max(0, Number(e.target.value)) })}
                      placeholder="Start"
                      className="h-9 px-2 rounded-lg border border-border/40 bg-background text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>

            <Button variant="outline" onClick={addRule} className="w-full rounded-xl">
              <Plus className="w-4 h-4 mr-2" />
              Add Rule
            </Button>

            <Button
              onClick={applyLabels}
              disabled={!file || !pdfDoc || loading}
              className="w-full h-14 rounded-2xl text-base font-bold"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  Applying...
                </>
              ) : (
                <>
                  <Type className="w-5 h-5 mr-2" />
                  Apply Page Labels
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {error && (
        <div className="p-6 rounded-3xl border-2 border-destructive/30 bg-destructive/5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-destructive text-white flex items-center justify-center shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-destructive">Error</h3>
            <p className="text-sm text-destructive/80">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}
