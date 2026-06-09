"use client";

import React, { useState, useEffect } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { ArrowLeftRight, Copy, CheckCircle2, Trash2, Upload, Download } from "lucide-react";

export default function Base64Converter() {
  const [activeTab, setActiveTab] = useState<'encode' | 'decode'>('encode');
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [copied, setCopied] = useState(false);

  const calculateOutput = (input: string, mode: 'encode' | 'decode') => {
    if (!input) { setOutputText(""); return; }
    try {
      if (mode === 'encode') { setOutputText(btoa(unescape(encodeURIComponent(input)))); }
      else { setOutputText(decodeURIComponent(escape(atob(input)))); }
    } catch (err) { setOutputText(mode === 'decode' ? "Invalid Base64 input" : "Error encoding input"); }
  };

  const handleTabChange = (tab: 'encode' | 'decode') => { setActiveTab(tab); setInputText(""); setOutputText(""); };
  const handleTextChange = (value: string) => { setInputText(value); calculateOutput(value, activeTab); };
  const copyToClipboard = async () => { if (!outputText) return; try { await navigator.clipboard.writeText(outputText); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch (err) { console.error(err); } };
  const clearAll = () => { setInputText(""); setOutputText(""); };

  return (
    <ToolLayout toolId="base64">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 lg:order-last space-y-6">
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <div className="bg-muted p-1.5 rounded-xl flex items-center gap-1.5 border border-border/50">
              <button onClick={() => handleTabChange('encode')} className={`flex-1 py-2 px-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${activeTab === 'encode' ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}>Encode</button>
              <button onClick={() => handleTabChange('decode')} className={`flex-1 py-2 px-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${activeTab === 'decode' ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}>Decode</button>
            </div>
            <Button onClick={copyToClipboard} disabled={!outputText} className="w-full h-12 shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest text-xs rounded-xl">{copied ? <CheckCircle2 className="w-5 h-5 mr-2" /> : <Copy className="w-5 h-5 mr-2" />}{copied ? "Copied!" : "Copy Result"}</Button>
            <Button onClick={clearAll} variant="outline" className="w-full h-12 border-border hover:bg-accent text-muted-foreground hover:text-foreground font-bold uppercase tracking-widest text-xs"><Trash2 className="w-4 h-4 mr-2" /> Clear All</Button>
          </div>
        </div>
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card rounded-[2rem] shadow-sm border border-border p-6">
              <h3 className="text-sm font-black text-foreground mb-4 flex items-center gap-2"><ArrowLeftRight className="w-4 h-4 text-primary" /> Input</h3>
              <textarea value={inputText} onChange={(e) => handleTextChange(e.target.value)} placeholder={activeTab === 'encode' ? "Enter text to encode..." : "Enter Base64 to decode..."} rows={12} className="w-full px-4 py-4 bg-muted border border-border rounded-2xl focus:bg-card focus:border-primary focus:outline-none transition-all text-sm font-medium text-foreground resize-none placeholder:font-normal" />
            </div>
            <div className="bg-card rounded-[2rem] shadow-sm border border-border p-6">
              <h3 className="text-sm font-black text-foreground mb-4 flex items-center gap-2"><ArrowLeftRight className="w-4 h-4 text-primary" /> Result</h3>
              <textarea value={outputText} readOnly placeholder="Result will appear here..." rows={12} className="w-full px-4 py-4 bg-muted border border-border rounded-2xl focus:outline-none text-sm font-medium text-foreground resize-none placeholder:font-normal" />
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
