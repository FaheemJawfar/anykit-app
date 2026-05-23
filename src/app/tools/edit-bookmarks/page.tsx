"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Bookmark, FileUp, FileText, RefreshCw, AlertCircle, Download, Trash2 } from "lucide-react";
import { PDFDocument, PDFName, PDFNumber, PDFHexString } from "pdf-lib";
import * as pdfjs from "pdfjs-dist";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";

interface BookmarkItem {
  title: string;
  page: number;
}

export default function EditBookmarks() {
  const [file, setFile] = useState<File | null>(null);
  const [pdfDoc, setPdfDoc] = useState<PDFDocument | null>(null);
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newPage, setNewPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (f: File) => {
    if (f.type !== "application/pdf") return;
    setFile(f);
    setError(null);
    setBookmarks([]);

    try {
      const buffer = await f.arrayBuffer();
      const doc = await PDFDocument.load(buffer);
      setPdfDoc(doc);

      // Try to extract bookmarks using pdfjs
      const pdfJsDoc = await pdfjs.getDocument({ data: buffer }).promise;
      const outline = await pdfJsDoc.getOutline();

      const extracted: BookmarkItem[] = [];
      if (outline && outline.length > 0) {
        const extractItems = async (items: any[], depth: number = 0) => {
          for (const item of items) {
            if (item.dest) {
              let pageIndex = 0;
              try {
                const dest = await pdfJsDoc.getDestination(item.dest);
                if (dest) {
                  const ref = await pdfJsDoc.getPageIndex(dest[0]);
                  pageIndex = ref + 1;
                }
              } catch {
                pageIndex = 1;
              }
              extracted.push({
                title: "  ".repeat(depth) + item.title,
                page: pageIndex,
              });
            }
            if (item.items && item.items.length > 0) {
              await extractItems(item.items, depth + 1);
            }
          }
        };
        await extractItems(outline);
      }
      setBookmarks(extracted);
    } catch (e: any) {
      setError(e.message || "Failed to load PDF.");
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const applyBookmarksToPdf = async (doc: PDFDocument, bms: BookmarkItem[]) => {
    const pages = doc.getPages();
    const outlinesDict = doc.context.obj({});
    const outlinesRef = doc.context.register(outlinesDict);

    const items: { ref: any; dict: any }[] = [];

    for (let i = 0; i < bms.length; i++) {
      const bm = bms[i];
      const itemDict = doc.context.obj({}) as any;
      const itemRef = doc.context.register(itemDict);

      itemDict.set(PDFName.of("Title"), PDFHexString.fromText(bm.title));
      itemDict.set(PDFName.of("Parent"), outlinesRef);

      const pageIndex = Math.max(0, Math.min(bm.page - 1, pages.length - 1));
      const pageRef = pages[pageIndex].ref;

      const destArray = doc.context.obj([pageRef, PDFName.of("Fit")] as (any | PDFName)[]);
      itemDict.set(PDFName.of("Dest"), destArray);

      if (i > 0) {
        itemDict.set(PDFName.of("Prev"), items[i - 1].ref);
        items[i - 1].dict.set(PDFName.of("Next"), itemRef);
      }

      items.push({ ref: itemRef, dict: itemDict });
    }

    if (items.length > 0) {
      outlinesDict.set(PDFName.of("Type"), PDFName.of("Outlines"));
      outlinesDict.set(PDFName.of("First"), items[0].ref);
      outlinesDict.set(PDFName.of("Last"), items[items.length - 1].ref);
      outlinesDict.set(PDFName.of("Count"), doc.context.obj(items.length));
    }

    doc.catalog.set(PDFName.of("Outlines"), outlinesRef);
  };

  const downloadPdf = async (doc: PDFDocument, filename: string) => {
    const bytes = await doc.save();
    const blob = new Blob([bytes.slice()], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const removeAllBookmarks = async () => {
    if (!pdfDoc || !file) return;
    setLoading(true);
    setError(null);

    try {
      pdfDoc.catalog.delete(PDFName.of("Outlines"));

      await downloadPdf(pdfDoc, file.name);

      setBookmarks([]);
      setFile(null);
      setPdfDoc(null);
    } catch (e: any) {
      setError(e.message || "Failed to remove bookmarks.");
    } finally {
      setLoading(false);
    }
  };

  const exportBookmarks = () => {
    if (bookmarks.length === 0) return;
    const data = JSON.stringify(bookmarks, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bookmarks.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const importBookmarks = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!pdfDoc || !file) {
      setError("Upload a PDF first.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const text = await f.text();
      const data = JSON.parse(text);
      if (!Array.isArray(data)) {
        setError("Invalid JSON file: expected an array.");
        setLoading(false);
        return;
      }

      const imported = data.map((item: any) => ({
        title: item.title || "Untitled",
        page: item.page || 1,
      }));

      setBookmarks(imported);

      // Auto-apply to PDF
      await applyBookmarksToPdf(pdfDoc, imported);
      await downloadPdf(pdfDoc, file.name);

      setFile(null);
      setPdfDoc(null);
      setBookmarks([]);
    } catch (e: any) {
      setError(e.message || "Failed to import bookmarks.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-8 text-foreground">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
          <Bookmark className="w-6 h-6" />
        </div>
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight">Edit Bookmarks</h1>
          <p className="text-sm text-muted-foreground">
            View, export, import, and remove PDF bookmarks.
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
                  <p className="text-xs text-muted-foreground">{formatSize(file.size)}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
          <CardContent className="p-8 space-y-6">
            <div className="flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-primary" />
              <h3 className="font-bold">Bookmarks</h3>
            </div>

            {bookmarks.length > 0 ? (
              <>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {bookmarks.map((bm, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-xl bg-card/60 border border-border/40"
                    >
                      <span className="text-sm truncate flex-1">{bm.title}</span>
                      <span className="text-xs text-muted-foreground ml-2">Page {bm.page}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={exportBookmarks}
                    className="flex-1 rounded-xl"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export JSON
                  </Button>
                  <label className="flex-1">
                    <input
                      type="file"
                      accept="application/json"
                      onChange={importBookmarks}
                      className="hidden"
                    />
                    <div className="w-full h-10 flex items-center justify-center rounded-xl border border-input bg-background hover:bg-accent hover:text-accent-foreground cursor-pointer text-sm font-medium">
                      Import JSON
                    </div>
                  </label>
                </div>
                <Button
                  onClick={removeAllBookmarks}
                  disabled={loading}
                  variant="destructive"
                  className="w-full h-14 rounded-2xl text-base font-bold"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                      Removing...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-5 h-5 mr-2" />
                      Remove All Bookmarks
                    </>
                  )}
                </Button>
              </>
            ) : file ? (
              <p className="text-sm text-muted-foreground">No bookmarks found in this PDF.</p>
            ) : (
              <p className="text-sm text-muted-foreground">Upload a PDF to see bookmarks.</p>
            )}
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
