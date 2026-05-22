"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileUp, 
  Copy, 
  Check, 
  Zap,
  Info,
  Image,
  FileCode,
  FileText,
  AlertCircle,
  Download,
  Code
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function DataURIMaker() {
  const [dataUri, setDataUri] = useState("");
  const [fileInfo, setFileInfo] = useState<{ name: string; size: string; type: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [cssMode, setCssMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setDataUri(result);
      setFileInfo({
        name: file.name,
        size: (file.size / 1024).toFixed(2) + " KB",
        type: file.type || "unknown"
      });
    };
    reader.onerror = () => setError("Failed to read file.");
    reader.readAsDataURL(file);
  };

  const getCssOutput = () => {
    if (!dataUri) return "";
    return `background-image: url('${dataUri}');`;
  };

  const copyToClipboard = () => {
    const text = cssMode ? getCssOutput() : dataUri;
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8 text-foreground">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
          <FileCode className="w-6 h-6" />
        </div>
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight">Data URI Maker</h1>
          <p className="text-sm text-muted-foreground">
            Convert images, fonts, and small files into Base64 Data URIs for CSS embedding.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Upload Side */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 space-y-6">
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFile}
                className="hidden"
                accept="image/*,font/*,.svg,.woff,.woff2,.ttf,.otf"
              />
              
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full p-12 rounded-[2rem] border-2 border-dashed border-border/30 bg-muted/10 flex flex-col items-center gap-4 hover:border-primary/30 hover:bg-primary/[0.02] transition-all group"
              >
                <div className="w-16 h-16 rounded-2xl bg-muted/30 flex items-center justify-center group-hover:bg-primary/10 transition-all">
                  <FileUp className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-all" />
                </div>
                <div className="text-center space-y-1">
                  <p className="font-bold text-sm">Drop a file here or click to browse</p>
                  <p className="text-[10px] text-muted-foreground font-medium">Images, SVGs, Fonts (Max 2MB recommended)</p>
                </div>
              </button>

              {error && (
                <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              {fileInfo && (
                <div className="p-6 rounded-2xl bg-muted/20 border border-border/10 space-y-3">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">File Info</span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <p className="flex justify-between"><span className="text-muted-foreground">Name:</span> <span className="font-bold truncate max-w-[200px]">{fileInfo.name}</span></p>
                    <p className="flex justify-between"><span className="text-muted-foreground">Size:</span> <span className="font-bold">{fileInfo.size}</span></p>
                    <p className="flex justify-between"><span className="text-muted-foreground">Type:</span> <span className="font-bold">{fileInfo.type}</span></p>
                  </div>
                </div>
              )}

              {dataUri && fileInfo?.type.startsWith("image") && (
                <div className="rounded-2xl overflow-hidden border border-border/10 bg-muted/10 flex items-center justify-center h-40">
                  <img src={dataUri} alt="Preview" className="max-w-full max-h-full object-contain" />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Output Side */}
        <div className="lg:col-span-7">
          <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col min-h-[500px]">
            <div className="px-8 py-6 border-b border-border/40 bg-primary/5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <Code className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-primary">Output</span>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant={cssMode ? "default" : "outline"} 
                  size="sm" 
                  onClick={() => setCssMode(!cssMode)}
                  className="h-8 rounded-lg text-[10px] font-bold uppercase"
                >
                  {cssMode ? "Raw URI" : "CSS Mode"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyToClipboard}
                  disabled={!dataUri}
                  className={cn(
                    "rounded-xl font-bold px-4 hover:bg-primary/10 transition-all",
                    copied && "text-green-500 hover:text-green-500"
                  )}
                >
                  {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
              </div>
            </div>
            <CardContent className="p-0 flex-1">
              <Textarea
                readOnly
                value={cssMode ? getCssOutput() : dataUri}
                placeholder="Data URI will appear here after uploading a file..."
                className="w-full h-full min-h-[400px] p-8 bg-transparent border-none resize-none font-mono text-xs leading-relaxed text-foreground/70"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
