"use client";

import { ToolLayout } from "@/components/tool-layout";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { 
  Shield, 
  Copy, 
  Check, 
  Trash2,
  Fingerprint,
  Zap,
  Info,
  Lock,
  RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";
import CryptoJS from "crypto-js";

export default function HashText() {
  const [input, setInput] = useState("");
  const [hashes, setHashes] = useState({
    md5: "",
    sha1: "",
    sha256: "",
    sha512: "",
    sha224: "",
    sha384: ""
  });
  const [copied, setCopied] = useState<string | null>(null);

  const calculateHashes = (val: string) => {
    setInput(val);
    if (!val) {
      setHashes({
        md5: "",
        sha1: "",
        sha256: "",
        sha512: "",
        sha224: "",
        sha384: ""
      });
      return;
    }

    setHashes({
      md5: CryptoJS.MD5(val).toString(),
      sha1: CryptoJS.SHA1(val).toString(),
      sha256: CryptoJS.SHA256(val).toString(),
      sha512: CryptoJS.SHA512(val).toString(),
      sha224: CryptoJS.SHA224(val).toString(),
      sha384: CryptoJS.SHA384(val).toString()
    });
  };

  const copy = (val: string, id: string) => {
    navigator.clipboard.writeText(val);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const clear = () => {
    setInput("");
    calculateHashes("");
  };

  const HashResult = ({ label, value, id }: { label: string, value: string, id: string }) => (
    <div className="space-y-2 group">
      <div className="flex justify-between items-center px-1">
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</span>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => copy(value, id)}
          disabled={!value}
          className="h-6 px-2 text-[10px] font-bold uppercase tracking-wider hover:bg-primary/10"
        >
          {copied === id ? <Check className="w-3 h-3 mr-1 text-green-500" /> : <Copy className="w-3 h-3 mr-1" />}
          {copied === id ? "Copied" : "Copy"}
        </Button>
      </div>
      <div className={cn(
        "p-4 rounded-2xl border font-mono text-xs break-all transition-all",
        value ? "bg-muted/30 border-border/40 text-foreground" : "bg-muted/10 border-dashed border-border/20 text-muted-foreground italic"
      )}>
        {value || "Waiting for input..."}
      </div>
    </div>
  );

  return (
    <ToolLayout toolId="hash-text">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Panel */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Lock className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Source Text</span>
              </div>
              <Button variant="ghost" size="icon" onClick={clear} className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <CardContent className="p-0">
              <Textarea
                placeholder="Type or paste text to hash..."
                value={input}
                onChange={(e) => calculateHashes(e.target.value)}
                className="w-full h-[300px] p-8 bg-transparent border-none focus-visible:ring-0 resize-none font-mono text-sm leading-relaxed"
              />
              <div className="p-4 bg-primary/5 border-t border-border/40 flex justify-between items-center">
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest px-3 py-1 bg-primary/10 rounded-full">
                  Real-time Generation
                </span>
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                  <RefreshCw className="w-3 h-3 animate-spin-slow" />
                  Processing Locally
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-4">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-primary">Security Note</h3>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              All hashing is performed locally in your browser. Your text is never sent to any server. MD5 and SHA-1 are included for legacy purposes but are considered cryptographically broken.
            </p>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-7 h-full">
          <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <div className="px-8 py-6 border-b border-border/40 bg-primary/5 flex items-center gap-3">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Generated Hashes</span>
            </div>
            <CardContent className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <HashResult label="SHA-256" value={hashes.sha256} id="sha256" />
                <HashResult label="MD5" value={hashes.md5} id="md5" />
              </div>
              <HashResult label="SHA-512" value={hashes.sha512} id="sha512" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <HashResult label="SHA-1" value={hashes.sha1} id="sha1" />
                <HashResult label="SHA-224" value={hashes.sha224} id="sha224" />
              </div>
              <HashResult label="SHA-384" value={hashes.sha384} id="sha384" />
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
