"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Heading, FileUp, FileText, RefreshCw, AlertCircle } from "lucide-react";
import { PDFDocument, rgb } from "pdf-lib";

export default function HeaderFooter() {
  const [file, setFile] = useState<File | null>(null);
  const [header, setHeader] = useState("");
  const [footer, setFooter] = useState("");
  const [fontSize, setFontSize] = useState(10);
  const [headerAlign, setHeaderAlign] = useState<string>("center");
  const [footerAlign, setFooterAlign] = useState<string>("center");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (f: File) => {
    if (f.type !== "application/pdf") return;
    setFile(f);
    setError(null);
  };

  const getX = (align: string, width: number, margin: number) => {
    switch (align) {
      case "left":
        return margin;
      case "center":
        return width / 2;
      case "right":
        return width - margin;
      default:
        return width / 2;
    }
  };

  const apply = async () => {
    if (!file || (!header && !footer)) return;
    setLoading(true);
    setError(null);

    try {
      const buffer = await file.arrayBuffer();
      const doc = await PDFDocument.load(buffer);

      for (const page of doc.getPages()) {
        const { width, height } = page.getSize();
        const margin = 30;

        if (header) {
          const x = getX(headerAlign, width, margin);
          const y = height - margin;
          page.drawText(header, {
            x,
            y,
            size: fontSize,
            color: rgb(0.3, 0.3, 0.3),
          });
        }

        if (footer) {
          const x = getX(footerAlign, width, margin);
          const y = margin;
          page.drawText(footer, {
            x,
            y,
            size: fontSize,
            color: rgb(0.3, 0.3, 0.3),
          });
        }
      }

      const bytes = await doc.save();
      const blob = new Blob([bytes.slice()], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `header-footer-${file.name}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      setError(e.message || "Failed to add header/footer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-8 text-foreground">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
          <Heading className="w-6 h-6" />
        </div>
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight">Header & Footer</h1>
          <p className="text-sm text-muted-foreground">
            Add custom text to the top and bottom of every page.
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
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
          <CardContent className="p-8 space-y-6">
            <h3 className="font-bold">Text Settings</h3>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Header Text</Label>
              <input
                type="text"
                value={header}
                onChange={(e) => setHeader(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-border/40 bg-card/60 text-sm"
                placeholder="Document Title"
              />
              <div className="flex gap-2">
                {["left", "center", "right"].map((a) => (
                  <button
                    key={`h-${a}`}
                    onClick={() => setHeaderAlign(a)}
                    className={`flex-1 p-1.5 rounded-lg text-xs font-medium transition-all ${
                      headerAlign === a
                        ? "bg-primary text-white"
                        : "bg-muted hover:bg-muted/80"
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Footer Text</Label>
              <input
                type="text"
                value={footer}
                onChange={(e) => setFooter(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-border/40 bg-card/60 text-sm"
                placeholder="Company Name"
              />
              <div className="flex gap-2">
                {["left", "center", "right"].map((a) => (
                  <button
                    key={`f-${a}`}
                    onClick={() => setFooterAlign(a)}
                    className={`flex-1 p-1.5 rounded-lg text-xs font-medium transition-all ${
                      footerAlign === a
                        ? "bg-primary text-white"
                        : "bg-muted hover:bg-muted/80"
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Font Size</Label>
              <input
                type="number"
                min={6}
                max={48}
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full h-10 px-3 rounded-xl border border-border/40 bg-card/60 text-sm"
              />
            </div>

            <Button
              onClick={apply}
              disabled={!file || loading || (!header && !footer)}
              className="w-full h-14 rounded-2xl text-base font-bold"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  Applying...
                </>
              ) : (
                <>
                  <Heading className="w-5 h-5 mr-2" />
                  Add Header & Footer
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
            <h3 className="font-bold text-destructive">Failed</h3>
            <p className="text-sm text-destructive/80">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}
