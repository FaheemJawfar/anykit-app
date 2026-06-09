"use client";

import React, { useState, useEffect, useRef } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { FileEdit, Download, Trash2, AlertTriangle, File } from "lucide-react";

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

  return (
    <ToolLayout toolId="renamer">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 lg:order-last space-y-6">
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <Button onClick={downloadRenamed} disabled={files.length === 0} className="w-full h-12 shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest text-xs rounded-xl"><Download className="w-5 h-5 mr-2" /> Download Renamed</Button>
            <Button onClick={clearAll} variant="outline" className="w-full h-12 border-border hover:bg-accent text-muted-foreground hover:text-foreground font-bold uppercase tracking-widest text-xs"><Trash2 className="w-4 h-4 mr-2" /> Clear All</Button>
          </div>
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">Options</h3>
            <div><label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block">Find</label><input type="text" value={renameOptions.find} onChange={(e) => setRenameOptions({ ...renameOptions, find: e.target.value })} className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl focus:border-primary focus:outline-none text-sm font-bold text-foreground placeholder:font-normal" /></div>
            <div><label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block">Replace</label><input type="text" value={renameOptions.replace} onChange={(e) => setRenameOptions({ ...renameOptions, replace: e.target.value })} className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl focus:border-primary focus:outline-none text-sm font-bold text-foreground placeholder:font-normal" /></div>
            <div><label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block">Case</label><select value={renameOptions.case} onChange={(e) => setRenameOptions({ ...renameOptions, case: e.target.value })} className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl focus:border-primary focus:outline-none text-sm font-bold text-foreground"><option value="same">Same</option><option value="lower">Lowercase</option><option value="upper">Uppercase</option><option value="title">Title Case</option></select></div>
            <div><label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block">Numbering</label><select value={renameOptions.numbering} onChange={(e) => setRenameOptions({ ...renameOptions, numbering: e.target.value })} className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl focus:border-primary focus:outline-none text-sm font-bold text-foreground"><option value="none">None</option><option value="padded">Padded</option><option value="plain">Plain</option></select></div>
          </div>
          {error && <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-4 text-sm font-bold flex items-center gap-2"><AlertTriangle className="w-5 h-5" />{error}</div>}
        </div>
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-card rounded-[2rem] shadow-sm border border-border p-8">
            <h3 className="text-lg font-black text-foreground mb-6 flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center"><FileEdit className="w-5 h-5 text-primary" /></div>Files</h3>
            <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-border rounded-2xl p-8 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all">
              <input type="file" multiple ref={fileInputRef} onChange={(e) => { if (e.target.files) handleFilesSelected(Array.from(e.target.files)); }} className="hidden" />
              <p className="text-muted-foreground font-medium">Click or drag files here to upload</p>
            </div>
            {files.length > 0 && (
              <div className="mt-6 space-y-2">
                {files.map((file, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-muted rounded-xl border border-border">
                    <div className="flex items-center gap-3 min-w-0"><File className="w-4 h-4 text-primary flex-shrink-0" /><span className="text-sm font-bold text-muted-foreground truncate">{file.name}</span></div>
                    <span className="text-sm font-bold text-foreground truncate max-w-[40%]">{file.newName}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
