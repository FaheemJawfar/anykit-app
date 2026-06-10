"use client";

import React, { useState, useEffect, useRef } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileEdit, Download, Trash2, AlertCircle, File, Upload, Zap, Settings2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BatchRenamer() {
  const [files, setFiles] = useState<Array<{ name: string; newName: string; fileObj?: File }>>([]);
  const [renameOptions, setRenameOptions] = useState({ find: '', replace: '', case: 'same', numbering: 'none', startNumber: 1, digits: 2, position: 'prefix' });
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileExtension = (filename: string): string => { const lastDot = filename.lastIndexOf('.'); return lastDot > 0 ? filename.substring(lastDot + 1) : ''; };
  const getFileNameWithoutExtension = (filename: string): string => { const lastDot = filename.lastIndexOf('.'); return lastDot > 0 ? filename.substring(0, lastDot) : filename; };

  const handleFilesSelected = (newFiles: File[]) => {
    setError(null);
    const mappedFiles = newFiles.map(file => ({ name: file.name, newName: file.name, fileObj: file }));
    setFiles(prev => [...prev, ...mappedFiles]);
  };

  useEffect(() => {
    if (files.length === 0) return;
    const updatedFiles = files.map((file, index) => {
      const ext = getFileExtension(file.name); const nameWithoutExt = getFileNameWithoutExtension(file.name); let newName = nameWithoutExt;
      if (renameOptions.find) { try { newName = newName.replace(new RegExp(renameOptions.find, 'g'), renameOptions.replace); } catch (e) { } }
      switch (renameOptions.case) { case 'upper': newName = newName.toUpperCase(); break; case 'lower': newName = newName.toLowerCase(); break; case 'title': newName = newName.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()); break; }
      if (renameOptions.numbering !== 'none') { const num = index + renameOptions.startNumber; const paddedNum = num.toString().padStart(renameOptions.digits, '0'); const numberStr = renameOptions.numbering === 'padded' ? paddedNum : num.toString(); newName = renameOptions.position === 'prefix' ? `${numberStr}_${newName}` : `${newName}_${numberStr}`; }
      return { ...file, newName: ext ? `${newName}.${ext}` : newName };
    });
    setFiles(updatedFiles);
  }, [renameOptions]);

  const downloadRenamed = async () => {
    if (files.length === 0) return;
    try {
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();
      for (const file of files) { if (file.fileObj) zip.file(file.newName, await file.fileObj.arrayBuffer()); }
      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content); const a = document.createElement('a'); a.href = url; a.download = 'renamed_files.zip'; a.click(); URL.revokeObjectURL(url);
    } catch (err) { setError('Failed to create ZIP'); }
  };

  const clearAll = () => { setFiles([]); setError(null); };

  const caseOptions = [
    { value: 'same', label: 'Same' }, { value: 'lower', label: 'Lower' },
    { value: 'upper', label: 'Upper' }, { value: 'title', label: 'Title' },
  ];
  const numberingOptions = [
    { value: 'none', label: 'None' }, { value: 'padded', label: 'Padded' }, { value: 'plain', label: 'Plain' },
  ];

  return (
    <ToolLayout toolId="renamer">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          {files.length === 0 ? (
            <Card className="border-2 border-dashed border-border/60 bg-card/30 backdrop-blur-sm rounded-[2.5rem] h-[500px] flex flex-col items-center justify-center space-y-6 transition-all hover:border-primary/20 hover:bg-primary/[0.02] cursor-pointer group" onClick={() => fileInputRef.current?.click()}>
              <div className="w-20 h-20 rounded-3xl bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform"><Upload className="w-10 h-10" /></div>
              <div className="text-center space-y-2"><p className="text-xl font-bold">Upload files</p><p className="text-sm text-muted-foreground">Click or drag and drop to batch rename</p></div>
              <Button className="rounded-2xl px-8 h-12 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">Browse Files</Button>
              <input type="file" multiple ref={fileInputRef} onChange={(e) => { if (e.target.files) handleFilesSelected(Array.from(e.target.files)); }} className="hidden" />
            </Card>
          ) : (
            <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
              <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center justify-between">
                <div className="flex items-center gap-3"><FileEdit className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Files ({files.length})</span></div>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:text-red-500" onClick={clearAll}><Trash2 className="w-4 h-4" /></Button>
              </div>
              <CardContent className="p-8 space-y-3">
                {files.map((file, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl border border-border hover:border-primary/20 transition-all">
                    <File className="w-5 h-5 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0"><p className="text-xs text-muted-foreground font-medium truncate">{file.name}</p></div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0"><p className="text-sm font-bold text-foreground truncate">{file.newName}</p></div>
                  </div>
                ))}
                <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-border/40 rounded-2xl p-6 text-center cursor-pointer hover:border-primary/30 hover:bg-primary/[0.02] transition-all mt-4">
                  <input type="file" multiple ref={fileInputRef} onChange={(e) => { if (e.target.files) handleFilesSelected(Array.from(e.target.files)); }} className="hidden" />
                  <p className="text-sm text-muted-foreground font-medium">+ Add more files</p>
                </div>
              </CardContent>
            </Card>
          )}
          {error && (<div className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-sm font-bold"><AlertCircle className="w-5 h-5 flex-shrink-0" />{error}</div>)}
        </div>

        <div className="lg:col-span-4 space-y-6 sticky top-24">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center gap-2"><Settings2 className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Rename Options</span></div>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Find</Label>
                <Input type="text" value={renameOptions.find} onChange={(e) => setRenameOptions({ ...renameOptions, find: e.target.value })} className="h-12 px-4 rounded-xl bg-muted/30 border-transparent focus:border-primary/20 text-sm font-bold" placeholder="Text to find" />
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Replace</Label>
                <Input type="text" value={renameOptions.replace} onChange={(e) => setRenameOptions({ ...renameOptions, replace: e.target.value })} className="h-12 px-4 rounded-xl bg-muted/30 border-transparent focus:border-primary/20 text-sm font-bold" placeholder="Replacement text" />
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Case</Label>
                <div className="grid grid-cols-2 gap-2">
                  {caseOptions.map((opt) => (<button key={opt.value} onClick={() => setRenameOptions({ ...renameOptions, case: opt.value })} className={cn("px-3 py-2 rounded-xl text-xs font-bold border transition-all", renameOptions.case === opt.value ? "bg-primary text-primary-foreground border-primary shadow-md" : "bg-muted/30 text-muted-foreground border-border hover:bg-muted/50")}>{opt.label}</button>))}
                </div>
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Numbering</Label>
                <div className="grid grid-cols-3 gap-2">
                  {numberingOptions.map((opt) => (<button key={opt.value} onClick={() => setRenameOptions({ ...renameOptions, numbering: opt.value })} className={cn("px-3 py-2 rounded-xl text-xs font-bold border transition-all", renameOptions.numbering === opt.value ? "bg-primary text-primary-foreground border-primary shadow-md" : "bg-muted/30 text-muted-foreground border-border hover:bg-muted/50")}>{opt.label}</button>))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center gap-2"><Zap className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Actions</span></div>
            <CardContent className="p-8 space-y-4">
              <Button onClick={downloadRenamed} disabled={files.length === 0} className="w-full h-14 rounded-2xl text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"><Download className="w-5 h-5 mr-2" /> Download Renamed</Button>
              <Button onClick={clearAll} variant="outline" className="w-full h-12 rounded-xl border-border/50 font-bold text-muted-foreground"><Trash2 className="w-4 h-4 mr-2" /> Clear All</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
