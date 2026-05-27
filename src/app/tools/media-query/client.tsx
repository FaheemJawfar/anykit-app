"use client";

import { ToolLayout } from "@/components/tool-layout";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Monitor, 
  Copy, 
  Check, 
  Zap,
  Smartphone,
  Tablet,
  Laptop,
  Tv,
  Code,
  Eye,
  Info,
  Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";

const BREAKPOINTS = [
  { name: "Mobile Portrait", width: 320, icon: Smartphone },
  { name: "Mobile Landscape", width: 480, icon: Smartphone },
  { name: "Tablet Portrait", width: 768, icon: Tablet },
  { name: "Tablet Landscape", width: 1024, icon: Tablet },
  { name: "Laptop", width: 1280, icon: Laptop },
  { name: "Desktop", width: 1440, icon: Monitor },
  { name: "Wide Desktop", width: 1920, icon: Tv },
];

export default function MediaQueryGenerator() {
  const [customWidth, setCustomWidth] = useState("");
  const [selected, setSelected] = useState<number[]>([768, 1024, 1280]);
  const [includeComments, setIncludeComments] = useState(true);
  const [mobileFirst, setMobileFirst] = useState(true);
  const [copied, setCopied] = useState(false);

  const toggleBreakpoint = (w: number) => {
    setSelected(prev => prev.includes(w) ? prev.filter(x => x !== w) : [...prev, w].sort((a, b) => a - b));
  };

  const generateCSS = () => {
    const widths = customWidth ? [...selected, parseInt(customWidth)].sort((a, b) => a - b) : selected;
    if (widths.length === 0) return "/* Select at least one breakpoint */";

    let css = "";
    widths.forEach(w => {
      if (includeComments) {
        const bp = BREAKPOINTS.find(b => b.width === w);
        css += `/* ${bp ? bp.name : `Custom (${w}px)`} */\n`;
      }
      if (mobileFirst) {
        css += `@media (min-width: ${w}px) {\n  /* Your styles here */\n}\n\n`;
      } else {
        css += `@media (max-width: ${w}px) {\n  /* Your styles here */\n}\n\n`;
      }
    });
    return css.trim();
  };

  const copyCSS = () => {
    navigator.clipboard.writeText(generateCSS());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout toolId="media-query">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Config Side */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Breakpoints</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelected([])} className="h-8 text-[10px] font-bold uppercase text-destructive">
                Clear All
              </Button>
            </div>
            <CardContent className="p-6 space-y-4">
              {BREAKPOINTS.map((bp) => {
                const isActive = selected.includes(bp.width);
                const Icon = bp.icon;
                return (
                  <button
                    key={bp.name}
                    onClick={() => toggleBreakpoint(bp.width)}
                    className={cn(
                      "w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left",
                      isActive 
                        ? "bg-primary/5 border-primary/20 shadow-sm" 
                        : "bg-muted/10 border-border/10 hover:bg-muted/20"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                      isActive ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-muted/30 text-muted-foreground"
                    )}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className={cn("font-bold text-sm", isActive ? "text-foreground" : "text-muted-foreground")}>{bp.name}</p>
                      <p className="text-[10px] font-bold uppercase text-muted-foreground/60 tracking-wider">{bp.width}px</p>
                    </div>
                    {isActive && <Check className="w-5 h-5 text-primary" />}
                  </button>
                );
              })}
              
              <div className="pt-4 border-t border-border/10 space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Custom Width (px)</Label>
                <Input 
                  type="number"
                  value={customWidth}
                  onChange={(e) => setCustomWidth(e.target.value)}
                  placeholder="e.g. 1600"
                  className="h-12 rounded-xl bg-muted/30 border-border/40 font-mono text-sm"
                />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-border/10">
              <div className="flex items-center gap-3">
                <Code className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-bold">Include Comments</span>
              </div>
              <Switch checked={includeComments} onCheckedChange={setIncludeComments} />
            </div>
            <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-border/10">
              <div className="flex items-center gap-3">
                <Eye className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-bold">Mobile First (min-width)</span>
              </div>
              <Switch checked={mobileFirst} onCheckedChange={setMobileFirst} />
            </div>
          </div>
        </div>

        {/* Output Side */}
        <div className="lg:col-span-7">
          <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col min-h-[500px]">
            <div className="px-8 py-6 border-b border-border/40 bg-primary/5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <Code className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-primary">Generated CSS</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyCSS}
                className={cn(
                  "rounded-xl font-bold px-4 hover:bg-primary/10 transition-all",
                  copied && "text-green-500 hover:text-green-500"
                )}
              >
                {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied ? "Copied" : "Copy CSS"}
              </Button>
            </div>
            <CardContent className="p-0 flex-1">
              <pre className="w-full h-full p-8 font-mono text-xs leading-loose overflow-auto whitespace-pre text-foreground/80 bg-primary/[0.01]">
                {generateCSS()}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
