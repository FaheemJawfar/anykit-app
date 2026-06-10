"use client";

import React, { useState, useRef } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileArchive, Download, Trash2, AlertCircle, File, Upload, Zap, FolderOpen } from "lucide-react";

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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          {files.length === 0 ? (
            <Card className="border-2 border-dashed border-border/60 bg-card/30 backdrop-blur-sm rounded-[2.5rem] h-[500px] flex flex-col items-center justify-center space-y-6 transition-all hover:border-primary/20 hover:bg-primary/[0.02] cursor-pointer group" onClick={() => fileInputRef.current?.click()}>
              <div className="w-20 h-20 rounded-3xl bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform"><Upload className="w-10 h-10" /></div>
              <div className="text-center space-y-2"><p className="text-xl font-bold">Upload ZIP archives</p><p className="text-sm text-muted-foreground">Click or drag and drop to extract files</p></div>
              <Button className="rounded-2xl px-8 h-12 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">Browse Files</Button>
              <input type="file" accept=".zip" multiple ref={fileInputRef} onChange={(e) => { if (e.target.files) handleFilesSelected(Array.from(e.target.files)); }} className="hidden" />
            </Card>
          ) : (
            <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
              <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center justify-between">
                <div className="flex items-center gap-3"><FileArchive className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">ZIP Archives ({files.length})</span></div>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:text-red-500" onClick={handleClearAll}><Trash2 className="w-4 h-4" /></Button>
              </div>
              <CardContent className="p-8 space-y-3">
                {files.map((file, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border hover:border-primary/20 transition-all">
                    <div className="flex items-center gap-3"><File className="w-5 h-5 text-primary" /><span className="text-sm font-bold text-foreground">{file.name}</span></div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:text-red-500" onClick={() => handleRemoveFile(i)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                ))}
                <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-border/40 rounded-2xl p-6 text-center cursor-pointer hover:border-primary/30 hover:bg-primary/[0.02] transition-all mt-4">
                  <input type="file" accept=".zip" multiple ref={fileInputRef} onChange={(e) => { if (e.target.files) handleFilesSelected(Array.from(e.target.files)); }} className="hidden" />
                  <p className="text-sm text-muted-foreground font-medium">+ Add more ZIP files</p>
                </div>
              </CardContent>
            </Card>
          )}
          {extractedFiles.length > 0 && (
            <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
              <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center gap-3"><FolderOpen className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Extracted Files ({extractedFiles.length})</span></div>
              <CardContent className="p-8 space-y-3">
                {extractedFiles.map((file, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border hover:border-primary/20 transition-all">
                    <div className="flex items-center gap-3"><File className="w-5 h-5 text-primary" /><span className="text-sm font-bold text-foreground">{file.name}</span></div>
                    <Button onClick={() => downloadFile(file)} variant="outline" size="sm" className="rounded-xl font-bold"><Download className="w-4 h-4 mr-2" /> Download</Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
          {error && (<div className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-sm font-bold"><AlertCircle className="w-5 h-5 flex-shrink-0" />{error}</div>)}
        </div>

        <div className="lg:col-span-4 space-y-6 sticky top-24">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center gap-2"><Zap className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Actions</span></div>
            <CardContent className="p-8 space-y-4">
              <Button onClick={extractFiles} disabled={files.length === 0 || isExtracting} className="w-full h-14 rounded-2xl text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]">
                {isExtracting ? <FileArchive className="w-5 h-5 animate-spin" /> : <FileArchive className="w-5 h-5 mr-2" />}
                {isExtracting ? 'Extracting...' : 'Extract ZIP'}
              </Button>
              <Button onClick={handleClearAll} variant="outline" className="w-full h-12 rounded-xl border-border/50 font-bold text-muted-foreground"><Trash2 className="w-4 h-4 mr-2" /> Clear All</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
