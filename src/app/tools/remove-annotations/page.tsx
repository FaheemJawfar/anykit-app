"use client";

import { ToolLayout } from "@/components/tool-layout";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Eraser, FileUp, FileText, RefreshCw, AlertCircle } from "lucide-react";
import { PDFDocument, PDFName } from "pdf-lib";

export default function RemoveAnnotations() {
  const [file, setFile] = useState<File | null>(null);
  const [pdfDoc, setPdfDoc] = useState<PDFDocument | null>(null);
  const [annotCount, setAnnotCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (f: File) => {
    if (f.type !== "application/pdf") return;
    setFile(f);
    setError(null);
    setAnnotCount(0);

    try {
      const buffer = await f.arrayBuffer();
      const doc = await PDFDocument.load(buffer);
      setPdfDoc(doc);

      let count = 0;
      for (const page of doc.getPages()) {
        const annots = page.node.Annots()?.asArray() || [];
        count += annots.length;
      }
      setAnnotCount(count);
    } catch (e: any) {
      setError(e.message || "Failed to load PDF.");
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const removeAnnotations = async () => {
    if (!pdfDoc || !file) return;
    setLoading(true);
    setError(null);

    try {
      const pages = pdfDoc.getPages();
      let removed = 0;

      for (const page of pages) {
        const annotRefs = page.node.Annots()?.asArray() || [];
        if (annotRefs.length > 0) {
          page.node.delete(PDFName.of("Annots"));
          removed += annotRefs.length;
        }
      }

      const bytes = await pdfDoc.save();
      const blob = new Blob([bytes.slice()], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name;
      a.click();
      URL.revokeObjectURL(url);

      setAnnotCount(0);
      setFile(null);
      setPdfDoc(null);
    } catch (e: any) {
      setError(e.message || "Failed to remove annotations.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout toolId="remove-annotations">

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
                  <p className="text-xs text-muted-foreground">{formatSize(file.size)}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
          <CardContent className="p-8 space-y-6">
            <div className="flex items-center gap-2">
              <Eraser className="w-5 h-5 text-primary" />
              <h3 className="font-bold">Remove Annotations</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Removes all annotations including comments, highlights, and links from every page.
            </p>

            {file && (
              <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
                <p className="text-sm">
                  <span className="text-muted-foreground">Annotations found:</span>{" "}
                  <span className="font-bold text-primary">{annotCount}</span>
                </p>
              </div>
            )}

            <Button
              onClick={removeAnnotations}
              disabled={!file || !pdfDoc || loading || annotCount === 0}
              className="w-full h-14 rounded-2xl text-base font-bold"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  Removing...
                </>
              ) : (
                <>
                  <Eraser className="w-5 h-5 mr-2" />
                  Remove Annotations
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
    </ToolLayout>
  );
}
