"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Upload, Download, Image as ImageIcon } from "lucide-react";

export default function ImageResize() {
  const [image, setImage] = useState<string | null>(null);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [maintainAspect, setMaintainAspect] = useState(true);
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setOriginalDimensions({ width: img.width, height: img.height });
          setWidth(String(img.width));
          setHeight(String(img.height));
          setImage(event.target?.result as string);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResize = () => {
    if (!image) return;

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const newWidth = parseInt(width) || img.width;
      const newHeight = parseInt(height) || img.height;

      canvas.width = newWidth;
      canvas.height = newHeight;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0, newWidth, newHeight);
        const resizedImage = canvas.toDataURL("image/png");
        setImage(resizedImage);
      }
    };
    img.src = image;
  };

  const handleDownload = () => {
    if (!image) return;
    const link = document.createElement("a");
    link.href = image;
    link.download = "resized-image.png";
    link.click();
  };

  const handleWidthChange = (value: string) => {
    setWidth(value);
    if (maintainAspect && originalDimensions.width > 0) {
      const aspectRatio = originalDimensions.height / originalDimensions.width;
      const newHeight = Math.round(parseInt(value) * aspectRatio);
      setHeight(String(newHeight));
    }
  };

  const handleHeightChange = (value: string) => {
    setHeight(value);
    if (maintainAspect && originalDimensions.height > 0) {
      const aspectRatio = originalDimensions.width / originalDimensions.height;
      const newWidth = Math.round(parseInt(value) * aspectRatio);
      setWidth(String(newWidth));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Image Resize</h1>
        <p className="text-muted-foreground">Resize images in your browser</p>
      </div>

      <div className="max-w-3xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Upload Image</CardTitle>
            <CardDescription>Select an image to resize</CardDescription>
          </CardHeader>
          <CardContent>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button onClick={() => fileInputRef.current?.click()} className="w-full">
              <Upload className="w-4 h-4 mr-2" />
              Choose Image
            </Button>
          </CardContent>
        </Card>

        {image && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Resize Options</CardTitle>
                <CardDescription>
                  Original: {originalDimensions.width}x{originalDimensions.height}px
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="width">Width (px)</Label>
                    <Input
                      id="width"
                      type="number"
                      value={width}
                      onChange={(e) => handleWidthChange(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="height">Height (px)</Label>
                    <Input
                      id="height"
                      type="number"
                      value={height}
                      onChange={(e) => handleHeightChange(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="aspect"
                    checked={maintainAspect}
                    onChange={(e) => setMaintainAspect(e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="aspect">Maintain aspect ratio</Label>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleResize} className="flex-1">
                    Resize
                  </Button>
                  <Button onClick={handleDownload} variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-4 bg-muted">
                  <img
                    src={image}
                    alt="Preview"
                    className="max-w-full h-auto mx-auto"
                    style={{ maxWidth: "100%" }}
                  />
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
