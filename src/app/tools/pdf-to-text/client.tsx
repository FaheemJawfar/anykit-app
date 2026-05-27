"use client";

import { ToolLayout } from "@/components/tool-layout";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, FileUp, RefreshCw, AlertCircle } from "lucide-react";
import * as pdfjs from "pdfjs-dist";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";

export default function PDFToText() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [text, setText] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (f: File) => {
    if (f.type !== "application/pdf") return;
    setFile(f);
    setError(null);
    setText("");
  };

  const extract = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      let fullText = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map((item: any) => item.str).join(" ");
        fullText += `--- Page ${i} ---\n${pageText}\n\n`;
      }

      setText(fullText);

      const blob = new Blob([fullText], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${file.name.replace(/\.pdf$/i, "")}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      setError(e.message || "Failed to extract text.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout toolId="pdf-to-text">

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
                  <p className="text-xs text-muted-foreground">{file.size.toLocaleString()} bytes</p>
                </div>
              </div>
            )}

            <Button
              onClick={extract}
              disabled={!file || loading}
              className="w-full h-14 rounded-2xl text-base font-bold mt-6"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  Extracting...
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5 mr-2" />
                  Extract Text
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
          <CardContent className="p-8">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-primary" />
              <h3 className="font-bold">Extracted Text</h3>
            </div>
            {text ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-muted/30 border border-border/40 max-h-[400px] overflow-y-auto">
                  <pre className="text-xs whitespace-pre-wrap font-mono text-muted-foreground">{text}</pre>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    const blob = new Blob([text], { type: "text/plain" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `${file?.name.replace(/\.pdf$/i, "") || "document"}.txt`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="w-full rounded-2xl"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Download .txt
                </Button>
              </div>
            ) : (
              <div className="h-48 flex flex-col items-center justify-center text-muted-foreground">
                <FileText className="w-12 h-12 mb-3 opacity-30" />
                <p className="text-sm">Extracted text will appear here</p>
              </div>
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
            <h3 className="font-bold text-destructive">Extraction Failed</h3>
            <p className="text-sm text-destructive/80">{error}</p>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
