"use client";

import React, { useState, useEffect } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Network, Plus, Trash2, Copy, CheckCircle2, Download, Globe, FileCode, Zap, Info } from "lucide-react";

interface SitemapEntry { id: string; url: string; lastmod: string; changefreq: string; priority: string; }

export default function SitemapGenerator() {
  const [entries, setEntries] = useState<SitemapEntry[]>([{ id: "1", url: "", lastmod: new Date().toISOString().split("T")[0], changefreq: "weekly", priority: "0.8" }]);
  const [copied, setCopied] = useState(false);
  const [generatedXml, setGeneratedXml] = useState("");

  const addEntry = () => { setEntries([...entries, { id: Date.now().toString(), url: "", lastmod: new Date().toISOString().split("T")[0], changefreq: "weekly", priority: "0.8" }]); };
  const removeEntry = (id: string) => { if (entries.length > 1) setEntries(entries.filter(entry => entry.id !== id)); };
  const updateEntry = (id: string, field: keyof SitemapEntry, value: string) => { setEntries(entries.map(entry => entry.id === id ? { ...entry, [field]: value } : entry)); };

  const generateSitemap = () => {
    const validEntries = entries.filter(entry => entry.url.trim() !== "");
    if (validEntries.length === 0) { setGeneratedXml("<!-- Add at least one URL to generate sitemap -->"); return; }
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${validEntries.map(entry => `  <url>\n    <loc>${entry.url}</loc>\n    <lastmod>${entry.lastmod}</lastmod>\n    <changefreq>${entry.changefreq}</changefreq>\n    <priority>${entry.priority}</priority>\n  </url>`).join("\n")}\n</urlset>`;
    setGeneratedXml(xml);
  };

  useEffect(() => { generateSitemap(); }, [entries]);

  const copyToClipboard = async () => { try { await navigator.clipboard.writeText(generatedXml); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch (err) { console.error(err); } };
  const downloadSitemap = () => { const blob = new Blob([generatedXml], { type: "application/xml" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "sitemap.xml"; a.click(); URL.revokeObjectURL(url); };
  const loadSampleData = () => { const today = new Date().toISOString().split("T")[0]; setEntries([{ id: "1", url: "https://example.com/", lastmod: today, changefreq: "daily", priority: "1.0" }, { id: "2", url: "https://example.com/about", lastmod: today, changefreq: "monthly", priority: "0.8" }, { id: "3", url: "https://example.com/products", lastmod: today, changefreq: "weekly", priority: "0.9" }]); };

  return (
    <ToolLayout toolId="sitemap">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center justify-between"><div className="flex items-center gap-3"><Network className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">URLs ({entries.length})</span></div><Button onClick={addEntry} variant="outline" size="sm" className="rounded-xl font-bold"><Plus className="w-4 h-4 mr-2" /> Add URL</Button></div>
            <CardContent className="p-8 space-y-4">
              {entries.map((entry) => (
                <div key={entry.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center bg-muted/30 p-3 rounded-xl border border-border hover:border-primary/20 transition-all">
                  <div className="md:col-span-5"><input type="url" placeholder="https://example.com/page" value={entry.url} onChange={(e) => updateEntry(entry.id, "url", e.target.value)} className="w-full px-3 py-2.5 bg-card border border-border rounded-xl focus:border-primary focus:outline-none text-sm font-bold text-foreground placeholder:font-normal" /></div>
                  <div className="md:col-span-3"><input type="date" value={entry.lastmod} onChange={(e) => updateEntry(entry.id, "lastmod", e.target.value)} className="w-full px-3 py-2.5 bg-card border border-border rounded-xl focus:border-primary focus:outline-none text-sm font-bold text-foreground" /></div>
                  <div className="md:col-span-2"><select value={entry.changefreq} onChange={(e) => updateEntry(entry.id, "changefreq", e.target.value)} className="w-full px-3 py-2.5 bg-card border border-border rounded-xl focus:border-primary focus:outline-none text-sm font-bold text-foreground"><option value="always">Always</option><option value="hourly">Hourly</option><option value="daily">Daily</option><option value="weekly">Weekly</option><option value="monthly">Monthly</option><option value="yearly">Yearly</option><option value="never">Never</option></select></div>
                  <div className="md:col-span-1"><input type="number" min="0" max="1" step="0.1" value={entry.priority} onChange={(e) => updateEntry(entry.id, "priority", e.target.value)} className="w-full px-3 py-2.5 bg-card border border-border rounded-xl focus:border-primary focus:outline-none text-sm font-bold text-foreground text-center" /></div>
                  <div className="md:col-span-1 flex justify-end"><Button onClick={() => removeEntry(entry.id)} disabled={entries.length === 1} variant="ghost" size="icon" className="text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></Button></div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center justify-between"><div className="flex items-center gap-3"><FileCode className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Generated XML</span></div><Button onClick={copyToClipboard} variant="outline" size="sm" className="h-8 rounded-xl font-bold text-[10px]">{copied ? <CheckCircle2 className="w-3.5 h-3.5 mr-2" /> : <Copy className="w-3.5 h-3.5 mr-2" />}{copied ? "Copied" : "Copy XML"}</Button></div>
            <CardContent className="p-0 bg-muted"><pre className="p-8 overflow-x-auto text-xs font-mono text-foreground leading-relaxed">{generatedXml}</pre></CardContent>
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-6 sticky top-24">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center gap-2"><Zap className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Actions</span></div>
            <CardContent className="p-8 space-y-3">
              <Button onClick={downloadSitemap} className="w-full h-14 rounded-2xl text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"><Download className="w-5 h-5 mr-2" /> Download XML</Button>
              <Button onClick={copyToClipboard} variant="outline" className="w-full h-12 rounded-xl border-border/50 font-bold text-muted-foreground">{copied ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}{copied ? "Copied!" : "Copy to Clipboard"}</Button>
            </CardContent>
          </Card>
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center gap-2"><Globe className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Samples</span></div>
            <CardContent className="p-8"><Button onClick={loadSampleData} variant="outline" className="w-full h-12 rounded-xl border-border/50 font-bold text-muted-foreground"><Globe className="w-4 h-4 mr-2" /> Load Sample Data</Button></CardContent>
          </Card>
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center gap-2"><Info className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">About Sitemaps</span></div>
            <CardContent className="p-6"><p className="text-xs text-muted-foreground leading-relaxed font-medium">An XML sitemap is a roadmap for search engines. It tells crawlers which pages are most important and how often they are updated.</p></CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
