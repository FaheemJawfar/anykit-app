"use client";

import React, { useState, useEffect } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link as LinkIcon, Copy, CheckCircle2, Shuffle, Hash, Globe, Zap, Settings2 } from "lucide-react";

export default function UrlSlugGenerator() {
  const [inputText, setInputText] = useState("");
  const [slug, setSlug] = useState("");
  const [settings, setSettings] = useState({ separator: "-", lowercase: true, removeStopWords: false, maxLength: 50 });
  const [copied, setCopied] = useState(false);

  const stopWords = ["a", "an", "and", "are", "as", "at", "be", "by", "for", "from", "has", "he", "in", "is", "it", "its", "of", "on", "that", "the", "to", "was", "will", "with", "would", "you", "your", "have", "had", "but", "not", "or", "can", "could", "should", "this", "they", "we"];

  const generateSlug = (text: string) => {
    if (!text.trim()) { setSlug(""); return; }
    let processedText = text.trim();
    if (settings.lowercase) processedText = processedText.toLowerCase();
    processedText = processedText.replace(/[^\w\s-]/g, "").replace(/\s+/g, settings.separator).replace(new RegExp(`\\${settings.separator}+`, "g"), settings.separator);
    if (settings.removeStopWords) { const words = processedText.split(settings.separator); const filteredWords = words.filter(word => word.length > 0 && !stopWords.includes(word.toLowerCase())); processedText = filteredWords.join(settings.separator); }
    processedText = processedText.replace(new RegExp(`^\\${settings.separator}+|\\${settings.separator}+$`, "g"), "");
    if (settings.maxLength > 0 && processedText.length > settings.maxLength) { const words = processedText.split(settings.separator); let truncated = ""; for (const word of words) { const testSlug = truncated ? `${truncated}${settings.separator}${word}` : word; if (testSlug.length <= settings.maxLength) truncated = testSlug; else break; } processedText = truncated; }
    setSlug(processedText);
  };

  useEffect(() => { generateSlug(inputText); }, [inputText, settings]);

  const copyToClipboard = async () => { try { await navigator.clipboard.writeText(slug); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch (err) { console.error(err); } };
  const generateSampleSlugs = () => { const samples = ["How to Create SEO Friendly URLs", "Best Practices for Web Development in 2024", "The Ultimate Guide to Digital Marketing", "Why Your Website Needs HTTPS Security", "10 Tips for Better User Experience Design"]; setInputText(samples[Math.floor(Math.random() * samples.length)]); };
  const previewUrl = slug ? `https://example.com/${slug}` : "https://example.com/your-url-slug";

  return (
    <ToolLayout toolId="url-slug">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center gap-3"><LinkIcon className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Text to Slugify</span></div>
            <CardContent className="p-8">
              <Input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="Enter your title or text here..." className="h-14 px-5 bg-muted/30 border-transparent rounded-2xl focus:border-primary/20 text-sm font-bold" />
            </CardContent>
          </Card>

          {slug && (
            <Card className="border-primary/40 shadow-xl shadow-primary/20 bg-primary/5 backdrop-blur-sm rounded-[2.5rem] overflow-hidden relative">
              <CardContent className="p-8 space-y-6">
                <div className="flex justify-between items-center"><div className="flex items-center gap-4"><div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center"><Hash className="w-6 h-6 text-primary" /></div><div><h2 className="text-lg font-black tracking-tight text-foreground">Generated Slug</h2></div></div><Button onClick={copyToClipboard} variant="outline" className="rounded-xl border-border/50 p-3 h-auto"><Copy className="w-4 h-4" /></Button></div>
                <div className="p-6 bg-muted/30 rounded-2xl border border-border font-mono text-xl md:text-2xl font-black break-all leading-relaxed text-foreground">{slug}</div>
                <div className="flex items-center gap-2"><span className="px-3 py-1 bg-muted/30 rounded-full text-[10px] font-black uppercase tracking-widest border border-border text-muted-foreground"><Globe className="w-3 h-3 inline mr-1" />{previewUrl}</span></div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:col-span-4 space-y-6 sticky top-24">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center gap-2"><Zap className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Actions</span></div>
            <CardContent className="p-8">
              <Button onClick={copyToClipboard} disabled={!slug} className="w-full h-14 rounded-2xl text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]">{copied ? <CheckCircle2 className="w-5 h-5 mr-2" /> : <Copy className="w-5 h-5 mr-2" />}{copied ? "Copied!" : "Copy Slug"}</Button>
            </CardContent>
          </Card>
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center gap-2"><Settings2 className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Settings</span></div>
            <CardContent className="p-8 space-y-4">
              <div><Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Separator</Label><select value={settings.separator} onChange={(e) => setSettings({ ...settings, separator: e.target.value })} className="w-full mt-1.5 px-4 py-2.5 bg-muted/30 border border-border rounded-xl focus:border-primary focus:outline-none text-sm font-bold text-foreground"><option value="-">Hyphen (-)</option><option value="_">Underscore (_)</option></select></div>
              <label className="flex items-center cursor-pointer gap-3"><input type="checkbox" checked={settings.lowercase} onChange={(e) => setSettings({ ...settings, lowercase: e.target.checked })} className="w-5 h-5 text-primary border-border rounded focus:ring-primary" /><span className="text-sm text-muted-foreground font-medium">Lowercase</span></label>
              <label className="flex items-center cursor-pointer gap-3"><input type="checkbox" checked={settings.removeStopWords} onChange={(e) => setSettings({ ...settings, removeStopWords: e.target.checked })} className="w-5 h-5 text-primary border-border rounded focus:ring-primary" /><span className="text-sm text-muted-foreground font-medium">Remove stop words</span></label>
              <div><Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Max Length</Label><Input type="number" value={settings.maxLength} onChange={(e) => setSettings({ ...settings, maxLength: Number(e.target.value) })} className="mt-1.5 h-12 px-4 bg-muted/30 border-transparent rounded-xl focus:border-primary/20 text-sm font-bold" /></div>
            </CardContent>
          </Card>
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center gap-2"><Shuffle className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Examples</span></div>
            <CardContent className="p-8"><Button onClick={generateSampleSlugs} variant="outline" className="w-full h-12 rounded-xl border-border/50 font-bold text-muted-foreground"><Shuffle className="w-4 h-4 mr-2" /> Random Example</Button></CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
