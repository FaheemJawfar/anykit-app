"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Check } from "lucide-react";

export default function CaseConverter() {
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);

  const convertCase = (type: string) => {
    switch (type) {
      case "uppercase":
        return input.toUpperCase();
      case "lowercase":
        return input.toLowerCase();
      case "title":
        return input
          .toLowerCase()
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
      case "sentence":
        return input
          .toLowerCase()
          .split(". ")
          .map((sentence) => sentence.charAt(0).toUpperCase() + sentence.slice(1))
          .join(". ");
      case "camel":
        return input
          .toLowerCase()
          .split(/[\s_-]+/)
          .map((word, index) => 
            index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
          )
          .join("");
      case "pascal":
        return input
          .toLowerCase()
          .split(/[\s_-]+/)
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join("");
      case "snake":
        return input
          .toLowerCase()
          .split(/[\s-]+/)
          .join("_");
      case "kebab":
        return input
          .toLowerCase()
          .split(/[\s_]+/)
          .join("-");
      default:
        return input;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const conversions = [
    { label: "UPPERCASE", type: "uppercase" },
    { label: "lowercase", type: "lowercase" },
    { label: "Title Case", type: "title" },
    { label: "Sentence case", type: "sentence" },
    { label: "camelCase", type: "camel" },
    { label: "PascalCase", type: "pascal" },
    { label: "snake_case", type: "snake" },
    { label: "kebab-case", type: "kebab" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Case Converter</h1>
        <p className="text-muted-foreground">Convert text between different cases</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Input</CardTitle>
            <CardDescription>Enter text to convert</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Enter your text here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[200px]"
            />
            <Button
              onClick={() => setInput("")}
              variant="outline"
              className="mt-4"
            >
              Clear
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {conversions.map((conv) => (
            <Card key={conv.type}>
              <CardHeader>
                <CardTitle className="text-lg">{conv.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Textarea
                    readOnly
                    value={convertCase(conv.type)}
                    className="min-h-[60px] font-mono text-sm"
                  />
                  <Button
                    onClick={() => copyToClipboard(convertCase(conv.type))}
                    variant="outline"
                    size="icon"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
