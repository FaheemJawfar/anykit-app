"use client";

import { ToolLayout } from "@/components/tool-layout";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Files,
  Trash2,
  Zap,
  FileUp,
  RefreshCw,
  AlertCircle,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PDFDocument } from "pdf-lib";

export default function ExtractPages() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [pagesToExtract, setPagesToExtract] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (f: File) => {
    if (f.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      return;
    }
    setFile(f);
    setError(null);
    try {
      const buffer = await f.arrayBuffer();
      const doc = await PDFDocument.load(buffer);
      setPageCount(doc.getPageCount());
    } catch {
      setPageCount(0);
    }
  };

  const parsePages = (input: string): number[] => {
    const pages = new Set<number>();
    const parts = input.split(",").map((p) => p.trim());
    for (const part of parts) {
      if (part.includes("-")) {
        const [start, end] = part.split("-").map((n) => parseInt(n.trim(), 10));
        if (!isNaN(start) && !isNaN(end)) {
          for (let i = start; i <= end; i++) pages.add(i);
        }
      } else {
        const n = parseInt(part, 10);
        if (!isNaN(n)) pages.add(n);
      }
    }
    return Array.from(pages).sort((a, b) => a - b);
  };

  const extract = async () => {
    if (!file) return;
    const toExtract = parsePages(pagesToExtract);
    if (toExtract.length === 0) {
      setError("Please enter at least one page number.");
      return;
    }
    const invalid = toExtract.filter((p) => p < 1 || p > pageCount);
    if (invalid.length > 0) {
      setError(`Invalid page numbers: ${invalid.join(", ")}. Document has ${pageCount} pages.`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const buffer = await file.arrayBuffer();
      const doc = await PDFDocument.load(buffer);
      const indices = toExtract.map((p) => p - 1);

      const newDoc = await PDFDocument.create();
      const pages = await newDoc.copyPages(doc, indices);
      pages.forEach((page) => newDoc.addPage(page));

      const bytes = await newDoc.save();
      const blob = new Blob([bytes.slice()], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `extracted-${toExtract.length}-pages.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      setError(e.message || "Failed to extract pages.");
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setFile(null);
    setPageCount(0);
    setPagesToExtract("");
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const parsed = parsePages(pagesToExtract);
  const validCount = parsed.filter((p) => p >= 1 && p <= pageCount).length;

  return (
    <ToolLayout toolId="extract-pages">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 space-y-6">
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const f = e.dataTransfer.files[0];
                  if (f) processFile(f);
                }}
                className={cn(
                  "relative group h-56 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center transition-all cursor-pointer",
                  file ? "border-primary bg-primary/5 shadow-inner" : "border-border/60 hover:border-primary/40 hover:bg-primary/5"
                )}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
                  className="hidden"
                  accept="application/pdf"
                />
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                  <FileUp className="w-8 h-8" />
                </div>
                <div className="text-center">
                  <h3 className="font-bold text-lg">{file ? file.name : "Upload PDF"}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {file ? `${pageCount} pages` : "Click or drag a PDF file"}
                  </p>
                </div>
              </div>

              {file && (
                <Button
                  variant="outline"
                  onClick={clear}
                  className="w-full h-12 rounded-2xl border-border/40 text-destructive hover:bg-destructive/5 font-bold"
                >
                  <Trash2 className="w-5 h-5 mr-2" />
                  Remove File
                </Button>
              )}
            </CardContent>
          </Card>

          <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-primary">Privacy Note</h3>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed italic">
              All PDF processing happens in your browser. Your files are never uploaded to a server.
            </p>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          {file ? (
            <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
              <div className="px-8 py-4 border-b border-border/40 bg-muted/30">
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Pages to Extract</span>
              </div>
              <CardContent className="p-8 space-y-8">
                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Page Numbers
                  </Label>
                  <Input
                    placeholder="e.g. 1, 3, 5-10"
                    value={pagesToExtract}
                    onChange={(e) => setPagesToExtract(e.target.value)}
                    className="h-14 rounded-2xl text-base font-medium"
                  />
                  <p className="text-xs text-muted-foreground">
                    Separate with commas. Use hyphens for ranges. Total pages: {pageCount}
                  </p>
                </div>

                {pagesToExtract && (
                  <div className="flex flex-wrap gap-2">
                    {parsed.map((p) => (
                      <span
                        key={p}
                        className={cn(
                          "inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold",
                          p >= 1 && p <= pageCount
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground line-through"
                        )}
                      >
                        {p}
                        {p >= 1 && p <= pageCount && <Check className="w-3 h-3" />}
                      </span>
                    ))}
                  </div>
                )}

                <div className="p-4 rounded-2xl bg-muted/30 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Pages selected</span>
                    <span className="font-bold text-primary">{validCount}</span>
                  </div>
                </div>

                <Button
                  onClick={extract}
                  disabled={loading || validCount === 0}
                  className="w-full h-14 rounded-2xl text-base font-bold"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                      Extracting...
                    </>
                  ) : (
                    <>
                      <Files className="w-5 h-5 mr-2" />
                      Extract {validCount} Page{validCount !== 1 ? "s" : ""}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-6 bg-muted/20 rounded-[2.5rem] border border-dashed border-border/40 min-h-[400px]">
              <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center">
                <Files className="w-10 h-10 text-muted-foreground/30" />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-lg">Upload a PDF</h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                  Upload a PDF file to extract specific pages from it.
                </p>
              </div>
            </div>
          )}

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
      </div>
    </ToolLayout>
  );
}
