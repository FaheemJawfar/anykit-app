"use client";

import { ToolLayout } from "@/components/tool-layout";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  FileText, 
  Search, 
  Copy, 
  Check, 
  Zap,
  Info,
  ExternalLink,
  Filter,
  FileCode,
  FileImage,
  FileAudio,
  FileVideo,
  Globe
} from "lucide-react";
import { cn } from "@/lib/utils";
import mime from "mime-types";

// Common MIME types for quick access if mime-types list is too long to display all
const COMMON_MIMES = [
  "application/json", "application/pdf", "application/zip", "application/xml",
  "image/jpeg", "image/png", "image/gif", "image/svg+xml",
  "text/html", "text/css", "text/javascript", "text/plain", "text/csv",
  "audio/mpeg", "audio/wav", "video/mp4", "video/webm"
];

export default function MIMETypes() {
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  // We can't easily iterate all mime types from the library, so we provide a search and a list of common ones
  const getInfo = (query: string) => {
    if (!query) return null;
    const isExt = query.startsWith('.') || !query.includes('/');
    const ext = isExt ? (query.startsWith('.') ? query.slice(1) : query) : mime.extension(query);
    const type = isExt ? mime.lookup(query) : query;
    
    if (!type && !ext) return null;
    
    return {
      type: type || "Unknown",
      extension: ext ? `.${ext}` : "Unknown",
      isCommon: COMMON_MIMES.includes(type as string)
    };
  };

  const searchResult = getInfo(search);

  const copy = (val: string, id: string) => {
    navigator.clipboard.writeText(val);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const getIcon = (type: string) => {
    if (type.startsWith('image/')) return FileImage;
    if (type.startsWith('audio/')) return FileAudio;
    if (type.startsWith('video/')) return FileVideo;
    if (type.startsWith('text/')) return FileText;
    if (type.includes('javascript') || type.includes('json') || type.includes('xml')) return FileCode;
    return Globe;
  };

  return (
    <ToolLayout toolId="mime-types">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Search Panel */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 space-y-6">
              <div className="space-y-4">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Search Database</Label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="e.g. .png or application/json"
                    className="h-14 pl-12 pr-6 rounded-2xl bg-muted/30 border-border/40 font-bold focus:ring-primary/20"
                  />
                </div>
                <p className="text-[10px] text-muted-foreground italic px-1">
                  Try searching with an extension (like <strong>.jpg</strong>) or a MIME type (like <strong>text/html</strong>).
                </p>
              </div>

              {searchResult && (
                <div className="pt-6 border-t border-border/40 space-y-6 animate-in fade-in slide-in-from-top-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                      {(() => {
                        const Icon = getIcon(searchResult.type as string);
                        return <Icon className="w-6 h-6" />;
                      })()}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg leading-none mb-1">{searchResult.extension}</h3>
                      <p className="text-xs text-muted-foreground font-mono">{searchResult.type}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => copy(searchResult.type as string, 'type')}
                      className="rounded-xl h-10 text-[10px] font-bold uppercase tracking-wider border-border/40"
                    >
                      {copied === 'type' ? <Check className="w-3.5 h-3.5 mr-2 text-green-500" /> : <Copy className="w-3.5 h-3.5 mr-2" />}
                      Copy Type
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => copy(searchResult.extension as string, 'ext')}
                      className="rounded-xl h-10 text-[10px] font-bold uppercase tracking-wider border-border/40"
                    >
                      {copied === 'ext' ? <Check className="w-3.5 h-3.5 mr-2 text-green-500" /> : <Copy className="w-3.5 h-3.5 mr-2" />}
                      Copy Ext
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-primary">Pro Tip</h3>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              MIME types (Multipurpose Internet Mail Extensions) tell the browser how to handle files. They are crucial for setting the <code>Content-Type</code> header in APIs.
            </p>
          </div>
        </div>

        {/* Common Types Grid */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Common MIME Types</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {COMMON_MIMES.map((type) => {
              const ext = mime.extension(type);
              const Icon = getIcon(type);
              return (
                <div 
                  key={type}
                  onClick={() => setSearch(type)}
                  className={cn(
                    "group p-4 rounded-2xl bg-card border transition-all cursor-pointer flex items-center justify-between",
                    search === type ? "border-primary bg-primary/5 shadow-lg shadow-primary/5" : "border-border/40 hover:border-primary/20 hover:bg-muted/30"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                      search === type ? "bg-primary text-white" : "bg-primary/5 text-primary group-hover:bg-primary/10"
                    )}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-black font-mono">.{ext}</p>
                      <p className="text-[10px] text-muted-foreground font-medium truncate max-w-[150px]">{type}</p>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-muted-foreground/30 group-hover:text-primary transition-colors" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
