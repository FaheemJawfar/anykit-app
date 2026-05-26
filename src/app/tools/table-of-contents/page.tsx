"use client";

import { ToolLayout } from "@/components/tool-layout";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { List, FileUp, FileText, RefreshCw, AlertCircle } from "lucide-react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import * as pdfjs from "pdfjs-dist";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";

function sanitizeForWinAnsi(text: string): string {
  // Replace common non-WinAnsi characters with ASCII equivalents
  return text
    .replace(/[–—]/g, "-")
    .replace(/[“”"]/g, '"')
    .replace(/[‘']/g, "'")
    .replace(/…/g, "...")
    .replace(/[•·]/g, "*")
    .replace(/[©®™]/g, "")
    .replace(/[α-ωΑ-Ω]/g, "")
    .replace(/[←→↑↓↔↕]/g, "")
    .replace(/[^\x00-\xFF]/g, ""); // Strip any remaining non-Latin-1 chars
}

interface TOCItem {
  title: string;
  page: number;
  level: number;
}

export default function TableOfContents() {
  const [file, setFile] = useState<File | null>(null);
  const [pdfDoc, setPdfDoc] = useState<PDFDocument | null>(null);
  const [tocItems, setTocItems] = useState<TOCItem[]>([]);
  const [tocTitle, setTocTitle] = useState("Table of Contents");
  const [fontSize, setFontSize] = useState(14);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (f: File) => {
    if (f.type !== "application/pdf") return;
    setFile(f);
    setError(null);
    setTocItems([]);

    try {
      const buffer = await f.arrayBuffer();
      const doc = await PDFDocument.load(buffer);
      setPdfDoc(doc);

      // Extract bookmarks as TOC items
      const pdfJsDoc = await pdfjs.getDocument({ data: buffer }).promise;
      const outline = await pdfJsDoc.getOutline();

      const items: TOCItem[] = [];
      if (outline && outline.length > 0) {
        const extractItems = async (entries: any[], level: number = 0) => {
          for (const entry of entries) {
            let pageIndex = 1;
            try {
              const dest = await pdfJsDoc.getDestination(entry.dest);
              if (dest) {
                const ref = await pdfJsDoc.getPageIndex(dest[0]);
                pageIndex = ref + 1;
              }
            } catch {
              pageIndex = 1;
            }
            items.push({ title: entry.title, page: pageIndex, level });
            if (entry.items && entry.items.length > 0) {
              await extractItems(entry.items, level + 1);
            }
          }
        };
        await extractItems(outline);
      }

      setTocItems(items);
    } catch (e: any) {
      setError(e.message || "Failed to load PDF.");
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const generateTOC = async () => {
    if (!pdfDoc || !file) return;
    setLoading(true);
    setError(null);

    try {
      const newPdfDoc = await PDFDocument.create();
      const font = await newPdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await newPdfDoc.embedFont(StandardFonts.HelveticaBold);

      const pageWidth = 612;
      const pageHeight = 792;
      const margin = 72;
      const contentWidth = pageWidth - margin * 2;

      // Create TOC page
      let tocPage = newPdfDoc.addPage([pageWidth, pageHeight]);
      let y = pageHeight - margin - fontSize * 2;

      // Title
      tocPage.drawText(sanitizeForWinAnsi(tocTitle), {
        x: margin,
        y,
        font: boldFont,
        size: fontSize + 4,
        color: rgb(0, 0, 0),
      });
      y -= fontSize * 3;

      // TOC items
      const items = tocItems.length > 0 ? tocItems : [];
      if (items.length === 0) {
        tocPage.drawText("No bookmarks found. Generate from page text instead.", {
          x: margin,
          y,
          font,
          size: fontSize,
          color: rgb(0.5, 0.5, 0.5),
        });
      } else {
        for (const item of items) {
          if (y < margin + fontSize) {
            tocPage = newPdfDoc.addPage([pageWidth, pageHeight]);
            y = pageHeight - margin;
          }

          const indent = item.level * 20;
          let titleText = sanitizeForWinAnsi(item.title);
          const pageText = String(item.page);

          const pageNumWidth = font.widthOfTextAtSize(pageText, fontSize);
          const rightColX = pageWidth - margin; // page number right-aligned here
          const pageNumX = rightColX - pageNumWidth;
          const dotsEndX = pageNumX - 8;
          const titleStartX = margin + indent;

          // Truncate title if too long (reserve 40pt for dots + page number + gap)
          const maxTitleWidth = dotsEndX - titleStartX - 40;
          if (font.widthOfTextAtSize(titleText, fontSize) > maxTitleWidth) {
            let truncated = titleText;
            while (font.widthOfTextAtSize(truncated + "..", fontSize) > maxTitleWidth && truncated.length > 3) {
              truncated = truncated.slice(0, -1);
            }
            titleText = truncated + "..";
          }

          const titleWidth = font.widthOfTextAtSize(titleText, fontSize);

          tocPage.drawText(titleText, {
            x: titleStartX,
            y,
            font,
            size: fontSize,
            color: rgb(0, 0, 0),
          });

          // Draw dots between title and page number
          const dotsWidth = dotsEndX - (titleStartX + titleWidth + 5);
          if (dotsWidth > 10) {
            const dots = ".".repeat(Math.floor(dotsWidth / (fontSize * 0.28)));
            tocPage.drawText(dots, {
              x: titleStartX + titleWidth + 5,
              y,
              font,
              size: fontSize,
              color: rgb(0.7, 0.7, 0.7),
            });
          }

          tocPage.drawText(pageText, {
            x: pageNumX,
            y,
            font,
            size: fontSize,
            color: rgb(0, 0, 0),
          });

          y -= fontSize * 1.8;
        }
      }

      // Copy original pages
      for (let i = 0; i < pdfDoc.getPageCount(); i++) {
        const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [i]);
        newPdfDoc.addPage(copiedPage);
      }

      const bytes = await newPdfDoc.save();
      const blob = new Blob([bytes.slice()], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `toc-${file.name}`;
      a.click();
      URL.revokeObjectURL(url);

      setTocItems([]);
      setFile(null);
      setPdfDoc(null);
    } catch (e: any) {
      setError(e.message || "Failed to generate table of contents.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout toolId="table-of-contents">

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
              <List className="w-5 h-5 text-primary" />
              <h3 className="font-bold">Table of Contents</h3>
            </div>

            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium">Title</Label>
                <input
                  type="text"
                  value={tocTitle}
                  onChange={(e) => setTocTitle(e.target.value)}
                  className="mt-1 w-full h-10 px-3 rounded-xl border border-border/40 bg-card/60 text-sm"
                  placeholder="Table of Contents"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Font Size</Label>
                <select
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="mt-1 w-full h-10 px-3 rounded-xl border border-border/40 bg-card/60 text-sm"
                >
                  <option value={10}>Small (10pt)</option>
                  <option value={12}>Medium (12pt)</option>
                  <option value={14}>Large (14pt)</option>
                  <option value={16}>Extra Large (16pt)</option>
                </select>
              </div>
            </div>

            {tocItems.length > 0 && (
              <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
                <p className="text-sm text-muted-foreground">
                  Found {tocItems.length} bookmark(s) to include in TOC.
                </p>
              </div>
            )}

            <Button
              onClick={generateTOC}
              disabled={!file || !pdfDoc || loading}
              className="w-full h-14 rounded-2xl text-base font-bold"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <List className="w-5 h-5 mr-2" />
                  Generate TOC
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
