"use client";

import React, { useState, useEffect } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Share2, Copy, CheckCircle2, Eye, Type, Image as ImageIcon, Link as LinkIcon, Globe, Zap, Settings2 } from "lucide-react";

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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center gap-3"><Type className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">General Info</span></div>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2"><Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Page Title</Label><Input type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="Enter page title..." className="mt-1.5 h-14 px-5 bg-muted/30 border-transparent rounded-2xl focus:border-primary/20 text-sm font-bold" /></div>
                <div className="md:col-span-2"><Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Meta Description</Label><Textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} placeholder="Briefly describe your content..." className="mt-1.5 px-5 py-3.5 bg-muted/30 border-transparent rounded-2xl focus:border-primary/20 text-sm font-medium resize-none placeholder:font-normal" /></div>
                <div><Label className={`text-[10px] font-bold uppercase tracking-wider ml-1 ${!isValidUrl(formData.url) ? "text-red-500" : "text-muted-foreground"}`}>Page URL</Label><div className="relative mt-1.5"><LinkIcon className={`absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 ${!isValidUrl(formData.url) ? "text-red-400" : "text-muted-foreground"}`} /><Input type="url" name="url" value={formData.url} onChange={handleInputChange} className={`h-14 pl-12 pr-5 bg-muted/30 border-transparent rounded-2xl ${!isValidUrl(formData.url) ? "border-red-200 focus:border-red-500" : "focus:border-primary/20"} text-sm font-bold`} placeholder="https://example.com/page" /></div></div>
                <div><Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Site Name</Label><div className="relative mt-1.5"><Globe className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input type="text" name="siteName" value={formData.siteName} onChange={handleInputChange} className="h-14 pl-12 pr-5 bg-muted/30 border-transparent rounded-2xl focus:border-primary/20 text-sm font-bold" placeholder="My Awesome Site" /></div></div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center gap-3"><ImageIcon className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Preview Image</span></div>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2"><Label className={`text-[10px] font-bold uppercase tracking-wider ml-1 ${!isValidUrl(formData.image) ? "text-red-500" : "text-muted-foreground"}`}>Image URL</Label><Input type="url" name="image" value={formData.image} onChange={handleInputChange} className={`mt-1.5 h-14 px-5 bg-muted/30 border-transparent rounded-2xl ${!isValidUrl(formData.image) ? "border-red-200 focus:border-red-500" : "focus:border-primary/20"} text-sm font-bold`} placeholder="https://example.com/social-image.jpg" /></div>
                <div><Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Dimensions</Label><div className="flex items-center gap-3 mt-1.5"><Input type="text" name="imageWidth" value={formData.imageWidth} onChange={handleInputChange} placeholder="Width" className="h-14 px-5 bg-muted/30 border-transparent rounded-2xl focus:border-primary/20 text-sm font-bold" /><span className="text-muted-foreground font-black">&times;</span><Input type="text" name="imageHeight" value={formData.imageHeight} onChange={handleInputChange} placeholder="Height" className="h-14 px-5 bg-muted/30 border-transparent rounded-2xl focus:border-primary/20 text-sm font-bold" /></div></div>
                <div><Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Image Alt Text</Label><Input type="text" name="imageAlt" value={formData.imageAlt} onChange={handleInputChange} className="mt-1.5 h-14 px-5 bg-muted/30 border-transparent rounded-2xl focus:border-primary/20 text-sm font-bold" placeholder="Describe the image content..." /></div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
              <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center justify-between"><div className="flex items-center gap-3"><span className="px-2 py-1 bg-primary/10 text-primary text-[10px] rounded-lg font-black uppercase tracking-widest">&lt;head&gt;</span><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Generated Tags</span></div><Button onClick={copyToClipboard} variant="outline" size="sm" className="h-8 rounded-xl font-bold text-[10px]">{copied ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}{copied ? "Copied" : "Copy Tags"}</Button></div>
              <CardContent className="p-0 bg-muted"><pre className="p-8 overflow-x-auto text-[11px] font-mono text-foreground max-h-[400px] leading-relaxed">{generatedTags || "<!-- Tags will appear here... -->"}</pre></CardContent>
            </Card>
            <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
              <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center gap-3"><Eye className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Preview</span></div>
              <CardContent className="p-8 bg-muted/30 flex items-center justify-center min-h-[400px]">
                <div className="w-full max-w-[480px] bg-card border border-border shadow-xl overflow-hidden rounded-2xl">
                  {formData.image ? (<img src={formData.image} alt="Preview" className="w-full h-[250px] object-cover border-b border-border" onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/1200x630/f3f4f6/9ca3af?text=No+Image"; }} />) : (<div className="w-full h-[250px] bg-muted flex items-center justify-center border-b border-border"><ImageIcon className="w-16 h-16 text-muted-foreground" /></div>)}
                  <div className="p-5 bg-muted/30">
                    <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest truncate">{getSafeHostname(formData.url)}</div>
                    <div className="text-lg font-black text-foreground line-clamp-2 leading-tight mt-1.5">{formData.title || "Your Page Title"}</div>
                    <div className="text-sm text-muted-foreground font-medium line-clamp-2 leading-relaxed mt-2">{formData.description || "Your page description will appear here when you share the link..."}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6 sticky top-24">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center gap-2"><Zap className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Actions</span></div>
            <CardContent className="p-8">
              <Button onClick={copyToClipboard} disabled={!generatedTags} className="w-full h-14 rounded-2xl text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]">{copied ? <CheckCircle2 className="w-5 h-5 mr-2" /> : <Copy className="w-5 h-5 mr-2" />}{copied ? "Copied!" : "Copy OG Tags"}</Button>
            </CardContent>
          </Card>
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center gap-2"><Settings2 className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Settings</span></div>
            <CardContent className="p-8 space-y-4">
              <div><Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Content Type</Label><select name="type" value={formData.type} onChange={handleInputChange} className="w-full mt-1.5 px-4 py-2.5 bg-muted/30 border border-border rounded-xl focus:border-primary focus:outline-none text-sm font-bold text-foreground"><option value="website">Website</option><option value="article">Article</option><option value="blog">Blog</option><option value="product">Product</option><option value="profile">Profile</option></select></div>
              <div><Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Locale</Label><select name="locale" value={formData.locale} onChange={handleInputChange} className="w-full mt-1.5 px-4 py-2.5 bg-muted/30 border border-border rounded-xl focus:border-primary focus:outline-none text-sm font-bold text-foreground"><option value="en_US">English (US)</option><option value="en_GB">English (UK)</option><option value="es_ES">Spanish</option><option value="fr_FR">French</option><option value="de_DE">German</option></select></div>
            </CardContent>
          </Card>
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center gap-2"><Share2 className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Twitter Settings</span></div>
            <CardContent className="p-8 space-y-4">
              <div><Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Card Type</Label><select name="twitterCard" value={formData.twitterCard} onChange={handleInputChange} className="w-full mt-1.5 px-4 py-2.5 bg-muted/30 border border-border rounded-xl focus:border-primary focus:outline-none text-sm font-bold text-foreground"><option value="summary">Summary</option><option value="summary_large_image">Large Image</option></select></div>
              <div className="relative mt-1.5"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-bold">@</span><Input type="text" name="twitterSite" value={formData.twitterSite} onChange={handleInputChange} placeholder="site handle" className="h-12 pl-8 pr-4 bg-muted/30 border-transparent rounded-xl focus:border-primary/20 text-sm font-bold" /></div>
            </CardContent>
          </Card>
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center gap-2"><Globe className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Samples</span></div>
            <CardContent className="p-8"><Button onClick={loadSampleData} variant="outline" className="w-full h-12 rounded-xl border-border/50 font-bold text-muted-foreground"><Globe className="w-4 h-4 mr-2" /> Load Sample Data</Button></CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
