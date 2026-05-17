"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Copy, Check } from "lucide-react";

export default function ColorConverter() {
  const [hex, setHex] = useState("#000000");
  const [rgb, setRgb] = useState({ r: 0, g: 0, b: 0 });
  const [hsl, setHsl] = useState({ h: 0, s: 0, l: 0 });
  const [copied, setCopied] = useState(false);

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + [r, g, b].map((x) => {
      const hex = x.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    }).join("");
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  };

  const hslToRgb = (h: number, s: number, l: number) => {
    h /= 360;
    s /= 100;
    l /= 100;
    let r: number, g: number, b: number;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    };
  };

  useEffect(() => {
    const rgbFromHex = hexToRgb(hex);
    if (rgbFromHex) {
      setRgb(rgbFromHex);
      setHsl(rgbToHsl(rgbFromHex.r, rgbFromHex.g, rgbFromHex.b));
    }
  }, [hex]);

  const handleRgbChange = (channel: "r" | "g" | "b", value: string) => {
    const numValue = parseInt(value) || 0;
    const newRgb = { ...rgb, [channel]: Math.min(255, Math.max(0, numValue)) };
    setRgb(newRgb);
    setHex(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
    setHsl(rgbToHsl(newRgb.r, newRgb.g, newRgb.b));
  };

  const handleHslChange = (channel: "h" | "s" | "l", value: string) => {
    const numValue = parseInt(value) || 0;
    const max = channel === "h" ? 360 : 100;
    const newHsl = { ...hsl, [channel]: Math.min(max, Math.max(0, numValue)) };
    setHsl(newHsl);
    const rgbFromHsl = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
    setRgb(rgbFromHsl);
    setHex(rgbToHex(rgbFromHsl.r, rgbFromHsl.g, rgbFromHsl.b));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Color Converter</h1>
        <p className="text-muted-foreground">Convert between HEX, RGB, and HSL color formats</p>
      </div>

      <div className="max-w-2xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Color Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="w-full h-32 rounded-lg border"
              style={{ backgroundColor: hex }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>HEX</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                value={hex}
                onChange={(e) => setHex(e.target.value)}
                className="font-mono"
              />
              <Button
                onClick={() => copyToClipboard(hex)}
                variant="outline"
                size="icon"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>RGB</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="r">R (Red)</Label>
                <Input
                  id="r"
                  type="number"
                  min={0}
                  max={255}
                  value={rgb.r}
                  onChange={(e) => handleRgbChange("r", e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="g">G (Green)</Label>
                <Input
                  id="g"
                  type="number"
                  min={0}
                  max={255}
                  value={rgb.g}
                  onChange={(e) => handleRgbChange("g", e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="b">B (Blue)</Label>
                <Input
                  id="b"
                  type="number"
                  min={0}
                  max={255}
                  value={rgb.b}
                  onChange={(e) => handleRgbChange("b", e.target.value)}
                  className="mt-2"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Input
                readOnly
                value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`}
                className="font-mono"
              />
              <Button
                onClick={() => copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)}
                variant="outline"
                size="icon"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>HSL</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="h">H (Hue)</Label>
                <Input
                  id="h"
                  type="number"
                  min={0}
                  max={360}
                  value={hsl.h}
                  onChange={(e) => handleHslChange("h", e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="s">S (Saturation)</Label>
                <Input
                  id="s"
                  type="number"
                  min={0}
                  max={100}
                  value={hsl.s}
                  onChange={(e) => handleHslChange("s", e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="l">L (Lightness)</Label>
                <Input
                  id="l"
                  type="number"
                  min={0}
                  max={100}
                  value={hsl.l}
                  onChange={(e) => handleHslChange("l", e.target.value)}
                  className="mt-2"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Input
                readOnly
                value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`}
                className="font-mono"
              />
              <Button
                onClick={() => copyToClipboard(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`)}
                variant="outline"
                size="icon"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
