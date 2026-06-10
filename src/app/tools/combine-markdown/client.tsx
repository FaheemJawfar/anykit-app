"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { FilePlus, Copy, CheckCircle2, Download, Trash2, ArrowUp, ArrowDown, FileText, Zap, Settings2 } from "lucide-react";

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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center gap-3"><FileText className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Upload Markdown Files</span></div>
            <CardContent className="p-8">
              <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-border rounded-2xl p-8 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all">
                <input type="file" accept=".md,.markdown,.txt" multiple ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
                <p className="text-muted-foreground font-medium">Click or drag Markdown files here</p>
              </div>
              {files.length > 0 && (
                <div className="mt-6 space-y-2">
                  {files.map((file, i) => (
                    <div key={file.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-xl border border-border hover:border-primary/20 transition-all">
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
            </CardContent>
          </Card>
          {combined && (
            <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
              <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center gap-3"><FileText className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Combined Markdown</span></div>
              <CardContent className="p-8"><textarea value={combined} readOnly rows={12} className="w-full px-4 py-4 bg-muted/30 border-transparent rounded-2xl text-sm font-mono text-foreground leading-relaxed resize-none" /></CardContent>
            </Card>
          )}
        </div>

        <div className="lg:col-span-4 space-y-6 sticky top-24">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center gap-2"><Zap className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Actions</span></div>
            <CardContent className="p-8 space-y-3">
              <Button onClick={combine} disabled={files.length === 0} className="w-full h-14 rounded-2xl text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"><FilePlus className="w-5 h-5 mr-2" /> Combine Files</Button>
              <Button onClick={copyToClipboard} disabled={!combined} variant="outline" className="w-full h-12 rounded-xl border-border/50 font-bold text-muted-foreground">{copied ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}{copied ? "Copied!" : "Copy Result"}</Button>
              <Button onClick={downloadCombined} disabled={!combined} variant="outline" className="w-full h-12 rounded-xl border-border/50 font-bold text-muted-foreground"><Download className="w-4 h-4 mr-2" /> Download .md</Button>
            </CardContent>
          </Card>
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center gap-2"><Settings2 className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Options</span></div>
            <CardContent className="p-8 space-y-4">
              <div><Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Separator</Label><select value={separator} onChange={(e) => setSeparator(e.target.value)} className="w-full mt-1.5 px-4 py-2.5 bg-muted/30 border border-border rounded-xl focus:border-primary focus:outline-none text-sm font-bold text-foreground"><option value="\n\n---\n\n">Horizontal Rule (---)</option><option value="\n\n***\n\n">Horizontal Rule (***)</option><option value="\n\n">Double Line Break</option><option value="\n">Single Line Break</option><option value="">No Separator</option></select></div>
              <label className="flex items-center cursor-pointer gap-3"><input type="checkbox" checked={includeFilenames} onChange={(e) => setIncludeFilenames(e.target.checked)} className="w-5 h-5 text-primary border-border rounded focus:ring-primary" /><span className="text-sm text-muted-foreground font-medium">Include filenames as headers</span></label>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
