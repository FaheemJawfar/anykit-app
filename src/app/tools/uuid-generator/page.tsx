"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Check, RefreshCw } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export default function UuidGenerator() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const generateUUID = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  const generateUUIDs = (count: number) => {
    const newUuids = [];
    for (let i = 0; i < count; i++) {
      newUuids.push(generateUUID());
    }
    setUuids(newUuids);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(uuids.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">UUID Generator</h1>
        <p className="text-muted-foreground">Generate random UUIDs</p>
      </div>

      <div className="max-w-2xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Generate UUIDs</CardTitle>
            <CardDescription>Choose how many UUIDs to generate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => generateUUIDs(1)}>Generate 1</Button>
              <Button onClick={() => generateUUIDs(5)} variant="outline">
                Generate 5
              </Button>
              <Button onClick={() => generateUUIDs(10)} variant="outline">
                Generate 10
              </Button>
              <Button onClick={() => generateUUIDs(20)} variant="outline">
                Generate 20
              </Button>
              <Button onClick={() => generateUUIDs(50)} variant="outline">
                Generate 50
              </Button>
            </div>
          </CardContent>
        </Card>

        {uuids.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Generated UUIDs</CardTitle>
              <CardDescription>{uuids.length} UUID(s) generated</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Button onClick={copyAll} variant="outline" size="sm">
                  {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                  Copy All
                </Button>
                <Button onClick={() => generateUUIDs(uuids.length)} variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Regenerate
                </Button>
                <Button onClick={() => setUuids([])} variant="outline" size="sm">
                  Clear
                </Button>
              </div>
              <Textarea
                readOnly
                value={uuids.join("\n")}
                className="min-h-[200px] font-mono text-sm"
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
