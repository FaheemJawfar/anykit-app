"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowUpDown,
  Trash2,
  Zap,
  FileUp,
  RefreshCw,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  Copy,
  X,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PDFDocument } from "pdf-lib";

interface PageItem {
  id: string;
  pageIndex: number;
  label: string;
}

export default function OrganizePDF() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateId = () => Math.random().toString(36).slice(2, 9);

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
      const count = doc.getPageCount();
      const items: PageItem[] = [];
      for (let i = 0; i < count; i++) {
        items.push({
          id: generateId(),
          pageIndex: i,
          label: `Page ${i + 1}`,
        });
      }
      setPages(items);
    } catch {
      setPages([]);
    }
  };

  const movePage = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= pages.length) return;
    setPages((prev) => {
      const next = [...prev];
      [next[index], next[newIndex]] = [next[newIndex], next[index]];
      return next;
    });
  };

  const duplicatePage = (index: number) => {
    setPages((prev) => {
      const next = [...prev];
      next.splice(index + 1, 0, { ...prev[index], id: generateId() });
      return next;
    });
  };

  const removePage = (index: number) => {
    setPages((prev) => prev.filter((_, i) => i !== index));
  };

  const download = async () => {
    if (!file || pages.length === 0) return;
    setLoading(true);
    setError(null);

    try {
      const buffer = await file.arrayBuffer();
      const doc = await PDFDocument.load(buffer);
      const newDoc = await PDFDocument.create();
      const indices = pages.map((p) => p.pageIndex);
      const copied = await newDoc.copyPages(doc, indices);
      copied.forEach((page) => newDoc.addPage(page));

      const bytes = await newDoc.save();
      const blob = new Blob([bytes.slice()], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `organized.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      setError(e.message || "Failed to organize PDF.");
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setFile(null);
    setPages([]);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-8 text-foreground">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
          <ArrowUpDown className="w-6 h-6" />
        </div>
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight">Organize PDF</h1>
          <p className="text-sm text-muted-foreground">
            Reorder, duplicate, or remove pages from your PDF.
          </p>
        </div>
      </div>

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
                    {file ? `${pages.length} pages` : "Click or drag a PDF file"}
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
              <div className="px-8 py-4 border-b border-border/40 bg-muted/30 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Pages</span>
                <span className="text-xs font-bold text-primary">{pages.length} pages</span>
              </div>
              <CardContent className="p-6 space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
                {pages.map((page, index) => (
                  <div
                    key={page.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-card/60 border border-border/40 hover:border-primary/20 transition-all"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                      {index + 1}
                    </div>
                    <span className="text-sm font-medium flex-1">{page.label}</span>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg"
                        onClick={() => movePage(index, -1)}
                        disabled={index === 0}
                      >
                        <ArrowUp className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg"
                        onClick={() => movePage(index, 1)}
                        disabled={index === pages.length - 1}
                      >
                        <ArrowDown className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg text-primary"
                        onClick={() => duplicatePage(index)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg text-destructive hover:text-destructive"
                        onClick={() => removePage(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
              <div className="px-8 py-4 border-t border-border/40">
                <Button
                  onClick={download}
                  disabled={loading || pages.length === 0}
                  className="w-full h-12 rounded-2xl text-base font-bold"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5 mr-2" />
                      Download Organized PDF
                    </>
                  )}
                </Button>
              </div>
            </Card>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-6 bg-muted/20 rounded-[2.5rem] border border-dashed border-border/40 min-h-[400px]">
              <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center">
                <ArrowUpDown className="w-10 h-10 text-muted-foreground/30" />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-lg">Upload a PDF</h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                  Upload a PDF file to reorder, duplicate, or remove pages.
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
    </div>
  );
}
