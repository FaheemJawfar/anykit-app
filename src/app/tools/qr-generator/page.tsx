"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { QRCodeSVG } from "qrcode.react";
import { Download } from "lucide-react";

export default function QrGenerator() {
  const [text, setText] = useState("");
  const [size, setSize] = useState([256]);
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");

  const downloadQrCode = () => {
    const svg = document.querySelector("svg") as SVGSVGElement;
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = size[0];
      canvas.height = size[0];
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngFile;
      downloadLink.download = "qrcode.png";
      downloadLink.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">QR Code Generator</h1>
        <p className="text-muted-foreground">Generate QR codes from text</p>
      </div>

      <div className="max-w-2xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Generate QR Code</CardTitle>
            <CardDescription>Enter text or URL to generate QR code</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="text">Text or URL</Label>
              <Input
                id="text"
                placeholder="https://example.com"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="size">Size: {size[0]}px</Label>
              <Slider
                id="size"
                min={128}
                max={512}
                step={32}
                value={size}
                onValueChange={setSize}
                className="mt-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fgColor">Foreground Color</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="fgColor"
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-16 h-10"
                  />
                  <Input
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="bgColor">Background Color</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="bgColor"
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-16 h-10"
                  />
                  <Input
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {text && (
          <Card>
            <CardHeader>
              <CardTitle>QR Code</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-white rounded-lg">
                  <QRCodeSVG
                    value={text}
                    size={size[0]}
                    fgColor={fgColor}
                    bgColor={bgColor}
                  />
                </div>
                <Button onClick={downloadQrCode} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download PNG
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
