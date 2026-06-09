"use client";

import React, { useState, useEffect } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Link as LinkIcon, Copy, CheckCircle2, Shuffle, Hash, Globe } from "lucide-react";

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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 lg:order-last space-y-6">
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <Button onClick={copyToClipboard} disabled={!slug} className="w-full h-12 shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest text-xs rounded-xl">{copied ? <CheckCircle2 className="w-5 h-5 mr-2" /> : <Copy className="w-5 h-5 mr-2" />}{copied ? "Copied!" : "Copy Slug"}</Button>
          </div>
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">Settings</h3>
            <div><label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block">Separator</label><select value={settings.separator} onChange={(e) => setSettings({ ...settings, separator: e.target.value })} className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl focus:border-primary focus:outline-none text-sm font-bold text-foreground"><option value="-">Hyphen (-)</option><option value="_">Underscore (_)</option></select></div>
            <label className="flex items-center cursor-pointer gap-3"><input type="checkbox" checked={settings.lowercase} onChange={(e) => setSettings({ ...settings, lowercase: e.target.checked })} className="w-5 h-5 text-primary border-border rounded focus:ring-primary" /><span className="text-sm text-muted-foreground font-medium">Lowercase</span></label>
            <label className="flex items-center cursor-pointer gap-3"><input type="checkbox" checked={settings.removeStopWords} onChange={(e) => setSettings({ ...settings, removeStopWords: e.target.checked })} className="w-5 h-5 text-primary border-border rounded focus:ring-primary" /><span className="text-sm text-muted-foreground font-medium">Remove stop words</span></label>
            <div><label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block">Max Length</label><input type="number" value={settings.maxLength} onChange={(e) => setSettings({ ...settings, maxLength: Number(e.target.value) })} className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl focus:border-primary focus:outline-none text-sm font-bold text-foreground" /></div>
          </div>
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <Button onClick={generateSampleSlugs} variant="outline" className="w-full h-12 border-border hover:bg-accent text-muted-foreground hover:text-foreground font-bold uppercase tracking-widest text-xs"><Shuffle className="w-4 h-4 mr-2" /> Random Example</Button>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <div className="bg-card rounded-[2rem] shadow-sm border border-border p-8">
            <h3 className="text-lg font-black text-foreground mb-6 flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center"><LinkIcon className="w-5 h-5 text-primary" /></div>Text to Slugify</h3>
            <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="Enter your title or text here..." className="w-full px-5 py-3.5 bg-muted border border-border rounded-2xl focus:bg-card focus:border-primary focus:outline-none transition-all text-sm font-bold text-foreground placeholder:font-normal" />
          </div>

          {slug && (
            <div className="bg-primary rounded-[2.5rem] p-8 shadow-xl shadow-primary/20 text-primary-foreground relative overflow-hidden">
              <div className="relative z-10 space-y-6">
                <div className="flex justify-between items-center"><div className="flex items-center gap-4"><div className="w-12 h-12 bg-primary-foreground/10 rounded-2xl flex items-center justify-center"><Hash className="w-6 h-6 text-primary-foreground" /></div><div><h2 className="text-lg font-black tracking-tight">Generated Slug</h2></div></div><button onClick={copyToClipboard} className="p-3 bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground rounded-xl transition-all"><Copy className="w-4 h-4" /></button></div>
                <div className="p-6 bg-primary-foreground/5 rounded-2xl border border-primary-foreground/10 font-mono text-xl md:text-2xl font-black break-all leading-relaxed">{slug}</div>
                <div className="flex items-center gap-2"><span className="px-3 py-1 bg-primary-foreground/10 rounded-full text-[10px] font-black uppercase tracking-widest border border-primary-foreground/10"><Globe className="w-3 h-3 inline mr-1" />{previewUrl}</span></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
