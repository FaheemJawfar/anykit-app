"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileUp, 
  Copy, 
  Check, 
  Trash2,
  Zap,
  Download,
  Link,
  Info,
  ExternalLink,
  Image as ImageIcon,
  FileImage,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Base64ImageToFile() {
  const [input, setInput] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [fileInfo, setFileInfo] = useState<{ type: string; size: number } | null>(null);

  const processBase64 = (val: string) => {
    setInput(val);
    setError(null);
    setPreview(null);
    setFileInfo(null);

    if (!val.trim()) return;

    try {
      let base64String = val.trim();
      let mimeType = "image/png"; // Default

      if (base64String.startsWith("data:")) {
        const match = base64String.match(/^data:(.*?);base64,(.*)$/);
        if (match) {
          mimeType = match[1];
          base64String = match[2];
        }
      }

      // Validate base64
      try {
        atob(base64String);
      } catch (e) {
        throw new Error("Invalid Base64 string format.");
      }

      const fullDataUri = `data:${mimeType};base64,${base64String}`;
      setPreview(fullDataUri);

      // Estimate size
      const binaryString = atob(base64String);
      setFileInfo({
        type: mimeType,
        size: binaryString.length
      });

    } catch (e: any) {
      setError(e.message || "Failed to process Base64 string.");
    }
  };

  const downloadImage = () => {
    if (!preview || !fileInfo) return;
    const extension = fileInfo.type.split('/')[1] || 'png';
    const a = document.createElement("a");
    a.href = preview;
    a.download = `exported-image-${Date.now()}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    return `${(bytes / 1024).toFixed(2)} KB`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8 text-foreground">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
          <FileImage className="w-6 h-6" />
        </div>
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight">Base64 to Image File</h1>
          <p className="text-sm text-muted-foreground">
            Convert a Base64 string back into a downloadable image file with instant preview.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Side */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col min-h-[400px]">
            <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <Link className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Base64 String</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => processBase64("")} className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <CardContent className="p-0 flex-1 relative">
              <Textarea
                placeholder="Paste your Base64 string here (with or without data URI prefix)..."
                value={input}
                onChange={(e) => processBase64(e.target.value)}
                className="w-full h-full min-h-[350px] p-8 bg-transparent border-none focus-visible:ring-0 resize-none font-mono text-xs leading-relaxed break-all"
              />
            </CardContent>
          </Card>

          {error && (
            <div className="p-6 rounded-[2rem] bg-destructive/5 border border-destructive/20 flex items-start gap-4 animate-in zoom-in-95">
              <div className="w-12 h-12 rounded-2xl bg-destructive/10 flex items-center justify-center text-destructive shrink-0">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-destructive">Process Error</h3>
                <p className="text-xs font-mono text-destructive/80 leading-relaxed">
                  {error}
                </p>
              </div>
            </div>
          )}

          <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-primary">Tool Info</h3>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              This tool automatically detects the MIME type from the Data URI. If no prefix is present, it defaults to PNG. All conversion happens entirely in your browser.
            </p>
          </div>
        </div>

        {/* Results Side */}
        <div className="lg:col-span-7 h-full">
          <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col min-h-[500px]">
            <div className="px-8 py-6 border-b border-border/40 bg-primary/5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <ImageIcon className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-primary">Image Preview</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={downloadImage}
                disabled={!preview}
                className={cn(
                  "rounded-xl font-bold px-4 hover:bg-primary/10 transition-all",
                  preview && "text-green-500 hover:text-green-500"
                )}
              >
                <Download className="w-4 h-4 mr-2" />
                Download File
              </Button>
            </div>
            <CardContent className="p-12 flex-1 flex flex-col items-center justify-center bg-primary/[0.01]">
              {preview ? (
                <div className="space-y-8 w-full flex flex-col items-center animate-in fade-in duration-500">
                  <div className="relative group max-w-full max-h-[400px] rounded-2xl overflow-hidden shadow-2xl transition-all hover:scale-[1.02]">
                    <img src={preview} alt="Decoded" className="max-w-full h-auto object-contain" />
                    <div className="absolute inset-0 border-2 border-primary/5 rounded-2xl pointer-events-none" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                    <div className="p-4 rounded-2xl bg-muted/30 border border-border/20 text-center">
                      <p className="text-[8px] font-black uppercase text-muted-foreground tracking-widest mb-1">Mime Type</p>
                      <p className="text-sm font-bold text-primary">{fileInfo?.type}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-muted/30 border border-border/20 text-center">
                      <p className="text-[8px] font-black uppercase text-muted-foreground tracking-widest mb-1">File Size</p>
                      <p className="text-sm font-bold text-primary">{fileInfo ? formatSize(fileInfo.size) : '0 B'}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center py-20 text-center opacity-30 gap-4">
                  <ImageIcon className="w-20 h-20" />
                  <p className="italic font-medium">Your image will appear here after pasting Base64 data...</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
