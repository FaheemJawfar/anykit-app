"use client";

import React, { useState, useEffect } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Tags, Copy, CheckCircle2, Search, RefreshCw, Share2, Globe, Layout, Link as LinkIcon } from "lucide-react";

export default function MetaTagGenerator() {
  const [formData, setFormData] = useState({ title: "", description: "", keywords: "", author: "", viewport: "width=device-width, initial-scale=1.0", robots: "index, follow", canonical: "", ogTitle: "", ogDescription: "", ogImage: "", ogUrl: "", ogType: "website", twitterCard: "summary_large_image", twitterTitle: "", twitterDescription: "", twitterImage: "" });
  const [copied, setCopied] = useState(false);
  const [generatedTags, setGeneratedTags] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); };

  const generateMetaTags = () => {
    const tags = [];
    if (formData.title) { tags.push(`<title>${formData.title}</title>`); tags.push(`<meta name="title" content="${formData.title}">`); }
    if (formData.description) tags.push(`<meta name="description" content="${formData.description}">`);
    if (formData.keywords) tags.push(`<meta name="keywords" content="${formData.keywords}">`);
    if (formData.author) tags.push(`<meta name="author" content="${formData.author}">`);
    tags.push(`<meta name="viewport" content="${formData.viewport}">`);
    tags.push(`<meta name="robots" content="${formData.robots}">`);
    if (formData.canonical) tags.push(`<link rel="canonical" href="${formData.canonical}">`);
    const ogTitle = formData.ogTitle || formData.title; const ogDescription = formData.ogDescription || formData.description;
    if (ogTitle) tags.push(`<meta property="og:title" content="${ogTitle}">`);
    if (ogDescription) tags.push(`<meta property="og:description" content="${ogDescription}">`);
    if (formData.ogImage) tags.push(`<meta property="og:image" content="${formData.ogImage}">`);
    if (formData.ogUrl) tags.push(`<meta property="og:url" content="${formData.ogUrl}">`);
    tags.push(`<meta property="og:type" content="${formData.ogType}">`);
    tags.push(`<meta name="twitter:card" content="${formData.twitterCard}">`);
    const twitterTitle = formData.twitterTitle || formData.ogTitle || formData.title; const twitterDescription = formData.twitterDescription || formData.ogDescription || formData.description; const twitterImage = formData.twitterImage || formData.ogImage;
    if (twitterTitle) tags.push(`<meta name="twitter:title" content="${twitterTitle}">`);
    if (twitterDescription) tags.push(`<meta name="twitter:description" content="${twitterDescription}">`);
    if (twitterImage) tags.push(`<meta name="twitter:image" content="${twitterImage}">`);
    setGeneratedTags(tags.join("\n"));
  };

  useEffect(() => { generateMetaTags(); }, [formData]);

  const copyToClipboard = async () => { try { await navigator.clipboard.writeText(generatedTags); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch (err) { console.error(err); } };
  const handleReset = () => { setFormData({ title: "", description: "", keywords: "", author: "", viewport: "width=device-width, initial-scale=1.0", robots: "index, follow", canonical: "", ogTitle: "", ogDescription: "", ogImage: "", ogUrl: "", ogType: "website", twitterCard: "summary_large_image", twitterTitle: "", twitterDescription: "", twitterImage: "" }); };
  const loadSampleData = () => { setFormData({ title: "Utilzy - All-in-One Utility Suite", description: "Utilzy provides free, fast, and secure client-side tools for developers, designers, and marketers.", keywords: "utility tools, seo generator, image editor, json formatter", author: "Utilzy Team", viewport: "width=device-width, initial-scale=1.0", robots: "index, follow", canonical: "https://utilzy.com", ogTitle: "Utilzy | Premium Utility Tools for Modern Pro", ogDescription: "The ultimate collection of high-performance utility tools for your daily digital tasks. 100% private and secure.", ogImage: "https://utilzy.com/og-image.png", ogUrl: "https://utilzy.com", ogType: "website", twitterCard: "summary_large_image", twitterTitle: "Utilzy - Modern Utility Suite", twitterDescription: "Experience the fastest utility toolset on the web.", twitterImage: "https://utilzy.com/twitter-card.png" }); };

  return (
    <ToolLayout toolId="meta-tags">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 lg:order-last space-y-6">
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <Button onClick={copyToClipboard} disabled={!generatedTags || !formData.title} className="w-full h-12 shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest text-xs rounded-xl">{copied ? <CheckCircle2 className="w-5 h-5 mr-2" /> : <Copy className="w-5 h-5 mr-2" />}{copied ? "Copied!" : "Copy All Tags"}</Button>
          </div>
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <Button onClick={loadSampleData} variant="outline" className="w-full h-12 border-border hover:bg-accent text-muted-foreground hover:text-foreground font-bold uppercase tracking-widest text-xs"><Search className="w-4 h-4 mr-2" /> Load Sample Data</Button>
            <Button onClick={handleReset} variant="outline" className="w-full h-12 border-border hover:bg-accent text-muted-foreground hover:text-foreground font-bold uppercase tracking-widest text-xs"><RefreshCw className="w-4 h-4 mr-2" /> Reset Generator</Button>
          </div>
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">Search Engine Settings</h3>
            <div><label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block">Robots</label><select name="robots" value={formData.robots} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl focus:border-primary focus:outline-none text-sm font-bold text-foreground"><option value="index, follow">Index, Follow</option><option value="noindex, follow">No Index, Follow</option><option value="index, nofollow">Index, No Follow</option><option value="noindex, nofollow">No Index, No Follow</option></select></div>
            <div><label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block">Author</label><input type="text" name="author" value={formData.author} onChange={handleInputChange} placeholder="Author name" className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl focus:border-primary focus:outline-none text-sm font-bold text-foreground placeholder:font-normal" /></div>
            <div><label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block">Canonical URL</label><input type="url" name="canonical" value={formData.canonical} onChange={handleInputChange} placeholder="https://example.com/page" className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl focus:border-primary focus:outline-none text-sm font-bold text-foreground placeholder:font-normal" /></div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <div className="bg-card rounded-[2rem] shadow-sm border border-border p-8">
            <h3 className="text-lg font-black text-foreground mb-6 flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center"><Search className="w-5 h-5 text-primary" /></div>General SEO Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2"><label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block">Page Title</label><div className="relative"><input type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full px-5 py-3.5 bg-muted border border-border rounded-2xl focus:bg-card focus:border-primary focus:outline-none transition-all text-sm font-bold text-foreground placeholder:font-normal" placeholder="Enter page title (50-60 chars)" /><span className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-black text-muted-foreground">{formData.title.length}/60</span></div></div>
              <div className="md:col-span-2"><label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block">Meta Description</label><div className="relative"><textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} className="w-full px-5 py-3.5 bg-muted border border-border rounded-2xl focus:bg-card focus:border-primary focus:outline-none transition-all text-sm font-medium text-foreground resize-none placeholder:font-normal" placeholder="Briefly describe your content (150-160 characters)" /><span className="absolute right-5 bottom-4 text-[10px] font-black text-muted-foreground">{formData.description.length}/160</span></div></div>
              <div className="md:col-span-2"><label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block">Keywords (Comma separated)</label><input type="text" name="keywords" value={formData.keywords} onChange={handleInputChange} className="w-full px-5 py-3.5 bg-muted border border-border rounded-2xl focus:bg-card focus:border-primary focus:outline-none transition-all text-sm font-bold text-foreground placeholder:font-normal" placeholder="seo, tools, generator, tags" /></div>
            </div>
          </div>

          {generatedTags && formData.title && (
            <div className="bg-card rounded-[2rem] shadow-sm border border-border overflow-hidden">
              <div className="p-6 border-b border-border flex items-center justify-between bg-muted/50"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center"><Layout className="w-4 h-4 text-primary" /></div><h3 className="text-lg font-black text-foreground">Generated Tags</h3></div><Button onClick={copyToClipboard} variant="outline" size="sm" className="h-8 text-[10px] font-black">{copied ? <CheckCircle2 className="w-3.5 h-3.5 mr-2" /> : <Copy className="w-3.5 h-3.5 mr-2" />}{copied ? "Copied!" : "Copy Tags"}</Button></div>
              <div className="p-0 bg-muted"><pre className="p-8 overflow-x-auto text-xs font-mono text-foreground max-h-[400px] leading-relaxed">{generatedTags}</pre></div>
            </div>
          )}

          <div className="bg-card rounded-[2rem] shadow-sm border border-border p-8">
            <div className="flex items-center gap-3 mb-6"><div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center"><Share2 className="w-5 h-5 text-primary" /></div><h3 className="text-lg font-black text-foreground">Social Media Settings</h3></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h4 className="text-sm font-black text-foreground flex items-center gap-3 border-l-[3px] border-primary pl-4 py-1 uppercase tracking-widest text-xs"><Share2 className="w-4 h-4 text-primary" />Open Graph (Facebook)</h4>
                <div><label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block">OG Description</label><textarea name="ogDescription" value={formData.ogDescription} onChange={handleInputChange} placeholder="Defaults to meta description" rows={2} className="w-full px-5 py-3.5 bg-muted border border-border rounded-2xl focus:bg-card focus:border-primary focus:outline-none transition-all text-sm font-medium text-foreground resize-none placeholder:font-normal" /></div>
                <div><label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block">OG Image URL</label><div className="relative"><LinkIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><input type="url" name="ogImage" value={formData.ogImage} onChange={handleInputChange} placeholder="https://example.com/og-image.jpg" className="w-full pl-12 pr-5 py-3.5 bg-muted border border-border rounded-2xl focus:bg-card focus:border-primary focus:outline-none transition-all text-sm font-bold text-foreground placeholder:font-normal" /></div></div>
                <div><label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block">OG Type</label><select name="ogType" value={formData.ogType} onChange={handleInputChange} className="w-full px-5 py-3.5 bg-muted border border-border rounded-2xl focus:border-primary focus:outline-none transition-all text-sm font-bold text-foreground"><option value="website">Website</option><option value="article">Article</option><option value="profile">Profile</option></select></div>
              </div>
              <div className="space-y-6">
                <h4 className="text-sm font-black text-foreground flex items-center gap-3 border-l-[3px] border-border pl-4 py-1 uppercase tracking-widest text-xs">Twitter Cards</h4>
                <div><label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block">Twitter Title</label><input type="text" name="twitterTitle" value={formData.twitterTitle} onChange={handleInputChange} placeholder="Defaults to OG title" className="w-full px-5 py-3.5 bg-muted border border-border rounded-2xl focus:bg-card focus:border-primary focus:outline-none transition-all text-sm font-bold text-foreground placeholder:font-normal" /></div>
                <div><label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block">Twitter Image URL</label><div className="relative"><LinkIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><input type="url" name="twitterImage" value={formData.twitterImage} onChange={handleInputChange} placeholder="https://example.com/twitter-image.jpg" className="w-full pl-12 pr-5 py-3.5 bg-muted border border-border rounded-2xl focus:bg-card focus:border-primary focus:outline-none transition-all text-sm font-bold text-foreground placeholder:font-normal" /></div></div>
                <div><label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block">Twitter Description</label><textarea name="twitterDescription" value={formData.twitterDescription} onChange={handleInputChange} placeholder="Defaults to OG description" rows={2} className="w-full px-5 py-3.5 bg-muted border border-border rounded-2xl focus:bg-card focus:border-primary focus:outline-none transition-all text-sm font-medium text-foreground resize-none placeholder:font-normal" /></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
