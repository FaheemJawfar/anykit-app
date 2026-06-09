"use client";

import React, { useState, useRef } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Fingerprint, FileText, Copy, Trash2, Upload, Shield, Calculator, Check, AlertTriangle, Info } from "lucide-react";

interface HashResult { algorithm: string; hash: string; inputLength: number; timestamp: string; }

export default function HashGenerator() {
  const [input, setInput] = useState("");
  const [algorithm, setAlgorithm] = useState("SHA-256");
  const [hash, setHash] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{ open: boolean; message: string; severity: 'error' | 'success' | 'info' }>({ open: false, message: '', severity: 'info' });
  const [hashHistory, setHashHistory] = useState<HashResult[]>([]);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const algorithms = [
    { value: "SHA-1", label: "SHA-1", description: "160-bit hash (legacy)" },
    { value: "SHA-256", label: "SHA-256", description: "256-bit hash (recommended)" },
    { value: "SHA-384", label: "SHA-384", description: "384-bit hash" },
    { value: "SHA-512", label: "SHA-512", description: "512-bit hash (most secure)" }
  ];

  const showNotification = (severity: 'success' | 'error' | 'info', message: string) => { setNotification({ open: true, message, severity }); setTimeout(() => setNotification(prev => ({ ...prev, open: false })), 3000); };

  const generateHash = async () => {
    if (!input.trim()) { showNotification('error', 'Please enter some text to hash'); return; }
    setLoading(true);
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(input);
      const hashBuffer = await crypto.subtle.digest(algorithm, data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
      setHash(hashHex);
      const result: HashResult = { algorithm, hash: hashHex, inputLength: input.length, timestamp: new Date().toISOString() };
      setHashHistory(prev => [result, ...prev.slice(0, 9)]);
      showNotification('success', `${algorithm} hash generated successfully`);
    } catch (error) { showNotification('error', 'Failed to generate hash. Please try again.'); }
    finally { setLoading(false); }
  };

  const copyToClipboard = async (content: string, type: string = 'hash') => { try { await navigator.clipboard.writeText(content); showNotification('info', `${type} copied to clipboard`); } catch (err) { showNotification('error', 'Failed to copy to clipboard'); } };
  const clearAll = () => { setInput(""); setHash(""); setFileName(""); showNotification('info', 'All fields cleared'); };
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { showNotification('error', 'File size must be less than 10MB'); return; }
      const reader = new FileReader();
      reader.onload = (e) => { const content = e.target?.result as string; setInput(content); setFileName(file.name); showNotification('info', 'File uploaded successfully'); };
      reader.readAsText(file);
    }
  };
  const downloadResult = () => {
    if (!hash) { showNotification('error', 'No hash to download'); return; }
    const data = { input: input.substring(0, 100) + (input.length > 100 ? '...' : ''), algorithm, hash, inputLength: input.length, timestamp: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `hash-${algorithm.toLowerCase()}-result.json`; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 100); showNotification('info', 'Hash result downloaded successfully');
  };
  const useExample = (example: string) => { setInput(example); showNotification('info', 'Example text loaded'); };
  const exampleTexts = ["Hello, World!", "The quick brown fox jumps over the lazy dog", "Lorem ipsum dolor sit amet, consectetur adipiscing elit", "password123"];

  return (
    <ToolLayout toolId="hash-generator">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 lg:order-last space-y-6">
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">Algorithm</h3>
            <div className="space-y-2">
              {algorithms.map((algo) => (
                <button key={algo.value} onClick={() => setAlgorithm(algo.value)} className={`w-full px-3 py-3 rounded-xl border transition-all text-left flex flex-col justify-center min-h-[56px] ${algorithm === algo.value ? 'bg-primary/5 border-primary shadow-sm' : 'bg-card border-border hover:border-primary/30 hover:bg-muted'}`}>
                  <div className="flex justify-between items-center"><span className={`text-xs font-black tracking-tight ${algorithm === algo.value ? 'text-primary' : 'text-muted-foreground'}`}>{algo.label}</span>{algorithm === algo.value && <div className="w-1.5 h-1.5 bg-primary rounded-full" />}</div>
                  <div className={`text-xs font-bold mt-1 tracking-tight ${algorithm === algo.value ? 'text-primary/40' : 'text-muted-foreground'}`}>{algo.description}</div>
                </button>
              ))}
            </div>
          </div>
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <Button onClick={generateHash} disabled={!input.trim() || loading} className="w-full h-12 shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest text-xs rounded-xl">
              <Calculator className="w-4 h-4 mr-2" /> Generate Hash
            </Button>
            <Button onClick={downloadResult} disabled={!hash} variant="outline" className="w-full h-12 border-border hover:bg-accent text-muted-foreground hover:text-foreground font-bold uppercase tracking-widest text-xs">
              <Upload className="w-4 h-4 mr-2" /> Save Result
            </Button>
            <Button onClick={clearAll} variant="outline" className="w-full h-12 border-border hover:bg-red-50 hover:text-red-500 hover:border-red-200 font-bold uppercase tracking-widest text-xs">
              <Trash2 className="w-4 h-4 mr-2" /> Clear All
            </Button>
          </div>
          {hashHistory.length > 0 && (
            <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">Recent Hashes</h3>
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1 -mr-1">
                {hashHistory.map((result, index) => (
                  <div key={index} className="p-4 bg-muted border border-border rounded-xl group hover:bg-card hover:border-primary/30 transition-all">
                    <div className="flex justify-between items-start mb-2"><span className="text-xs font-black text-primary tracking-tight">{result.algorithm}</span><button onClick={() => copyToClipboard(result.hash, 'Hash')} className="text-muted-foreground hover:text-primary transition-colors"><Copy className="w-3 h-3" /></button></div>
                    <div className="font-mono text-xs text-foreground break-all leading-relaxed">{result.hash.slice(0, 32)}...</div>
                    <div className="mt-2 text-xs font-bold text-muted-foreground tracking-tight">{new Date(result.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-8 space-y-6">
          {notification.open && (
            <div className={`p-4 rounded-2xl border text-sm font-bold ${notification.severity === 'error' ? 'bg-red-50 border-red-200 text-red-600' : notification.severity === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-blue-50 border-blue-200 text-blue-600'}`}>
              {notification.message}
            </div>
          )}
          <div className="bg-card rounded-[2.5rem] border border-border shadow-sm overflow-hidden group">
            <div className="flex justify-between items-center p-6 border-b border-border bg-muted/60">
              <h2 className="text-sm font-black text-foreground flex items-center gap-2 tracking-tight"><FileText className="w-4 h-4 text-primary" /> Source Material</h2>
              <div className="flex items-center gap-2">
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".txt,.json,.csv,.log" className="hidden" />
                <Button onClick={() => fileInputRef.current?.click()} variant="outline" size="sm" className="h-9 px-4 text-xs font-black tracking-tight"><Upload className="w-3.5 h-3.5 mr-2" /> Import File</Button>
              </div>
            </div>
            <div className="p-4 bg-card">
              <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Paste the text content you wish to digest..." className="w-full h-48 p-6 bg-transparent border-none rounded-xl font-mono text-sm resize-none outline-none transition-all placeholder:text-muted-foreground/50 text-foreground" />
              <div className="flex items-center justify-between mt-3 px-1">
                <div className="flex gap-1.5">{exampleTexts.slice(0, 3).map((example, index) => (<button key={index} onClick={() => useExample(example)} className="px-3 py-1 bg-muted border border-border rounded-lg text-xs font-bold text-foreground tracking-tight hover:bg-muted hover:text-primary hover:border-border transition-all font-mono">Ex {index + 1}</button>))}</div>
                <div className="flex items-center gap-2 text-xs font-bold text-foreground tracking-tight">Entropy: <span className="text-primary font-mono tracking-normal">{new TextEncoder().encode(input).length}B</span></div>
              </div>
            </div>
          </div>

          {hash ? (
            <div className="bg-primary rounded-[2.5rem] p-8 shadow-xl shadow-primary/20 text-primary-foreground relative overflow-hidden group border border-primary/20">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-foreground/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-primary-foreground/10 transition-colors duration-1000" />
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-foreground/10 rounded-2xl flex items-center justify-center border border-primary-foreground/20"><Shield className="w-6 h-6 text-primary-foreground" /></div>
                    <div><h2 className="text-lg font-black tracking-tight">Calculated Digest</h2><p className="text-primary-foreground/60 text-[10px] font-black uppercase tracking-widest">{algorithm} &bull; Deterministic Output</p></div>
                  </div>
                  <button onClick={() => copyToClipboard(hash, 'Hash')} className="p-3 bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground rounded-xl transition-all border border-primary-foreground/10 shadow-sm" title="Copy to clipboard"><Copy className="w-4 h-4" /></button>
                </div>
                <div className="space-y-4">
                  <div className="p-6 bg-primary-foreground/5 rounded-2xl border border-primary-foreground/10 font-mono text-xl md:text-2xl font-black break-all leading-relaxed shadow-inner">{hash}</div>
                  <div className="flex items-center gap-2"><span className="px-3 py-1 bg-primary-foreground/10 rounded-full text-[10px] font-black uppercase tracking-widest border border-primary-foreground/10">{hash.length * 4} bits entropy</span></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-card rounded-[2.5rem] border border-border p-12 shadow-sm text-center flex flex-col items-center justify-center gap-4 py-20 group">
              <div className="w-16 h-16 bg-muted rounded-3xl flex items-center justify-center border border-border group-hover:scale-110 transition-transform duration-500"><Calculator className="w-8 h-8 text-muted-foreground" /></div>
              <div><h3 className="text-lg font-black text-foreground tracking-tight">Ready to generate hash</h3><p className="text-sm font-bold text-muted-foreground mt-1 uppercase tracking-widest">Select an algorithm and provide source material</p></div>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
