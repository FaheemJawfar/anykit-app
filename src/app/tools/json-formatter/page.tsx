"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Check, Download } from "lucide-react";

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const formatJson = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
    } catch (e) {
      setOutput("Invalid JSON: " + (e as Error).message);
    }
  };

  const minifyJson = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
    } catch (e) {
      setOutput("Invalid JSON: " + (e as Error).message);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadJson = () => {
    const blob = new Blob([output], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "formatted.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">JSON Formatter</h1>
        <p className="text-muted-foreground">Format and beautify JSON data</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Input</CardTitle>
            <CardDescription>Paste your JSON here</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder='{"key": "value"}'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[400px] font-mono text-sm"
            />
            <div className="flex gap-2 mt-4">
              <Button onClick={formatJson} variant="default">
                Format
              </Button>
              <Button onClick={minifyJson} variant="outline">
                Minify
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
            <CardDescription>Formatted JSON result</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              readOnly
              value={output}
              className="min-h-[400px] font-mono text-sm"
            />
            <div className="flex gap-2 mt-4">
              <Button onClick={copyToClipboard} variant="outline" size="sm">
                {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied ? "Copied!" : "Copy"}
              </Button>
              <Button onClick={downloadJson} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
