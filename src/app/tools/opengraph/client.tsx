"use client";

import React, { useState, useEffect } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Share2, Copy, CheckCircle2, Eye, Type, Image as ImageIcon, Link as LinkIcon, Globe } from "lucide-react";

export default function OpenGraphGenerator() {
  const [formData, setFormData] = useState({ title: "", description: "", image: "", url: "", siteName: "", type: "website", locale: "en_US", imageWidth: "1200", imageHeight: "630", imageAlt: "", twitterCard: "summary_large_image", twitterSite: "", twitterCreator: "" });
  const [copied, setCopied] = useState(false);
  const [generatedTags, setGeneratedTags] = useState("");

  const isValidUrl = (url: string) => { if (!url) return true; try { new URL(url); return true; } catch { return false; } };
  const getSafeHostname = (url: string) => { try { if (!url) return "EXAMPLE.COM"; return new URL(url).hostname.toUpperCase(); } catch { return "EXAMPLE.COM"; } };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); };

  const generateTags = () => {
    const tags = [];
    if (formData.title) tags.push(`<meta property="og:title" content="${formData.title}">`);
    if (formData.description) tags.push(`<meta property="og:description" content="${formData.description}">`);
    if (formData.image) { tags.push(`<meta property="og:image" content="${formData.image}">`); if (formData.imageWidth) tags.push(`<meta property="og:image:width" content="${formData.imageWidth}">`); if (formData.imageHeight) tags.push(`<meta property="og:image:height" content="${formData.imageHeight}">`); if (formData.imageAlt) tags.push(`<meta property="og:image:alt" content="${formData.imageAlt}">`); }
    if (formData.url) tags.push(`<meta property="og:url" content="${formData.url}">`);
    if (formData.siteName) tags.push(`<meta property="og:site_name" content="${formData.siteName}">`);
    tags.push(`<meta property="og:type" content="${formData.type}">`);
    tags.push(`<meta property="og:locale" content="${formData.locale}">`);
    tags.push(`<meta name="twitter:card" content="${formData.twitterCard}">`);
    if (formData.title) tags.push(`<meta name="twitter:title" content="${formData.title}">`);
    if (formData.description) tags.push(`<meta name="twitter:description" content="${formData.description}">`);
    if (formData.image) tags.push(`<meta name="twitter:image" content="${formData.image}">`);
    if (formData.twitterSite) tags.push(`<meta name="twitter:site" content="@${formData.twitterSite.replace("@", "")}">`);
    if (formData.twitterCreator) tags.push(`<meta name="twitter:creator" content="@${formData.twitterCreator.replace("@", "")}">`);
    setGeneratedTags(tags.join("\n"));
  };

  useEffect(() => { generateTags(); }, [formData]);

  const copyToClipboard = async () => { try { await navigator.clipboard.writeText(generatedTags); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch (err) { console.error(err); } };
  const loadSampleData = () => { setFormData({ title: "How to Create Amazing Open Graph Tags", description: "Learn how to create compelling Open Graph meta tags that boost your social media engagement and click-through rates.", image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=630&fit=crop", url: "https://utilzy.com/seo-tools/opengraph", siteName: "Utilzy", type: "article", locale: "en_US", imageWidth: "1200", imageHeight: "630", imageAlt: "Open Graph tags tutorial banner", twitterCard: "summary_large_image", twitterSite: "utilzy_app", twitterCreator: "utilzy_app" }); };

  return (
    <ToolLayout toolId="opengraph">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 lg:order-last space-y-6">
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <Button onClick={copyToClipboard} disabled={!generatedTags} className="w-full h-12 shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest text-xs rounded-xl">{copied ? <CheckCircle2 className="w-5 h-5 mr-2" /> : <Copy className="w-5 h-5 mr-2" />}{copied ? "Copied!" : "Copy OG Tags"}</Button>
          </div>
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">Settings</h3>
            <div><label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block">Content Type</label><select name="type" value={formData.type} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl focus:border-primary focus:outline-none text-sm font-bold text-foreground"><option value="website">Website</option><option value="article">Article</option><option value="blog">Blog</option><option value="product">Product</option><option value="profile">Profile</option></select></div>
            <div><label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block">Locale</label><select name="locale" value={formData.locale} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl focus:border-primary focus:outline-none text-sm font-bold text-foreground"><option value="en_US">English (US)</option><option value="en_GB">English (UK)</option><option value="es_ES">Spanish</option><option value="fr_FR">French</option><option value="de_DE">German</option></select></div>
          </div>
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">Twitter Settings</h3>
            <div><label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block">Card Type</label><select name="twitterCard" value={formData.twitterCard} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl focus:border-primary focus:outline-none text-sm font-bold text-foreground"><option value="summary">Summary</option><option value="summary_large_image">Large Image</option></select></div>
            <div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-bold">@</span><input type="text" name="twitterSite" value={formData.twitterSite} onChange={handleInputChange} placeholder="site handle" className="w-full pl-8 pr-4 py-2.5 bg-muted border border-border rounded-xl focus:border-primary focus:outline-none text-sm font-bold text-foreground placeholder:font-normal" /></div>
          </div>
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <Button onClick={loadSampleData} variant="outline" className="w-full h-12 border-border hover:bg-accent text-muted-foreground hover:text-foreground font-bold uppercase tracking-widest text-xs"><Globe className="w-4 h-4 mr-2" /> Load Sample Data</Button>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <div className="bg-card rounded-[2rem] shadow-sm border border-border p-8">
            <h3 className="text-lg font-black text-foreground mb-6 flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center"><Type className="w-5 h-5 text-primary" /></div>General Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2"><label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block">Page Title</label><input type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full px-5 py-3.5 bg-muted border border-border rounded-2xl focus:bg-card focus:border-primary focus:outline-none transition-all text-sm font-bold text-foreground placeholder:font-normal" placeholder="Enter page title..." /></div>
              <div className="md:col-span-2"><label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block">Description</label><textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} className="w-full px-5 py-3.5 bg-muted border border-border rounded-2xl focus:bg-card focus:border-primary focus:outline-none transition-all text-sm font-medium text-foreground resize-none placeholder:font-normal" placeholder="Briefly describe your content..." /></div>
              <div><label className={`text-[10px] font-bold ${!isValidUrl(formData.url) ? "text-red-500" : "text-muted-foreground"} uppercase tracking-widest mb-1.5 block`}>Page URL</label><div className="relative"><LinkIcon className={`absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 ${!isValidUrl(formData.url) ? "text-red-400" : "text-muted-foreground"}`} /><input type="url" name="url" value={formData.url} onChange={handleInputChange} className={`w-full pl-12 pr-5 py-3.5 bg-muted border rounded-2xl focus:bg-card outline-none transition-all text-sm font-bold text-foreground ${!isValidUrl(formData.url) ? "border-red-200 focus:border-red-500" : "border-border focus:border-primary"}`} placeholder="https://example.com/page" /></div></div>
              <div><label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block">Site Name</label><div className="relative"><Globe className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><input type="text" name="siteName" value={formData.siteName} onChange={handleInputChange} className="w-full pl-12 pr-5 py-3.5 bg-muted border border-border rounded-2xl focus:bg-card focus:border-primary focus:outline-none transition-all text-sm font-bold text-foreground placeholder:font-normal" placeholder="My Awesome Site" /></div></div>
            </div>
          </div>

          <div className="bg-card rounded-[2rem] shadow-sm border border-border p-8">
            <h3 className="text-lg font-black text-foreground mb-6 flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center"><ImageIcon className="w-5 h-5 text-primary" /></div>Preview Image</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2"><label className={`text-[10px] font-bold ${!isValidUrl(formData.image) ? "text-red-500" : "text-muted-foreground"} uppercase tracking-widest mb-1.5 block`}>Image URL</label><input type="url" name="image" value={formData.image} onChange={handleInputChange} className={`w-full px-5 py-3.5 bg-muted border rounded-2xl focus:bg-card outline-none transition-all text-sm font-bold text-foreground ${!isValidUrl(formData.image) ? "border-red-200 focus:border-red-500" : "border-border focus:border-primary"}`} placeholder="https://example.com/social-image.jpg" /></div>
              <div><label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block">Dimensions</label><div className="flex items-center gap-3"><input type="text" name="imageWidth" value={formData.imageWidth} onChange={handleInputChange} placeholder="Width" className="w-full px-5 py-3.5 bg-muted border border-border rounded-2xl focus:border-primary focus:outline-none transition-all text-sm font-bold text-foreground placeholder:font-normal" /><span className="text-muted-foreground font-black">&times;</span><input type="text" name="imageHeight" value={formData.imageHeight} onChange={handleInputChange} placeholder="Height" className="w-full px-5 py-3.5 bg-muted border border-border rounded-2xl focus:border-primary focus:outline-none transition-all text-sm font-bold text-foreground placeholder:font-normal" /></div></div>
              <div><label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block">Image Alt Text</label><input type="text" name="imageAlt" value={formData.imageAlt} onChange={handleInputChange} className="w-full px-5 py-3.5 bg-muted border border-border rounded-2xl focus:bg-card focus:border-primary focus:outline-none transition-all text-sm font-bold text-foreground placeholder:font-normal" placeholder="Describe the image content..." /></div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="bg-card rounded-[2rem] shadow-sm border border-border overflow-hidden">
              <div className="p-6 border-b border-border flex items-center justify-between bg-muted/50"><h3 className="text-sm font-black text-foreground flex items-center gap-3"><div className="px-2 py-1 bg-primary/10 text-primary text-[10px] rounded-lg font-black uppercase tracking-widest">&lt;head&gt;</div>Generated Tags</h3><Button onClick={copyToClipboard} variant="outline" size="sm" className="h-8 bg-card text-xs font-black">{copied ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}{copied ? "Copied" : "Copy Tags"}</Button></div>
              <div className="p-0 bg-muted"><pre className="p-8 overflow-x-auto text-[11px] font-mono text-foreground max-h-[400px] leading-relaxed">{generatedTags || "<!-- Tags will appear here... -->"}</pre></div>
            </div>
            <div className="bg-card rounded-[2rem] shadow-sm border border-border overflow-hidden">
              <div className="p-6 border-b border-border flex items-center justify-between bg-muted/50"><h3 className="text-sm font-black text-foreground flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center"><Eye className="w-4 h-4 text-primary" /></div>Preview</h3></div>
              <div className="p-8 bg-muted/50 flex items-center justify-center min-h-[400px]">
                <div className="w-full max-w-[480px] bg-card border border-border shadow-xl overflow-hidden rounded-2xl">
                  {formData.image ? (<img src={formData.image} alt="Preview" className="w-full h-[250px] object-cover border-b border-border" onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/1200x630/f3f4f6/9ca3af?text=No+Image"; }} />) : (<div className="w-full h-[250px] bg-muted flex items-center justify-center border-b border-border"><ImageIcon className="w-16 h-16 text-muted-foreground" /></div>)}
                  <div className="p-5 bg-muted/50">
                    <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest truncate">{getSafeHostname(formData.url)}</div>
                    <div className="text-lg font-black text-foreground line-clamp-2 leading-tight mt-1.5">{formData.title || "Your Page Title"}</div>
                    <div className="text-sm text-muted-foreground font-medium line-clamp-2 leading-relaxed mt-2">{formData.description || "Your page description will appear here when you share the link..."}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
