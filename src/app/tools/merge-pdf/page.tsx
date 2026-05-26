"use client";

import { ToolLayout } from "@/components/tool-layout";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  GitMerge,
  Trash2,
  Zap,
  FileUp,
  FileText,
  RefreshCw,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  X,
  Download,
  GripVertical,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PDFDocument } from "pdf-lib";

interface PDFFile {
  id: string;
  file: File;
  name: string;
  pageCount?: number;
}

export default function MergePDF() {
  const [files, setFiles] = useState<PDFFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateId = () => Math.random().toString(36).slice(2, 9);

  const addFiles = async (newFiles: File[]) => {
    const pdfFiles = newFiles.filter((f) => f.type === "application/pdf");
    if (pdfFiles.length === 0) return;

    setError(null);
    const entries: PDFFile[] = [];

    for (const file of pdfFiles) {
      try {
        const buffer = await file.arrayBuffer();
        const doc = await PDFDocument.load(buffer);
        entries.push({
          id: generateId(),
          file,
          name: file.name,
          pageCount: doc.getPageCount(),
        });
      } catch {
        entries.push({ id: generateId(), file, name: file.name });
      }
    }

    setFiles((prev) => [...prev, ...entries]);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const moveFile = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= files.length) return;
    setFiles((prev) => {
      const next = [...prev];
      [next[index], next[newIndex]] = [next[newIndex], next[index]];
      return next;
    });
  };

  const merge = async () => {
    if (files.length < 2) return;
    setLoading(true);
    setError(null);

    try {
      const merged = await PDFDocument.create();

      for (const entry of files) {
        const buffer = await entry.file.arrayBuffer();
        const doc = await PDFDocument.load(buffer);
        const pages = await merged.copyPages(doc, doc.getPageIndices());
        pages.forEach((page) => merged.addPage(page));
      }

      const bytes = await merged.save();
      const blob = new Blob([bytes.slice()], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `merged-${files.length}-pdfs.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      setError(e.message || "Failed to merge PDFs.");
    } finally {
      setLoading(false);
    }
  };

  const totalPages = files.reduce((sum, f) => sum + (f.pageCount || 0), 0);

  return (
    <ToolLayout toolId="merge-pdf">

      <div className="space-y-6">
        {/* Upload Zone */}
        <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
          <CardContent className="p-8">
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                addFiles(Array.from(e.dataTransfer.files));
              }}
              className="relative group h-48 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center transition-all cursor-pointer border-border/60 hover:border-primary/40 hover:bg-primary/5"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => e.target.files && addFiles(Array.from(e.target.files))}
                className="hidden"
                accept="application/pdf"
                multiple
              />
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                <FileUp className="w-8 h-8" />
              </div>
              <div className="text-center">
                <h3 className="font-bold text-lg">Add PDF Files</h3>
                <p className="text-sm text-muted-foreground mt-1">Click or drag PDFs here</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* File List */}
        {files.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-primary" />
                <span className="font-bold text-sm">
                  {files.length} file{files.length !== 1 ? "s" : ""} · {totalPages} pages
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setFiles([])} className="text-destructive hover:text-destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Clear all
              </Button>
            </div>

            <div className="space-y-2">
              {files.map((entry, index) => (
                <div
                  key={entry.id}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-card/60 border border-border/40 hover:border-primary/20 transition-all"
                >
                  <GripVertical className="w-4 h-4 text-muted-foreground/50 shrink-0" />
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{entry.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {entry.pageCount ? `${entry.pageCount} pages` : "PDF Document"}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-lg"
                      onClick={() => moveFile(index, -1)}
                      disabled={index === 0}
                    >
                      <ArrowUp className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-lg"
                      onClick={() => moveFile(index, 1)}
                      disabled={index === files.length - 1}
                    >
                      <ArrowDown className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-lg text-destructive hover:text-destructive"
                      onClick={() => removeFile(entry.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {files.length >= 2 && (
              <Button
                onClick={merge}
                disabled={loading}
                className="w-full h-14 rounded-2xl text-base font-bold"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    Merging PDFs...
                  </>
                ) : (
                  <>
                    <GitMerge className="w-5 h-5 mr-2" />
                    Merge {files.length} PDFs
                  </>
                )}
              </Button>
            )}
          </div>
        )}

        {error && (
          <div className="p-6 rounded-3xl border-2 border-destructive/30 bg-destructive/5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-destructive text-white flex items-center justify-center shrink-0">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-destructive">Merge Failed</h3>
              <p className="text-sm text-destructive/80">{error}</p>
            </div>
          </div>
        )}

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
    </ToolLayout>
  );
}
