"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { 
  Box, 
  Copy, 
  Check, 
  Trash2,
  FileCode,
  Zap,
  Info,
  Terminal,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import composerize from "composerize";

export default function DockerComposeConverter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const convert = (val: string) => {
    setInput(val);
    setError(null);
    if (!val.trim()) {
      setOutput("");
      return;
    }

    try {
      // Basic cleanup for multiple lines or extra spaces
      const cleanCommand = val.replace(/\\\n/g, ' ').replace(/\s+/g, ' ').trim();
      const result = composerize(cleanCommand);
      if (result) {
        setOutput(result);
      } else {
        throw new Error("Could not convert command. Please ensure it is a valid 'docker run' command.");
      }
    } catch (e: any) {
      setError(e.message || "Invalid docker run command");
      setOutput("");
    }
  };

  const copyToClipboard = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clear = () => {
    setInput("");
    setOutput("");
    setError(null);
  };

  const exampleCommand = "docker run -p 80:80 -v /var/run/docker.sock:/var/run/docker.sock --name nginx -d nginx";

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
          <Box className="w-6 h-6" />
        </div>
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight">Docker Run to Compose</h1>
          <p className="text-sm text-muted-foreground">
            Convert your 'docker run' commands into professional 'docker-compose.yml' files.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* Input Panel */}
        <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col min-h-[500px]">
          <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <Terminal className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Docker Run Command</span>
            </div>
            <Button variant="ghost" size="icon" onClick={clear} className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          <CardContent className="p-0 flex-1 relative">
            <Textarea
              placeholder={`Paste your docker run command here...\n\nExample:\n${exampleCommand}`}
              value={input}
              onChange={(e) => convert(e.target.value)}
              className="w-full h-full min-h-[400px] p-8 bg-transparent border-none focus-visible:ring-0 resize-none font-mono text-sm leading-relaxed"
            />
          </CardContent>
        </Card>

        {/* Output Panel */}
        <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col min-h-[500px] relative">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden lg:block">
            <div className="w-12 h-12 rounded-full bg-background border-border/40 flex items-center justify-center text-muted-foreground shadow-xl">
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>

          <div className="px-8 py-6 border-b border-border/40 bg-primary/5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <FileCode className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Docker Compose YAML</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyToClipboard}
              disabled={!output}
              className={cn(
                "rounded-xl font-bold px-4 hover:bg-primary/10 transition-all",
                copied && "text-green-500 hover:text-green-500"
              )}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy YAML
                </>
              )}
            </Button>
          </div>
          <CardContent className="p-0 flex-1">
            {error ? (
              <div className="p-8 h-full bg-destructive/5 text-destructive font-mono text-sm space-y-4">
                <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-[10px]">
                  <Info className="w-3 h-3" />
                  Conversion Error
                </div>
                <div className="bg-destructive/10 p-4 rounded-xl border border-destructive/20 whitespace-pre-wrap">
                  {error}
                </div>
              </div>
            ) : (
              <pre className="w-full h-full min-h-[400px] p-8 bg-primary/[0.02] font-mono text-sm leading-relaxed overflow-auto">
                {output || <span className="text-muted-foreground italic">Output will appear here...</span>}
              </pre>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-primary">Why Compose?</h3>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Docker Compose files are much easier to maintain, version control, and share than long 'docker run' commands.
          </p>
        </div>
        
        <div className="md:col-span-2 p-6 rounded-3xl bg-muted/30 border border-border/40 space-y-3">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-muted-foreground" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Supported Features</h3>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            This tool supports environment variables, port mapping, volume mounting, networks, restart policies, and most common 'docker run' flags.
          </p>
        </div>
      </div>
    </div>
  );
}
