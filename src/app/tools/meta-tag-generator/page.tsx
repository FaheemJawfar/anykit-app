"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Globe, 
  Copy, 
  Check, 
  Trash2,
  Zap,
  Eye,
  FileCode,
  Share2,
  Search,
  Image as ImageIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function MetaTagGenerator() {
  const [tags, setTags] = useState({
    title: "AnyKit - The Ultimate Utility Suite",
    description: "All the professional tools you need in one sleek application. Fast, secure, and entirely client-side.",
    url: "https://anykit.com",
    image: "https://anykit.com/og-image.png",
    twitterHandle: "@anykit_tools"
  });
  const [copied, setCopied] = useState(false);

  const generateMeta = () => {
    return `<!-- Primary Meta Tags -->
<title>${tags.title}</title>
<meta name="title" content="${tags.title}">
<meta name="description" content="${tags.description}">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="${tags.url}">
<meta property="og:title" content="${tags.title}">
<meta property="og:description" content="${tags.description}">
<meta property="og:image" content="${tags.image}">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="${tags.url}">
<meta property="twitter:title" content="${tags.title}">
<meta property="twitter:description" content="${tags.description}">
<meta property="twitter:image" content="${tags.image}">
${tags.twitterHandle ? `<meta name="twitter:site" content="${tags.twitterHandle}">` : ""}`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateMeta());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clear = () => {
    setTags({
      title: "",
      description: "",
      url: "",
      image: "",
      twitterHandle: ""
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
          <Share2 className="w-6 h-6" />
        </div>
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight">Meta Tag Generator</h1>
          <p className="text-sm text-muted-foreground">
            Create SEO and social media meta tags to control how your site appears in search and feeds.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Editor Side */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Site Info</Label>
                  <Button variant="ghost" size="sm" onClick={clear} className="h-8 rounded-xl font-bold text-destructive hover:bg-destructive/10">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs font-bold">Page Title</Label>
                  <Input 
                    value={tags.title}
                    onChange={(e) => setTags({...tags, title: e.target.value})}
                    placeholder="e.g. My Awesome Site"
                    className="h-12 rounded-xl bg-muted/30 border-border/40 font-bold"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold">Description</Label>
                  <Textarea 
                    value={tags.description}
                    onChange={(e) => setTags({...tags, description: e.target.value})}
                    placeholder="Short summary of your page..."
                    className="rounded-xl bg-muted/30 border-border/40 h-24 resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold">Site URL</Label>
                  <Input 
                    value={tags.url}
                    onChange={(e) => setTags({...tags, url: e.target.value})}
                    placeholder="https://example.com"
                    className="h-12 rounded-xl bg-muted/30 border-border/40 font-mono text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold">Image URL (OG Image)</Label>
                  <Input 
                    value={tags.image}
                    onChange={(e) => setTags({...tags, image: e.target.value})}
                    placeholder="https://example.com/og-image.png"
                    className="h-12 rounded-xl bg-muted/30 border-border/40 font-mono text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold">Twitter Username (Optional)</Label>
                  <Input 
                    value={tags.twitterHandle}
                    onChange={(e) => setTags({...tags, twitterHandle: e.target.value})}
                    placeholder="@username"
                    className="h-12 rounded-xl bg-muted/30 border-border/40 font-mono text-sm"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview & Output Side */}
        <div className="lg:col-span-7 space-y-8">
          {/* Visual Previews */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Social Previews</span>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {/* Google Preview */}
              <Card className="border-border/40 bg-card/40 rounded-2xl overflow-hidden p-6 space-y-1">
                <div className="flex items-center gap-2 mb-2">
                  <Search className="w-3 h-3 text-muted-foreground" />
                  <span className="text-[10px] font-bold uppercase text-muted-foreground">Google Search</span>
                </div>
                <p className="text-sm text-[#1a0dab] hover:underline cursor-pointer font-medium truncate">{tags.title || "Page Title"}</p>
                <p className="text-xs text-[#006621] truncate mb-1">{tags.url || "https://example.com"}</p>
                <p className="text-xs text-[#4d5156] line-clamp-2 leading-relaxed">
                  {tags.description || "The description will appear here as a snippet in search results..."}
                </p>
              </Card>

              {/* Facebook/OG Preview */}
              <Card className="border-border/40 bg-[#f0f2f5] dark:bg-card/40 rounded-xl overflow-hidden max-w-[500px]">
                <div className="aspect-[1.91/1] bg-muted/20 relative overflow-hidden">
                  {tags.image ? (
                    <img src={tags.image} alt="OG Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/30 gap-2">
                      <ImageIcon className="w-8 h-8" />
                      <span className="text-[10px] font-bold">OG Image Missing</span>
                    </div>
                  )}
                </div>
                <div className="p-4 bg-white dark:bg-card/20 space-y-1 border-t border-border/10">
                  <p className="text-[10px] uppercase text-muted-foreground tracking-wider truncate">
                    {tags.url ? new URL(tags.url).hostname : "EXAMPLE.COM"}
                  </p>
                  <p className="text-sm font-bold text-foreground line-clamp-1">{tags.title || "Page Title"}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">{tags.description || "Description snippet..."}</p>
                </div>
              </Card>
            </div>
          </div>

          {/* Code Output */}
          <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col">
            <div className="px-8 py-6 border-b border-border/40 bg-primary/5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <FileCode className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-primary">HTML Header Tags</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyToClipboard}
                className={cn(
                  "rounded-xl font-bold px-4 hover:bg-primary/10 transition-all",
                  copied && "text-green-500 hover:text-green-500"
                )}
              >
                {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied ? "Copied" : "Copy Tags"}
              </Button>
            </div>
            <CardContent className="p-0 flex-1 relative bg-primary/[0.01]">
              <pre className="p-8 font-mono text-[10px] leading-relaxed overflow-auto whitespace-pre text-foreground/80 selection:bg-primary/20">
                {generateMeta()}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
