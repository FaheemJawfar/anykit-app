"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeftRight, Copy, CheckCircle2, Trash2, Settings2, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
              <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center gap-2"><ArrowLeftRight className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Input</span></div>
              <CardContent className="p-6">
                <Textarea value={inputText} onChange={(e) => handleTextChange(e.target.value)} placeholder={activeTab === 'encode' ? "Enter text to encode..." : "Enter Base64 to decode..."} rows={14} className="w-full px-4 py-4 bg-muted/30 border-transparent rounded-2xl focus:border-primary/20 text-sm font-medium text-foreground resize-none placeholder:font-normal" />
              </CardContent>
            </Card>
            <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
              <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center gap-2"><ArrowLeftRight className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Result</span></div>
              <CardContent className="p-6">
                <Textarea value={outputText} readOnly placeholder="Result will appear here..." rows={14} className="w-full px-4 py-4 bg-muted/30 border-transparent rounded-2xl text-sm font-medium text-foreground resize-none placeholder:font-normal" />
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6 sticky top-24">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center gap-2"><Settings2 className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Mode</span></div>
            <CardContent className="p-8 space-y-6">
              <div className="bg-muted/30 p-1.5 rounded-xl flex items-center gap-1.5 border border-border/50">
                <button onClick={() => handleTabChange('encode')} className={cn("flex-1 py-2.5 px-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all", activeTab === 'encode' ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground hover:bg-muted")}>Encode</button>
                <button onClick={() => handleTabChange('decode')} className={cn("flex-1 py-2.5 px-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all", activeTab === 'decode' ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground hover:bg-muted")}>Decode</button>
              </div>
              <div className="space-y-3 pt-2">
                <Button onClick={copyToClipboard} disabled={!outputText} className="w-full h-14 rounded-2xl text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]">{copied ? <CheckCircle2 className="w-5 h-5 mr-2" /> : <Copy className="w-5 h-5 mr-2" />}{copied ? "Copied!" : "Copy Result"}</Button>
                <Button onClick={clearAll} variant="outline" className="w-full h-12 rounded-xl border-border/50 font-bold text-muted-foreground"><Trash2 className="w-4 h-4 mr-2" /> Clear All</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center gap-2"><Zap className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Info</span></div>
            <CardContent className="p-6">
              <p className="text-xs text-muted-foreground leading-relaxed font-medium">Base64 is a binary-to-text encoding scheme. Use <strong>Encode</strong> to convert text to Base64, or <strong>Decode</strong> to reverse it.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
