"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Type, 
  Copy, 
  Check, 
  Trash2,
  Zap,
  Info,
  ChevronDown,
  Monitor,
  Layout
} from "lucide-react";
import { cn } from "@/lib/utils";
import figlet from "figlet";

// Import all standard fonts for figlet
import standard from "figlet/importable-fonts/Standard.js";
import slant from "figlet/importable-fonts/Slant.js";
import shadow from "figlet/importable-fonts/Shadow.js";
import small from "figlet/importable-fonts/Small.js";
import script from "figlet/importable-fonts/Script.js";
import bubble from "figlet/importable-fonts/Bubble.js";
import block from "figlet/importable-fonts/Block.js";

const fonts = {
  Standard: standard,
  Slant: slant,
  Shadow: shadow,
  Small: small,
  Script: script,
  Bubble: bubble,
  Block: block
};

// Initialize figlet fonts
Object.entries(fonts).forEach(([name, data]) => {
  figlet.parseFont(name, data);
});

export default function ASCIITextDrawer() {
  const [input, setInput] = useState("AnyKit App");
  const [font, setFont] = useState<string>("Standard");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const draw = () => {
    if (!input) {
      setOutput("");
      return;
    }
    figlet.text(input, { font: font as any }, (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      setOutput(data || "");
    });
  };

  useEffect(() => {
    draw();
  }, [input, font]);

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
          <Layout className="w-6 h-6" />
        </div>
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight">ASCII Text Drawer</h1>
          <p className="text-sm text-muted-foreground">
            Generate artistic ASCII banners and text headers for your code or terminals.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input and Controls */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 space-y-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Your Text</Label>
                  <Input 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type something..."
                    className="h-14 px-6 rounded-2xl bg-muted/30 border-border/40 font-bold text-lg focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Art Style (Font)</Label>
                  <div className="relative group">
                    <select 
                      value={font}
                      onChange={(e) => setFont(e.target.value)}
                      className="w-full h-14 pl-6 pr-12 rounded-2xl bg-muted/30 border border-border/40 font-bold text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer transition-all hover:bg-muted/50"
                    >
                      {Object.keys(fonts).map((f) => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none group-hover:text-primary transition-colors" />
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => setInput("")}
                variant="ghost"
                className="w-full h-12 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 font-bold"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Text
              </Button>
            </CardContent>
          </Card>

          <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-4">
            <div className="flex items-center gap-2">
              <Monitor className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-primary">Terminal Tip</h3>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              ASCII art is perfect for adding a professional touch to your command-line tools, configuration file headers, or code comments.
            </p>
          </div>
        </div>

        {/* Right Column: Output */}
        <div className="lg:col-span-8 h-full">
          <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col h-full min-h-[500px]">
            <div className="px-8 py-6 border-b border-border/40 bg-primary/5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-primary">ASCII Art Preview</span>
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
                {copied ? "Copied" : "Copy Result"}
              </Button>
            </div>
            <CardContent className="p-8 flex-1 overflow-auto bg-primary/[0.01]">
              <pre className="font-mono text-[11px] sm:text-xs md:text-sm leading-none whitespace-pre text-foreground/90 selection:bg-primary/20">
                {output || <span className="text-muted-foreground italic">Your art will appear here...</span>}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
