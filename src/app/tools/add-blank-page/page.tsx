"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  FilePlus,
  Trash2,
  Zap,
  FileUp,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PDFDocument } from "pdf-lib";

export default function AddBlankPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [position, setPosition] = useState("1");
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
      const count = doc.getPageCount();
      setPageCount(count);
      setPosition("1");
    } catch {
      setPageCount(0);
    }
  };

  const addPage = async () => {
    if (!file) return;
    const pos = parseInt(position, 10);
    if (isNaN(pos) || pos < 1 || pos > pageCount + 1) {
      setError(`Position must be between 1 and ${pageCount + 1}.`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const buffer = await file.arrayBuffer();
      const doc = await PDFDocument.load(buffer);
      const newDoc = await PDFDocument.create();

      const { width, height } = doc.getPage(0).getSize();
      const blankPage = newDoc.addPage([width, height]);

      const allPages = [];
      for (let i = 0; i < doc.getPageCount(); i++) {
        if (i === pos - 1) {
          allPages.push(blankPage);
        }
        allPages.push(null);
      }
      if (pos > doc.getPageCount()) {
        allPages.push(blankPage);
      }

      const originalPages = await newDoc.copyPages(doc, doc.getPageIndices());
      let originalIndex = 0;
      for (const p of allPages) {
        if (p === null) {
          newDoc.addPage(originalPages[originalIndex++]);
        }
      }

      const bytes = await newDoc.save();
      const blob = new Blob([bytes.slice()], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `blank-page-added.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      setError(e.message || "Failed to add blank page.");
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setFile(null);
    setPageCount(0);
    setPosition("1");
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-8 text-foreground">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
          <FilePlus className="w-6 h-6" />
        </div>
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight">Add Blank Page</h1>
          <p className="text-sm text-muted-foreground">
            Insert an empty page anywhere in your PDF document.
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
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Insert Position</span>
              </div>
              <CardContent className="p-8 space-y-8">
                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Page Position
                  </Label>
                  <Input
                    type="number"
                    min={1}
                    max={pageCount + 1}
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="h-14 rounded-2xl text-lg font-bold text-center"
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter a number from 1 to {pageCount + 1}. The blank page will be inserted before the selected page.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-muted/30 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Current pages</span>
                    <span className="font-bold">{pageCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">After insertion</span>
                    <span className="font-bold text-primary">{pageCount + 1}</span>
                  </div>
                </div>

                <Button
                  onClick={addPage}
                  disabled={loading}
                  className="w-full h-14 rounded-2xl text-base font-bold"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FilePlus className="w-5 h-5 mr-2" />
                      Add Blank Page
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-6 bg-muted/20 rounded-[2.5rem] border border-dashed border-border/40 min-h-[400px]">
              <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center">
                <FilePlus className="w-10 h-10 text-muted-foreground/30" />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-lg">Upload a PDF</h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                  Upload a PDF file to insert a blank page.
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
