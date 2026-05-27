"use client";

import { ToolLayout } from "@/components/tool-layout";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { 
  Palette, 
  Copy, 
  Check, 
  Trash2,
  Zap,
  Info,
  FileUp,
  Image as ImageIcon,
  RefreshCw,
  Download
} from "lucide-react";
import { cn } from "@/lib/utils";
import ColorThief from "colorthief";

export default function ColorPaletteExtractor() {
  const [image, setImage] = useState<string | null>(null);
  const [palette, setPalette] = useState<string[]>([]);
  const [dominant, setDominant] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const rgbToHex = (r: number, g: number, b: number) => 
    "#" + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLoading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        extractPalette();
      };
      reader.readAsDataURL(file);
    }
  };

  const extractPalette = () => {
    const img = imgRef.current;
    if (!img) return;

    if (img.complete) {
      processImage(img);
    } else {
      img.onload = () => processImage(img);
    }
  };

  const processImage = (img: HTMLImageElement) => {
    try {
      const colorThief = new ColorThief();
      const dominantRgb = colorThief.getColor(img);
      const paletteRgb = colorThief.getPalette(img, 8);

      setDominant(rgbToHex(dominantRgb[0], dominantRgb[1], dominantRgb[2]));
      setPalette(paletteRgb.map((rgb: number[]) => rgbToHex(rgb[0], rgb[1], rgb[2])));
      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  const copy = (val: string) => {
    navigator.clipboard.writeText(val);
    setCopied(val);
    setTimeout(() => setCopied(null), 2000);
  };

  const clear = () => {
    setImage(null);
    setPalette([]);
    setDominant(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <ToolLayout toolId="color-palette">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Upload Side */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 space-y-8">
              <div 
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files[0];
                  if (file) {
                    setLoading(true);
                    const reader = new FileReader();
                    reader.onloadend = () => setImage(reader.result as string);
                    reader.readAsDataURL(file);
                  }
                }}
                className={cn(
                  "relative group h-64 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center transition-all cursor-pointer",
                  image ? "border-primary bg-primary/5 shadow-inner" : "border-border/60 hover:border-primary/40 hover:bg-primary/5"
                )}
              >
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                
                {image ? (
                  <img 
                    ref={imgRef}
                    src={image} 
                    alt="Source" 
                    onLoad={() => extractPalette()}
                    className="w-full h-full object-cover rounded-3xl opacity-50 transition-opacity group-hover:opacity-30" 
                  />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                    <FileUp className="w-10 h-10" />
                  </div>
                )}
                
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 gap-2">
                  <h3 className="font-bold text-lg">{image ? "Change Image" : "Drop Image Here"}</h3>
                  <p className="text-sm text-muted-foreground">Click or drag an image to analyze</p>
                </div>
              </div>

              {image && (
                <Button 
                  variant="outline" 
                  onClick={clear}
                  className="w-full h-14 rounded-2xl border-border/40 text-destructive hover:bg-destructive/5 font-bold"
                >
                  <Trash2 className="w-5 h-5 mr-2" />
                  Clear and Reset
                </Button>
              )}
            </CardContent>
          </Card>

          <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-primary">Pro Tip</h3>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed italic">
              Extracted palettes are perfect for creating UI themes that match your branding or imagery. Click any color to copy its HEX code instantly.
            </p>
          </div>
        </div>

        {/* Results Side */}
        <div className="lg:col-span-7 space-y-8">
          {!image && !loading ? (
            <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-6 bg-muted/20 rounded-[2.5rem] border border-dashed border-border/40 min-h-[500px]">
              <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center">
                <ImageIcon className="w-10 h-10 text-muted-foreground/30" />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-lg">Waiting for Image</h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                  Upload an image to automatically generate a professional color palette.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              {/* Dominant Color */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Dominant Color</span>
                </div>
                <Card 
                  onClick={() => dominant && copy(dominant)}
                  className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden group cursor-pointer active:scale-[0.98] transition-all"
                >
                  <CardContent className="p-0 flex items-center">
                    <div 
                      style={{ backgroundColor: dominant || '#eee' }} 
                      className="w-32 h-32 shrink-0 transition-colors duration-700" 
                    />
                    <div className="flex-1 p-8 flex justify-between items-center">
                      <div>
                        <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1 tracking-widest">Hex Code</p>
                        <h3 className="text-3xl font-black font-mono tracking-tighter text-foreground">{dominant}</h3>
                      </div>
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                        copied === dominant ? "bg-green-500 text-white" : "bg-primary/5 text-primary group-hover:bg-primary/10"
                      )}>
                        {copied === dominant ? <Check className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Palette Grid */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Extracted Palette</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {palette.map((color, i) => (
                    <Card 
                      key={i} 
                      onClick={() => copy(color)}
                      className="group cursor-pointer border-border/40 bg-card/40 backdrop-blur-sm rounded-3xl overflow-hidden transition-all hover:border-primary/20 hover:shadow-xl active:scale-95"
                    >
                      <div style={{ backgroundColor: color }} className="h-24 w-full transition-colors duration-700" />
                      <CardContent className="p-4 flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold uppercase text-muted-foreground">{color}</span>
                        <div className={cn(
                          "w-6 h-6 rounded-lg flex items-center justify-center transition-all opacity-0 group-hover:opacity-100",
                          copied === color ? "bg-green-500 text-white" : "bg-muted text-muted-foreground"
                        )}>
                          {copied === color ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
