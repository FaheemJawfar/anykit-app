"use client";

import React, { useState, useRef } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { FileArchive, Download, Trash2, AlertTriangle, File } from "lucide-react";

const formatFileSize = (bytes: number): string => { if (bytes < 1024) return `${bytes} B`; if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`; return `${(bytes / (1024 * 1024)).toFixed(1)} MB`; };

export default function ZipExtractor() {
  const [files, setFiles] = useState<File[]>([]);
  const [extractedFiles, setExtractedFiles] = useState<Array<{ name: string; content: Blob; archiveName: string }>>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFilesSelected = (newFiles: File[]) => {
    setError(null);
    const validFiles = newFiles.filter(f => f.name.toLowerCase().endsWith('.zip'));
    if (validFiles.length !== newFiles.length) setError("Only ZIP files are supported.");
    setFiles(prev => [...prev, ...validFiles]);
  };

  const handleRemoveFile = (index: number) => { setFiles(files.filter((_, i) => i !== index)); setExtractedFiles([]); setError(null); };
  const handleClearAll = () => { setFiles([]); setExtractedFiles([]); setError(null); };

  const extractFiles = async () => {
    if (!files.length) return;
    setIsExtracting(true); setExtractedFiles([]); setError(null);
    try {
      const JSZip = (await import("jszip")).default;
      const allExtracted: Array<{ name: string; content: Blob; archiveName: string }> = [];
      for (const file of files) {
        try {
          const zip = new JSZip();
          const content = await file.arrayBuffer();
          const loadedZip = await zip.loadAsync(content);
          const filePromises: Promise<{ name: string; content: Blob; archiveName: string }>[] = [];
          loadedZip.forEach((_, zipEntry) => { if (!zipEntry.dir) filePromises.push(zipEntry.async('blob').then(fileData => ({ name: zipEntry.name, content: fileData, archiveName: file.name }))); });
          const extracted = await Promise.all(filePromises);
          allExtracted.push(...extracted);
        } catch (fileError) { setError(`Failed to extract ${file.name}. Ensure it's a valid ZIP file.`); }
      }
      setExtractedFiles(allExtracted);
      if (allExtracted.length === 0 && !error) setError('No files were extracted.');
    } catch (err) { setError(`Extraction failed: ${(err as Error)?.message || 'Unknown error'}`); }
    finally { setIsExtracting(false); }
  };

  const downloadFile = (file: { name: string; content: Blob }) => { const url = URL.createObjectURL(file.content); const a = document.createElement('a'); a.href = url; a.download = file.name; a.click(); URL.revokeObjectURL(url); };

  return (
    <ToolLayout toolId="extractor">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 lg:order-last space-y-6">
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <Button onClick={extractFiles} disabled={files.length === 0 || isExtracting} className="w-full h-12 shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest text-xs rounded-xl"><FileArchive className="w-5 h-5 mr-2" />{isExtracting ? "Extracting..." : "Extract ZIP"}</Button>
            <Button onClick={handleClearAll} variant="outline" className="w-full h-12 border-border hover:bg-accent text-muted-foreground hover:text-foreground font-bold uppercase tracking-widest text-xs"><Trash2 className="w-4 h-4 mr-2" /> Clear All</Button>
          </div>
        </div>
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-card rounded-[2rem] shadow-sm border border-border p-8">
            <h3 className="text-lg font-black text-foreground mb-6 flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center"><FileArchive className="w-5 h-5 text-primary" /></div>ZIP Archives</h3>
            <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-border rounded-2xl p-8 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all">
              <input type="file" accept=".zip" multiple ref={fileInputRef} onChange={(e) => { if (e.target.files) handleFilesSelected(Array.from(e.target.files)); }} className="hidden" />
              <p className="text-muted-foreground font-medium">Click or drag ZIP files here to upload</p>
            </div>
            {files.length > 0 && (
              <div className="mt-6 space-y-2">
                {files.map((file, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-muted rounded-xl border border-border">
                    <div className="flex items-center gap-3"><File className="w-4 h-4 text-primary" /><span className="text-sm font-bold text-foreground">{file.name}</span></div>
                    <button onClick={() => handleRemoveFile(i)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            )}
            {error && <div className="mt-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl p-4 text-sm font-bold flex items-center gap-2"><AlertTriangle className="w-5 h-5" />{error}</div>}
          </div>
          {extractedFiles.length > 0 && (
            <div className="bg-card rounded-[2rem] shadow-sm border border-border p-8">
              <h3 className="text-lg font-black text-foreground mb-6">Extracted Files ({extractedFiles.length})</h3>
              <div className="space-y-2">{extractedFiles.map((file, i) => (<div key={i} className="flex items-center justify-between p-3 bg-muted rounded-xl border border-border"><span className="text-sm font-bold text-foreground">{file.name}</span><Button onClick={() => downloadFile(file)} variant="outline" size="sm"><Download className="w-3.5 h-3.5 mr-2" /> Download</Button></div>))}</div>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
