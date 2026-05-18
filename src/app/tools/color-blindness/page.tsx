"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { 
  Eye, 
  Copy, 
  Check, 
  Trash2,
  Zap,
  Info,
  Maximize2,
  Palette,
  Settings2,
  FileUp,
  Image as ImageIcon,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";

const BLINDNESS_TYPES = [
  { id: "normal", name: "Normal Vision", filter: "none" },
  { id: "protanopia", name: "Protanopia", filter: "grayscale(0) contrast(1) brightness(1) sepia(0.3) hue-rotate(-30deg) saturate(1.5)", desc: "Red-blind (1% of males)" },
  { id: "deuteranopia", name: "Deuteranopia", filter: "grayscale(0) contrast(1) brightness(1) sepia(0.3) hue-rotate(-50deg) saturate(1.5)", desc: "Green-blind (1% of males)" },
  { id: "tritanopia", name: "Tritanopia", filter: "grayscale(0) contrast(1) brightness(1) sepia(0.3) hue-rotate(150deg) saturate(1.5)", desc: "Blue-blind (<1% of males)" },
  { id: "achromatopsia", name: "Achromatopsia", filter: "grayscale(1)", desc: "Total color blindness (rare)" }
];

export default function ColorBlindnessSimulator() {
  const [image, setImage] = useState<string | null>(null);
  const [activeType, setActiveType] = useState(BLINDNESS_TYPES[0]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
          <Eye className="w-6 h-6" />
        </div>
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight">Color Blindness Simulator</h1>
          <p className="text-sm text-muted-foreground">
            Simulate how your images or colors appear to users with different types of color blindness.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sidebar Controls */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 space-y-8">
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <Settings2 className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Vision Type</span>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {BLINDNESS_TYPES.map((type) => (
                    <Button
                      key={type.id}
                      variant={activeType.id === type.id ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setActiveType(type)}
                      className={cn(
                        "justify-start h-14 rounded-xl px-6 transition-all",
                        activeType.id === type.id && "shadow-lg shadow-primary/20"
                      )}
                    >
                      <div className="flex flex-col items-start text-left">
                        <span className="font-bold text-xs uppercase tracking-wider">{type.name}</span>
                        <span className={cn("text-[9px] font-medium", activeType.id === type.id ? "text-primary-foreground/70" : "text-muted-foreground")}>{type.desc}</span>
                      </div>
                    </Button>
                  ))}
                </div>

                <div className="pt-6 border-t border-border/40 space-y-4">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Upload Image</Label>
                  <Button 
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="w-full h-12 rounded-xl border-border/40 hover:bg-primary/5 hover:text-primary transition-all font-bold"
                  >
                    <FileUp className="w-4 h-4 mr-2" />
                    Select Image
                  </Button>
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-primary">Accessibility Fact</h3>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed italic">
              Approximately 1 in 12 men and 1 in 200 women have some form of color vision deficiency. Designing with these simulators ensures your UI is usable for everyone.
            </p>
          </div>
        </div>

        {/* Main Canvas */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[3rem] overflow-hidden flex flex-col relative aspect-video bg-muted/20 group">
            <div className="absolute top-8 left-8 z-10">
              <div className="px-4 py-2 rounded-full bg-primary/90 text-primary-foreground text-[10px] font-black uppercase tracking-widest shadow-xl backdrop-blur-md">
                Viewing as: {activeType.name}
              </div>
            </div>

            <CardContent className="flex-1 flex items-center justify-center p-12 overflow-hidden">
              {image ? (
                <img 
                  src={image} 
                  alt="Simulator" 
                  style={{ filter: activeType.filter }}
                  className="max-w-full max-h-full rounded-2xl shadow-2xl transition-all duration-700"
                />
              ) : (
                <div className="flex flex-col items-center gap-6 opacity-30 text-center max-w-sm">
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <ImageIcon className="w-12 h-12" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">No Image Uploaded</h3>
                    <p className="text-sm font-medium">Upload an image or use the default vision test patterns to see the simulation.</p>
                  </div>
                </div>
              )}
            </CardContent>

            {/* Default color strips for reference if no image */}
            {!image && (
              <div className="p-8 bg-muted/30 border-t border-border/40 grid grid-cols-6 gap-2">
                {["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff"].map((color) => (
                  <div 
                    key={color} 
                    style={{ backgroundColor: color, filter: activeType.filter }} 
                    className="aspect-square rounded-xl shadow-inner transition-all duration-700" 
                  />
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
