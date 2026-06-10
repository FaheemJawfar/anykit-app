"use client";

import React, { useState, useRef } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Minimize2, Download, Trash2, File, AlertCircle, FolderArchive, Upload, Zap, Layers } from "lucide-react";

const formatFileSize = (bytes: number): string => { if (bytes < 1024) return `${bytes} B`; if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`; if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`; return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`; };

export default function FileCompressor() {
  const [files, setFiles] = useState<File[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [zipSize, setZipSize] = useState<number>(0);
  const [zipBlob, setZipBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFilesSelected = (newFiles: File[]) => { setFiles(prev => [...prev, ...newFiles]); setError(null); };
  const handleClearFiles = () => { setFiles([]); setZipBlob(null); setZipSize(0); setError(null); };

  const handleCompress = async () => {
    if (files.length === 0) return;
    setIsCompressing(true); setError(null);
    try {
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();
      for (const file of files) { const content = await file.arrayBuffer(); zip.file(file.name, content, { compression: 'DEFLATE', compressionOptions: { level: 6 } }); }
      const zipContent = await zip.generateAsync({ type: 'blob' });
      setZipSize(zipContent.size); setZipBlob(zipContent);
    } catch (err) { setError((err as Error)?.message || 'Compression failed'); }
    finally { setIsCompressing(false); }
  };

  const handleDownload = () => { if (!zipBlob) return; const blobUrl = URL.createObjectURL(zipBlob); const a = document.createElement('a'); a.href = blobUrl; a.download = 'compressed_files.zip'; a.click(); setTimeout(() => URL.revokeObjectURL(blobUrl), 100); };

  const totalOriginalSize = files.reduce((sum, f) => sum + f.size, 0);
  const efficiency = totalOriginalSize > 0 ? Math.max(0, Math.round(((totalOriginalSize - zipSize) / totalOriginalSize) * 100)) : 0;

  return (
    <ToolLayout toolId="compressor">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8">
          {files.length === 0 ? (
            <Card className="border-2 border-dashed border-border/60 bg-card/30 backdrop-blur-sm rounded-[2.5rem] h-[500px] flex flex-col items-center justify-center space-y-6 transition-all hover:border-primary/20 hover:bg-primary/[0.02] cursor-pointer group" onClick={() => fileInputRef.current?.click()}>
              <div className="w-20 h-20 rounded-3xl bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform"><Upload className="w-10 h-10" /></div>
              <div className="text-center space-y-2"><p className="text-xl font-bold">Upload files</p><p className="text-sm text-muted-foreground">Click or drag and drop to compress into ZIP</p></div>
              <Button className="rounded-2xl px-8 h-12 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">Browse Files</Button>
              <input type="file" multiple ref={fileInputRef} onChange={(e) => { if (e.target.files) handleFilesSelected(Array.from(e.target.files)); }} className="hidden" />
            </Card>
          ) : (
            <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
              <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center justify-between">
                <div className="flex items-center gap-3"><FolderArchive className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Files ({files.length})</span></div>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:text-red-500" onClick={handleClearFiles}><Trash2 className="w-4 h-4" /></Button>
              </div>
              <CardContent className="p-8 space-y-3">
                {files.map((file, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border hover:border-primary/20 transition-all">
                    <div className="flex items-center gap-3"><File className="w-5 h-5 text-primary" /><span className="text-sm font-bold text-foreground">{file.name}</span></div>
                    <span className="text-xs font-mono font-bold text-muted-foreground">{formatFileSize(file.size)}</span>
                  </div>
                ))}
                <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-border/40 rounded-2xl p-6 text-center cursor-pointer hover:border-primary/30 hover:bg-primary/[0.02] transition-all mt-4">
                  <input type="file" multiple ref={fileInputRef} onChange={(e) => { if (e.target.files) handleFilesSelected(Array.from(e.target.files)); }} className="hidden" />
                  <p className="text-sm text-muted-foreground font-medium">+ Add more files</p>
                </div>
              </CardContent>
            </Card>
          )}
          {error && (<div className="mt-6 flex items-center gap-3 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-sm font-bold"><AlertCircle className="w-5 h-5 flex-shrink-0" />{error}</div>)}
        </div>

        <div className="lg:col-span-4 space-y-6 sticky top-24">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center gap-2"><Zap className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Actions</span></div>
            <CardContent className="p-8 space-y-4">
              <Button onClick={handleCompress} disabled={files.length === 0 || isCompressing} className="w-full h-14 rounded-2xl text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]">
                {isCompressing ? <Minimize2 className="w-5 h-5 animate-spin" /> : <Minimize2 className="w-5 h-5 mr-2" />}
                {isCompressing ? 'Compressing...' : 'Compress to ZIP'}
              </Button>
              {zipBlob && (
                <Button onClick={handleDownload} variant="outline" className="w-full h-12 rounded-xl border-border/50 font-bold"><Download className="w-4 h-4 mr-2" /> Download ZIP</Button>
              )}
              <Button onClick={handleClearFiles} variant="outline" className="w-full h-12 rounded-xl border-border/50 font-bold text-muted-foreground"><Trash2 className="w-4 h-4 mr-2" /> Clear All</Button>
            </CardContent>
          </Card>

          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center gap-2"><Layers className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Compression Stats</span></div>
            <CardContent className="p-6 space-y-3">
              {totalOriginalSize > 0 ? (
                <div className="space-y-2">
                  <div className="flex justify-between p-3 rounded-xl bg-muted/30"><span className="text-[10px] font-bold uppercase text-muted-foreground">Original</span><span className="text-xs font-mono font-bold">{formatFileSize(totalOriginalSize)}</span></div>
                  <div className="flex justify-between p-3 rounded-xl bg-muted/30"><span className="text-[10px] font-bold uppercase text-muted-foreground">Compressed</span><span className="text-xs font-mono font-bold">{zipSize > 0 ? formatFileSize(zipSize) : '—'}</span></div>
                  <div className="flex justify-between p-3 rounded-xl bg-primary/5 border border-primary/10"><span className="text-[10px] font-bold uppercase text-primary/70">Space Saved</span><span className="text-xs font-mono font-bold text-primary">{efficiency > 0 ? `${efficiency}%` : '—'}</span></div>
                </div>
              ) : (
                <div className="py-8 flex flex-col items-center justify-center text-center space-y-3 opacity-20"><FolderArchive className="w-10 h-10" /><p className="text-xs font-medium">No files uploaded</p></div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
