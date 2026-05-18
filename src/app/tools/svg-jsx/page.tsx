"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileCode, 
  Copy, 
  Check, 
  Trash2,
  Zap,
  Info,
  RefreshCw,
  Code2,
  Settings2,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function SVGToJSX() {
  const [input, setInput] = useState('<svg width="100" height="100" viewBox="0 0 100 100">\n  <circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />\n</svg>');
  const [output, setOutput] = useState("");
  const [componentName, setInterfaceName] = useState("Icon");
  const [copied, setCopied] = useState(false);

  const convertToJSX = (svg: string, name: string) => {
    if (!svg.trim()) return "";
    
    let result = svg
      .replace(/class=/g, 'className=')
      .replace(/for=/g, 'htmlFor=')
      .replace(/xlink:href=/g, 'xlinkHref=')
      .replace(/stroke-width=/g, 'strokeWidth=')
      .replace(/stroke-linecap=/g, 'strokeLinecap=')
      .replace(/stroke-linejoin=/g, 'strokeLinejoin=')
      .replace(/stroke-miterlimit=/g, 'strokeMiterlimit=')
      .replace(/stroke-dasharray=/g, 'strokeDasharray=')
      .replace(/stroke-dashoffset=/g, 'strokeDashoffset=')
      .replace(/stroke-opacity=/g, 'strokeOpacity=')
      .replace(/fill-opacity=/g, 'fillOpacity=')
      .replace(/fill-rule=/g, 'fillRule=')
      .replace(/clip-rule=/g, 'clipRule=')
      .replace(/stop-color=/g, 'stopColor=')
      .replace(/stop-opacity=/g, 'stopOpacity=')
      .replace(/font-family=/g, 'fontFamily=')
      .replace(/font-size=/g, 'fontSize=')
      .replace(/font-weight=/g, 'fontWeight=')
      .replace(/text-anchor=/g, 'textAnchor=')
      .replace(/dominant-baseline=/g, 'dominantBaseline=')
      .replace(/clip-path=/g, 'clipPath=')
      .replace(/gradient-units=/g, 'gradientUnits=')
      .replace(/gradient-transform=/g, 'gradientTransform=');

    return `export const ${name} = (props: React.SVGProps<SVGSVGElement>) => (\n  ${result.trim().split('\n').join('\n  ')}\n);`;
  };

  useMemo(() => {
    setOutput(convertToJSX(input, componentName || "Icon"));
  }, [input, componentName]);

  const copyToClipboard = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
          <Code2 className="w-6 h-6" />
        </div>
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight">SVG to JSX Converter</h1>
          <p className="text-sm text-muted-foreground">
            Convert raw SVG code into a clean, typed React/JSX component.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch h-[calc(100vh-300px)] min-h-[500px]">
        {/* Editor Side */}
        <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col">
          <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <Code2 className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Source SVG</span>
            </div>
            <div className="flex items-center gap-4">
              <input 
                value={componentName}
                onChange={(e) => setInterfaceName(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))}
                placeholder="Component Name"
                className="bg-background/50 border border-border/40 rounded-lg px-3 py-1 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary/20 w-32"
              />
              <Button variant="ghost" size="icon" onClick={() => setInput("")} className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <CardContent className="p-0 flex-1 relative">
            <Textarea
              placeholder="Paste <svg> code here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-full p-8 bg-transparent border-none focus-visible:ring-0 resize-none font-mono text-xs leading-relaxed"
            />
          </CardContent>
        </Card>

        {/* Output Side */}
        <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col relative">
          <div className="px-8 py-6 border-b border-border/40 bg-primary/5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-primary">JSX Component</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyToClipboard}
              disabled={!output}
              className={cn(
                "rounded-xl font-bold px-4 hover:bg-primary/10 transition-all",
                copied && "text-green-500 hover:text-green-500"
              )}
            >
              {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
              {copied ? "Copied" : "Copy Code"}
            </Button>
          </div>
          
          <CardContent className="p-0 flex-1 relative bg-primary/[0.01]">
            <pre className="w-full h-full p-8 font-mono text-xs leading-relaxed overflow-auto whitespace-pre text-foreground/80 selection:bg-primary/20">
              {output || <span className="text-muted-foreground italic opacity-50">JSX code will appear here...</span>}
            </pre>
          </CardContent>
        </Card>
      </div>

      <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-4">
        <div className="flex items-center gap-2">
          <Settings2 className="w-4 h-4 text-primary" />
          <h3 className="font-bold text-xs uppercase tracking-wider text-primary">Rules Applied</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary/40" /> kebab-case to camelCase</div>
          <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary/40" /> Typed React components</div>
          <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary/40" /> Reserved keyword escaping</div>
          <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary/40" /> Functional components</div>
        </div>
      </div>
    </div>
  );
}
