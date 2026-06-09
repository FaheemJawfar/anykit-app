"use client";

import React, { useState, useRef } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Minimize2, Download, Trash2, File, AlertTriangle, FolderArchive } from "lucide-react";

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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 lg:order-last space-y-6">
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <Button onClick={handleCompress} disabled={files.length === 0 || isCompressing} className="w-full h-12 shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest text-xs rounded-xl"><Minimize2 className="w-5 h-5 mr-2" />{isCompressing ? "Compressing..." : "Compress to ZIP"}</Button>
            {zipBlob && <Button onClick={handleDownload} variant="outline" className="w-full h-12 border-border hover:bg-accent text-muted-foreground hover:text-foreground font-bold uppercase tracking-widest text-xs"><Download className="w-4 h-4 mr-2" /> Download ZIP</Button>}
            <Button onClick={handleClearFiles} variant="outline" className="w-full h-12 border-border hover:bg-accent text-muted-foreground hover:text-foreground font-bold uppercase tracking-widest text-xs"><Trash2 className="w-4 h-4 mr-2" /> Clear All</Button>
          </div>
          {totalOriginalSize > 0 && (
            <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">Stats</h3>
              <div className="space-y-2 text-sm"><div className="flex justify-between"><span className="text-muted-foreground">Original</span><span className="font-bold">{formatFileSize(totalOriginalSize)}</span></div><div className="flex justify-between"><span className="text-muted-foreground">Compressed</span><span className="font-bold">{formatFileSize(zipSize)}</span></div><div className="flex justify-between"><span className="text-muted-foreground">Saved</span><span className="font-bold text-primary">{efficiency}%</span></div></div>
            </div>
          )}
        </div>
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-card rounded-[2rem] shadow-sm border border-border p-8">
            <h3 className="text-lg font-black text-foreground mb-6 flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center"><FolderArchive className="w-5 h-5 text-primary" /></div>Files</h3>
            <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-border rounded-2xl p-8 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all">
              <input type="file" multiple ref={fileInputRef} onChange={(e) => { if (e.target.files) handleFilesSelected(Array.from(e.target.files)); }} className="hidden" />
              <p className="text-muted-foreground font-medium">Click or drag files here to upload</p>
            </div>
            {files.length > 0 && (
              <div className="mt-6 space-y-2">
                {files.map((file, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-muted rounded-xl border border-border">
                    <div className="flex items-center gap-3"><File className="w-4 h-4 text-primary" /><span className="text-sm font-bold text-foreground">{file.name}</span></div>
                    <span className="text-xs text-muted-foreground font-medium">{formatFileSize(file.size)}</span>
                  </div>
                ))}
              </div>
            )}
            {error && <div className="mt-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl p-4 text-sm font-bold flex items-center gap-2"><AlertTriangle className="w-5 h-5" />{error}</div>}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
