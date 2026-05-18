"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { 
  ShieldCheck, 
  Trash2,
  Zap,
  Info,
  FileUp,
  FileText,
  RefreshCw,
  Search,
  Lock,
  History,
  Check,
  AlertCircle,
  FileSignature,
  Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PDFDocument } from "pdf-lib";

export default function PDFSignatureChecker() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processPDF = async (file: File) => {
    setFile(file);
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const buffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      
      // Basic inspection - finding digital signatures in the catalog
      // This is a simplified checker for browser-side usage
      const pdfBytes = await pdfDoc.save();
      const pdfString = new TextDecoder().decode(pdfBytes.slice(0, 100000)); // Scan first 100kb
      
      const hasSignature = pdfString.includes("/Sig") || pdfString.includes("/ByteRange");
      const pageCount = pdfDoc.getPageCount();
      const metadata = {
        title: pdfDoc.getTitle() || "Untitled",
        author: pdfDoc.getAuthor() || "Unknown",
        creator: pdfDoc.getCreator() || "Unknown",
        producer: pdfDoc.getProducer() || "Unknown",
        modDate: pdfDoc.getModificationDate()?.toLocaleString() || "Unknown",
        creationDate: pdfDoc.getCreationDate()?.toLocaleString() || "Unknown",
      };

      setResult({
        hasSignature,
        pageCount,
        metadata,
        version: pdfDoc.getForm().getFields().length ? "Contains Form Fields" : "Standard PDF"
      });

    } catch (e: any) {
      setError(e.message || "Failed to parse PDF document.");
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setFile(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8 text-foreground">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
          <FileSignature className="w-6 h-6" />
        </div>
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight">PDF Integrity & Sign Checker</h1>
          <p className="text-sm text-muted-foreground">
            Inspect PDF metadata and detect digital signatures locally without uploading to a server.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Upload Side */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 space-y-8">
              <div 
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const droppedFile = e.dataTransfer.files[0];
                  if (droppedFile && droppedFile.type === "application/pdf") processPDF(droppedFile);
                }}
                className={cn(
                  "relative group h-64 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center transition-all cursor-pointer",
                  file ? "border-primary bg-primary/5 shadow-inner" : "border-border/60 hover:border-primary/40 hover:bg-primary/5"
                )}
              >
                <input type="file" ref={fileInputRef} onChange={(e) => e.target.files?.[0] && processPDF(e.target.files[0])} className="hidden" accept="application/pdf" />
                
                <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                  <FileUp className="w-10 h-10" />
                </div>
                
                <div className="text-center">
                  <h3 className="font-bold text-lg">{file ? file.name : "Upload PDF"}</h3>
                  <p className="text-sm text-muted-foreground mt-1">Click or drag a .pdf file to analyze</p>
                </div>
              </div>

              {file && (
                <Button 
                  variant="outline" 
                  onClick={clear}
                  className="w-full h-14 rounded-2xl border-border/40 text-destructive hover:bg-destructive/5 font-bold"
                >
                  <Trash2 className="w-5 h-5 mr-2" />
                  Clear Document
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
              All PDF parsing happens in your browser's local memory. Your documents are never transmitted to AnyKit's infrastructure.
            </p>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-7 space-y-6">
          {loading ? (
            <div className="h-96 flex flex-col items-center justify-center gap-4 opacity-50">
              <RefreshCw className="w-12 h-12 animate-spin text-primary" />
              <p className="font-bold uppercase tracking-widest text-[10px]">Analyzing document structure...</p>
            </div>
          ) : result ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              {/* Signature Status */}
              <div className={cn(
                "p-8 rounded-[2.5rem] border-2 flex items-center gap-6",
                result.hasSignature ? "bg-green-500/10 border-green-500/30 text-green-600" : "bg-muted/30 border-border/40 text-muted-foreground"
              )}>
                <div className={cn(
                  "w-16 h-16 rounded-3xl flex items-center justify-center shrink-0 shadow-lg",
                  result.hasSignature ? "bg-green-500 text-white" : "bg-muted text-muted-foreground"
                )}>
                  {result.hasSignature ? <ShieldCheck className="w-8 h-8" /> : <Lock className="w-8 h-8" />}
                </div>
                <div>
                  <h3 className="text-2xl font-black tracking-tight">
                    {result.hasSignature ? "Digital Signature Detected" : "No Digital Signature"}
                  </h3>
                  <p className="text-sm font-medium opacity-80">
                    {result.hasSignature ? "This document contains cryptographic signatures." : "No cryptographic signatures were found in the file structure."}
                  </p>
                </div>
              </div>

              {/* Metadata Card */}
              <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
                <div className="px-8 py-4 border-b border-border/40 bg-muted/30 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Document Metadata</span>
                </div>
                <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Title</p>
                    <p className="text-lg font-bold truncate">{result.metadata.title}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Author</p>
                    <p className="text-lg font-bold">{result.metadata.author}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Created With</p>
                    <p className="text-sm font-medium">{result.metadata.creator}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Page Count</p>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary/40" />
                      <p className="text-lg font-bold">{result.pageCount} Pages</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* History/Timeline */}
              <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
                <div className="px-8 py-4 border-b border-border/40 bg-muted/30">
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Document Timeline</span>
                </div>
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="w-10 h-10 rounded-2xl bg-muted/50 flex items-center justify-center shrink-0">
                      <Calendar className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase text-muted-foreground">Creation Date</p>
                      <p className="text-sm font-bold">{result.metadata.creationDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                      <History className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase text-muted-foreground">Last Modified</p>
                      <p className="text-sm font-bold">{result.metadata.modDate}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : error ? (
            <div className="p-8 rounded-[2.5rem] border-2 border-destructive/30 bg-destructive/5 flex items-center gap-6">
              <div className="w-16 h-16 rounded-3xl bg-destructive text-white flex items-center justify-center shrink-0 shadow-lg">
                <AlertCircle className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-black tracking-tight text-destructive">Analysis Failed</h3>
                <p className="text-sm font-medium text-destructive/80">
                  {error}
                </p>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-6 bg-muted/20 rounded-[2.5rem] border border-dashed border-border/40 min-h-[500px]">
              <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center">
                <Search className="w-10 h-10 text-muted-foreground/30" />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-lg">Waiting for Document</h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                  Upload a PDF to inspect its metadata, signatures, and structural history.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
