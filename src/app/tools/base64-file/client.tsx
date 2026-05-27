"use client";

import { ToolLayout } from "@/components/tool-layout";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { 
  FileUp, 
  Copy, 
  Check, 
  Trash2,
  Image as ImageIcon,
  FileText,
  Zap,
  Download,
  Link,
  Info,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Base64FileConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [base64, setBase64] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  const processFile = (file: File) => {
    setFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const copy = (val: string, id: string) => {
    navigator.clipboard.writeText(val);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const clear = () => {
    setFile(null);
    setBase64("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <ToolLayout toolId="base64-file">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Upload Section */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 space-y-8">
              <div 
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const droppedFile = e.dataTransfer.files[0];
                  if (droppedFile) processFile(droppedFile);
                }}
                className={cn(
                  "relative group h-64 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center transition-all cursor-pointer",
                  file ? "border-primary bg-primary/5 shadow-inner" : "border-border/60 hover:border-primary/40 hover:bg-primary/5"
                )}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                />
                
                <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                  <FileUp className="w-10 h-10" />
                </div>
                
                <div className="text-center space-y-1">
                  <h3 className="font-bold text-lg">
                    {file ? file.name : "Select or Drop File"}
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-[200px] mx-auto">
                    {file ? formatSize(file.size) : "Images, documents, or any other file type."}
                  </p>
                </div>
              </div>

              {file && (
                <div className="flex gap-4 animate-in fade-in slide-in-from-bottom-4">
                  <Button 
                    variant="outline" 
                    onClick={clear}
                    className="flex-1 h-14 rounded-2xl border-border/40 text-destructive hover:bg-destructive/5 hover:text-destructive hover:border-destructive/20 font-bold"
                  >
                    <Trash2 className="w-5 h-5 mr-2" />
                    Remove File
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-primary">Web Developer Tip</h3>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Base64 Data URIs are perfect for embedding small images directly into CSS or HTML to reduce HTTP requests.
            </p>
          </div>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-7 space-y-6">
          {base64 ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 h-full">
              {file?.type.startsWith('image/') && (
                <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
                  <div className="px-8 py-4 border-b border-border/40 bg-primary/5 flex items-center gap-3">
                    <ImageIcon className="w-4 h-4 text-primary" />
                    <span className="text-xs font-bold uppercase tracking-widest text-primary">Image Preview</span>
                  </div>
                  <CardContent className="p-8 flex items-center justify-center bg-muted/20">
                    <div className="relative group max-h-[300px] overflow-hidden rounded-2xl shadow-lg">
                      <img src={base64} alt="Preview" className="max-w-full h-auto object-contain" />
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col flex-1 min-h-[400px]">
                <div className="px-8 py-6 border-b border-border/40 bg-primary/5 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-3">
                    <Link className="w-4 h-4 text-primary" />
                    <span className="text-xs font-bold uppercase tracking-widest text-primary">Data URI String</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copy(base64, 'full')}
                    className={cn(
                      "rounded-xl font-bold px-4 hover:bg-primary/10 transition-all",
                      copied === 'full' && "text-green-500 hover:text-green-500"
                    )}
                  >
                    {copied === 'full' ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                    {copied === 'full' ? "Copied" : "Copy Full String"}
                  </Button>
                </div>
                <CardContent className="p-0 flex-1 relative bg-primary/[0.01]">
                  <div className="p-8 font-mono text-xs leading-relaxed break-all whitespace-pre-wrap max-h-[400px] overflow-auto">
                    {base64}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-3xl bg-card border border-border/40 shadow-sm flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase text-muted-foreground">Clean Base64</p>
                      <p className="text-xs font-mono font-bold">Content only</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => copy(base64.split(',')[1], 'clean')}
                    className="h-10 w-10 rounded-xl"
                  >
                    {copied === 'clean' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
                
                <div className="p-4 rounded-3xl bg-card border border-border/40 shadow-sm flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                      <ExternalLink className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase text-muted-foreground">CSS Usage</p>
                      <p className="text-xs font-mono font-bold">url(...)</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => copy(`url("${base64}")`, 'css')}
                    className="h-10 w-10 rounded-xl"
                  >
                    {copied === 'css' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-6 bg-muted/20 rounded-[2.5rem] border border-dashed border-border/40 min-h-[500px]">
              <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center">
                <FileUp className="w-10 h-10 text-muted-foreground/30" />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-lg">No File Selected</h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                  Upload a file on the left to see its Base64 encoding and preview.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
