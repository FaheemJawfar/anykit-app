"use client";

import React, { useState, useRef } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Code,
  FileText,
  Copy,
  Trash2,
  Upload,
  Download,
  Check,
  AlertTriangle,
  Info,
  Eye,
  Eraser,
  Zap,
} from "lucide-react";

interface StripOptions {
  removeScripts: boolean;
  removeStyles: boolean;
  removeComments: boolean;
  preserveLineBreaks: boolean;
  decodeEntities: boolean;
  removeExtraSpaces: boolean;
}

export default function StripHtml() {
  const { toast } = useToast();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [stripOptions, setStripOptions] = useState<StripOptions>({
    removeScripts: true,
    removeStyles: true,
    removeComments: true,
    preserveLineBreaks: true,
    decodeEntities: true,
    removeExtraSpaces: true,
  });
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const stripHtmlTags = () => {
    if (!input.trim()) {
      toast("Please enter some HTML content", { type: "error", title: "Error" });
      return;
    }

    setIsLoading(true);

    try {
      const temp = document.createElement("div");
      temp.innerHTML = input;

      if (stripOptions.removeScripts) {
        const scripts = temp.querySelectorAll("script, noscript");
        scripts.forEach((el) => el.remove());
      }

      if (stripOptions.removeStyles) {
        const styles = temp.querySelectorAll("style");
        styles.forEach((el) => el.remove());
      }

      if (stripOptions.removeComments) {
        const walker = document.createTreeWalker(temp, NodeFilter.SHOW_COMMENT, null);
        const comments = [];
        let node;
        while ((node = walker.nextNode())) {
          comments.push(node);
        }
        comments.forEach((comment) => comment.parentNode?.removeChild(comment));
      }

      let stripped = temp.textContent || temp.innerText || "";

      stripped = stripped
        .replace(/\(function\(.*\)\{.*?\}\)/g, "")
        .replace(/window\.\w+\s*=\s*window\.\w+\|\|\[\].*?\);/g, "")
        .replace(/\.push\(function\(\)\{.*?\}\)/g, "");

      if (stripOptions.decodeEntities) {
        stripped = stripped
          .replace(/&nbsp;/g, " ")
          .replace(/&amp;/g, "&")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/&apos;/g, "'");
      }

      if (stripOptions.preserveLineBreaks) {
        if (stripOptions.removeExtraSpaces) {
          stripped = stripped
            .replace(/[^\S\n]+/g, " ")
            .replace(/\n+/g, "\n")
            .trim();
        }
      } else {
        if (stripOptions.removeExtraSpaces) {
          stripped = stripped.replace(/\s+/g, " ").trim();
        }
      }

      setOutput(stripped);
      toast(`Successfully stripped HTML. ${stripped.length} characters remaining.`, { type: "info", title: "Success" });
    } catch (err) {
      toast("Failed to process HTML. Please check your input.", { type: "error", title: "Error" });
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (content: string, type: string = "result") => {
    try {
      await navigator.clipboard.writeText(content);
      toast(`${type} copied to clipboard`, { type: "info", title: "Copied" });
    } catch (err) {
      toast("Failed to copy to clipboard", { type: "error", title: "Error" });
    }
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setFileName("");
    toast("All fields cleared", { type: "info", title: "Cleared" });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setInput(content);
        setFileName(file.name);
        toast("File uploaded successfully", { type: "success", title: "Uploaded" });
      };
      reader.readAsText(file);
    }
  };

  const downloadResult = () => {
    if (!output) {
      toast("No result to download", { type: "error", title: "Error" });
      return;
    }
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    let downloadName = "stripped-text.txt";
    if (fileName) {
      const nameParts = fileName.split(".");
      const baseName = nameParts.length > 1 ? nameParts.slice(0, -1).join(".") : fileName;
      downloadName = `stripped_${baseName}.txt`;
    }
    const link = document.createElement("a");
    link.href = url;
    link.download = downloadName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 100);
    toast("Result downloaded successfully", { type: "success", title: "Downloaded" });
  };

  const updateStripOption = (option: keyof StripOptions, value: boolean) => {
    setStripOptions((prev) => ({ ...prev, [option]: value }));
  };

  const presetConfigs = {
    basic: {
      removeScripts: true,
      removeStyles: true,
      removeComments: false,
      preserveLineBreaks: true,
      decodeEntities: true,
      removeExtraSpaces: true,
    },
    aggressive: {
      removeScripts: true,
      removeStyles: true,
      removeComments: true,
      preserveLineBreaks: false,
      decodeEntities: true,
      removeExtraSpaces: true,
    },
    minimal: {
      removeScripts: false,
      removeStyles: false,
      removeComments: false,
      preserveLineBreaks: true,
      decodeEntities: false,
      removeExtraSpaces: false,
    },
  };

  const applyPreset = (preset: keyof typeof presetConfigs) => {
    setStripOptions(presetConfigs[preset]);
    toast(`Applied ${preset} preset`, { type: "info", title: "Preset Applied" });
  };

  const exampleHtml = `<!DOCTYPE html>
<html>
<head>
    <title>Sample Page</title>
    <style>
        body { font-family: Arial; }
        .highlight { color: red; }
    </style>
    <script>
        console.log("Hello World");
    </script>
</head>
<body>
    <h1>Welcome to our website</h1>
    <p class="highlight">This is a <strong>sample</strong> paragraph with <em>formatting</em>.</p>
    <!-- This is a comment -->
    <div>
        <a href="https://example.com">Visit our site</a>
    </div>
    <script>
        alert("Another script");
    </script>
</body>
</html>`;

  const useExample = () => {
    setInput(exampleHtml);
    toast("Example HTML loaded", { type: "info", title: "Loaded" });
  };

  return (
    <ToolLayout toolId="html-tag-stripper">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-4 lg:order-last space-y-6">
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-xl bg-muted text-primary flex items-center justify-center border border-border">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-foreground tracking-tight leading-none mb-1">Actions</h2>
                <p className="text-[10px] font-medium text-foreground tracking-tight">Run tool</p>
              </div>
            </div>
            <div className="space-y-3">
              <Button
                onClick={stripHtmlTags}
                disabled={!input.trim() || isLoading}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest text-xs rounded-xl"
              >
                <Eraser className="w-5 h-5 mr-2" />
                {isLoading ? "Stripping..." : "Strip HTML"}
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={downloadResult}
                  disabled={!output}
                  variant="outline"
                  className="w-full h-11 bg-muted hover:bg-accent text-foreground border-border text-xs font-bold tracking-tight"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button
                  onClick={clearAll}
                  variant="outline"
                  className="w-full h-11 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100 text-xs font-bold tracking-tight"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">Options</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "removeScripts", label: "Scripts" },
                { id: "removeStyles", label: "Styles" },
                { id: "removeComments", label: "Comments" },
                { id: "preserveLineBreaks", label: "Line Breaks" },
                { id: "decodeEntities", label: "Decode" },
                { id: "removeExtraSpaces", label: "Remove Spaces" },
              ].map((option) => (
                <label
                  key={option.id}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-accent cursor-pointer transition-colors group border border-transparent hover:border-border"
                >
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight group-hover:text-primary transition-colors truncate mr-2">
                    {option.label}
                  </span>
                  <input
                    type="checkbox"
                    checked={stripOptions[option.id as keyof StripOptions]}
                    onChange={(e) => updateStripOption(option.id as keyof StripOptions, e.target.checked)}
                    className="w-3.5 h-3.5 rounded-md border-border text-primary focus:ring-primary/20 transition-all cursor-pointer flex-shrink-0"
                  />
                </label>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">Presets</h3>
            <div className="grid grid-cols-3 gap-2">
              {["basic", "aggressive", "minimal"].map((preset) => (
                <button
                  key={preset}
                  onClick={() => applyPreset(preset as keyof typeof presetConfigs)}
                  className="px-2 py-3 rounded-xl border text-xs font-bold tracking-tight transition-all bg-muted text-muted-foreground border-border hover:bg-accent hover:text-primary hover:border-border flex items-center justify-center shadow-sm"
                >
                  {preset.charAt(0).toUpperCase() + preset.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <div className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden">
              <div className="flex justify-between items-center p-6 border-b border-border bg-muted/60">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-muted text-primary flex items-center justify-center border border-border">
                    <Code className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-foreground tracking-tight leading-none mb-1">Your HTML</h2>
                    <p className="text-[10px] font-medium text-foreground tracking-tight">Paste your HTML code below</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".html,.htm,.txt"
                    className="hidden"
                  />
                  <Button onClick={useExample} variant="ghost" size="sm" className="h-9 px-4 text-xs font-bold tracking-tight text-primary hover:bg-accent">
                    Example
                  </Button>
                </div>
              </div>
              <div className="p-6">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Paste your HTML content here..."
                  className="w-full h-[500px] p-6 bg-muted/30 border border-border rounded-2xl font-mono text-sm resize-none focus:bg-card focus:border-primary outline-none transition-all placeholder:text-muted-foreground"
                />
                <div className="flex items-center justify-end gap-3 mt-4 px-2 text-[10px] font-bold text-muted-foreground tracking-tight">
                  <span>
                    Chars: <b className="text-primary font-mono tracking-normal">{input.length}</b>
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden">
              <div className="flex justify-between items-center p-6 border-b border-border bg-muted/60">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center border border-green-200">
                    <FileText className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-foreground tracking-tight leading-none mb-1">Plain Text</h2>
                    <p className="text-[10px] font-medium text-foreground tracking-tight">Result will appear here</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {output && (
                    <Button
                      onClick={() => copyToClipboard(output, "Result")}
                      variant="outline"
                      size="sm"
                      className="bg-card hover:bg-accent text-foreground border-border h-9 px-4 text-xs shadow-sm font-bold tracking-tight"
                    >
                      <Copy className="w-3.5 h-3.5 text-primary mr-2" />
                      Copy
                    </Button>
                  )}
                </div>
              </div>
              <div className="p-6">
                <textarea
                  value={output}
                  readOnly
                  placeholder="Stripped text will appear here..."
                  className="w-full h-[500px] p-6 bg-green-50/5 border border-border rounded-2xl font-mono text-sm resize-none outline-none transition-all placeholder:text-muted-foreground"
                />
                <div className="flex items-center justify-end gap-3 mt-4 px-2 text-[10px] font-bold text-foreground tracking-tight">
                  <span>
                    Remaining: <b className="text-green-600 font-mono tracking-normal">{output.length}</b>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
