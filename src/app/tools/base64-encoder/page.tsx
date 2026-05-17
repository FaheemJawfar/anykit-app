"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Check } from "lucide-react";

export default function Base64Encoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const encode = () => {
    try {
      const encoded = btoa(input);
      setOutput(encoded);
    } catch (e) {
      setOutput("Error: " + (e as Error).message);
    }
  };

  const decode = () => {
    try {
      const decoded = atob(input);
      setOutput(decoded);
    } catch (e) {
      setOutput("Error: Invalid Base64 string");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Base64 Encoder/Decoder</h1>
        <p className="text-muted-foreground">Encode and decode Base64 strings</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Input</CardTitle>
            <CardDescription>Enter text to encode or Base64 to decode</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Enter your text or Base64 string..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[300px] font-mono text-sm"
            />
            <div className="flex gap-2 mt-4">
              <Button onClick={encode}>Encode</Button>
              <Button onClick={decode} variant="outline">
                Decode
              </Button>
              <Button onClick={() => setInput("")} variant="ghost">
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Output</CardTitle>
            <CardDescription>Result</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              readOnly
              value={output}
              className="min-h-[300px] font-mono text-sm"
            />
            <div className="flex gap-2 mt-4">
              <Button onClick={copyToClipboard} variant="outline" size="sm">
                {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                Copy
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
