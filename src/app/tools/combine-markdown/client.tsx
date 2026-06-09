"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { FilePlus, Copy, CheckCircle2, Download, Trash2, ArrowUp, ArrowDown, FileText } from "lucide-react";

interface MarkdownFile { id: string; name: string; content: string; }

export default function CombineMarkdown() {
  const [files, setFiles] = useState<MarkdownFile[]>([]);
  const [separator, setSeparator] = useState("\n\n---\n\n");
  const [includeFilenames, setIncludeFilenames] = useState(false);
  const [combined, setCombined] = useState("");
  const [copied, setCopied] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files; if (!uploaded) return;
    Array.from(uploaded).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => { setFiles(prev => [...prev, { id: Math.random().toString(36).substr(2, 9), name: file.name, content: reader.result as string }]); };
      reader.readAsText(file);
    });
    e.target.value = '';
  };

  const removeFile = (id: string) => setFiles(prev => prev.filter(f => f.id !== id));
  const moveFile = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === files.length - 1)) return;
    const newFiles = [...files]; const newIndex = direction === 'up' ? index - 1 : index + 1; [newFiles[newIndex], newFiles[index]] = [newFiles[index], newFiles[newIndex]]; setFiles(newFiles);
  };

  const combine = () => {
    let result = "";
    files.forEach((file, i) => {
      if (includeFilenames) result += `## ${file.name}\n\n`;
      result += file.content;
      if (i < files.length - 1) result += separator;
    });
    setCombined(result);
  };

  const copyToClipboard = async () => { try { await navigator.clipboard.writeText(combined); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch (err) { console.error(err); } };
  const downloadCombined = () => { const blob = new Blob([combined], { type: 'text/markdown' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'combined.md'; a.click(); URL.revokeObjectURL(url); };

  return (
    <ToolLayout toolId="combine-markdown">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 lg:order-last space-y-6">
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <Button onClick={combine} disabled={files.length === 0} className="w-full h-12 shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest text-xs rounded-xl"><FilePlus className="w-5 h-5 mr-2" /> Combine Files</Button>
            <Button onClick={copyToClipboard} disabled={!combined} variant="outline" className="w-full h-12 border-border hover:bg-accent text-muted-foreground hover:text-foreground font-bold uppercase tracking-widest text-xs">{copied ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}{copied ? "Copied!" : "Copy Result"}</Button>
            <Button onClick={downloadCombined} disabled={!combined} variant="outline" className="w-full h-12 border-border hover:bg-accent text-muted-foreground hover:text-foreground font-bold uppercase tracking-widest text-xs"><Download className="w-4 h-4 mr-2" /> Download .md</Button>
          </div>
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">Options</h3>
            <div><label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block">Separator</label><select value={separator} onChange={(e) => setSeparator(e.target.value)} className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl focus:border-primary focus:outline-none text-sm font-bold text-foreground"><option value="\n\n---\n\n">Horizontal Rule (---)</option><option value="\n\n***\n\n">Horizontal Rule (***)</option><option value="\n\n">Double Line Break</option><option value="\n">Single Line Break</option><option value="">No Separator</option></select></div>
            <label className="flex items-center cursor-pointer gap-3"><input type="checkbox" checked={includeFilenames} onChange={(e) => setIncludeFilenames(e.target.checked)} className="w-5 h-5 text-primary border-border rounded focus:ring-primary" /><span className="text-sm text-muted-foreground font-medium">Include filenames as headers</span></label>
          </div>
        </div>
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-card rounded-[2rem] shadow-sm border border-border p-8">
            <h3 className="text-lg font-black text-foreground mb-6 flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center"><FileText className="w-5 h-5 text-primary" /></div>Upload Markdown Files</h3>
            <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-border rounded-2xl p-8 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all">
              <input type="file" accept=".md,.markdown,.txt" multiple ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
              <p className="text-muted-foreground font-medium">Click or drag Markdown files here</p>
            </div>
            {files.length > 0 && (
              <div className="mt-6 space-y-2">
                {files.map((file, i) => (
                  <div key={file.id} className="flex items-center justify-between p-3 bg-muted rounded-xl border border-border">
                    <span className="text-sm font-bold text-foreground">{file.name}</span>
                    <div className="flex items-center gap-2">
                      <button onClick={() => moveFile(i, 'up')} disabled={i === 0} className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"><ArrowUp className="w-4 h-4" /></button>
                      <button onClick={() => moveFile(i, 'down')} disabled={i === files.length - 1} className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"><ArrowDown className="w-4 h-4" /></button>
                      <button onClick={() => removeFile(file.id)} className="p-1 text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {combined && (
            <div className="bg-card rounded-[2rem] shadow-sm border border-border p-8">
              <h3 className="text-lg font-black text-foreground mb-4">Combined Markdown</h3>
              <textarea value={combined} readOnly rows={12} className="w-full px-4 py-4 bg-muted border border-border rounded-2xl focus:outline-none text-sm font-mono text-foreground leading-relaxed resize-none" />
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
