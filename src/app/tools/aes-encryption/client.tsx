"use client";

import { ToolLayout } from "@/components/tool-layout";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Lock, 
  Unlock, 
  Copy, 
  Check, 
  Trash2,
  Key,
  Zap,
  ShieldAlert,
  ShieldCheck,
  Eye,
  EyeOff
} from "lucide-react";
import { cn } from "@/lib/utils";
import CryptoJS from "crypto-js";

export default function AESEncryption() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [passphrase, setPassphrase] = useState("");
  const [showPassphrase, setShowPassphrase] = useState(false);
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const process = (val: string, pass: string, currentMode: "encrypt" | "decrypt") => {
    setInput(val);
    setError(null);
    if (!val.trim() || !pass.trim()) {
      setOutput("");
      return;
    }

    try {
      if (currentMode === "encrypt") {
        const encrypted = CryptoJS.AES.encrypt(val, pass).toString();
        setOutput(encrypted);
      } else {
        const decrypted = CryptoJS.AES.decrypt(val, pass).toString(CryptoJS.enc.Utf8);
        if (!decrypted) throw new Error("Invalid passphrase or encrypted text");
        setOutput(decrypted);
      }
    } catch (e: any) {
      setError(e.message || "Decryption failed");
      setOutput("");
    }
  };

  const handleAction = (newMode: "encrypt" | "decrypt") => {
    setMode(newMode);
    process(input, passphrase, newMode);
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

  return (
    <ToolLayout toolId="aes-encryption">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Configuration and Input */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 space-y-8">
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <Key className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Configuration</span>
                </div>

                <div className="space-y-4">
                  <Label className="text-sm font-bold">Passphrase</Label>
                  <div className="relative">
                    <Input 
                      type={showPassphrase ? "text" : "password"}
                      placeholder="Secret key for encryption/decryption"
                      value={passphrase}
                      onChange={(e) => {
                        setPassphrase(e.target.value);
                        process(input, e.target.value, mode);
                      }}
                      className="h-14 px-6 rounded-2xl bg-muted/30 border-border/40 font-mono text-lg focus:ring-primary/20"
                    />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setShowPassphrase(!showPassphrase)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl text-muted-foreground hover:text-primary"
                    >
                      {showPassphrase ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 p-1 bg-muted/50 rounded-2xl border border-border/50">
                  <Button
                    variant={mode === "encrypt" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => handleAction("encrypt")}
                    className={cn(
                      "rounded-xl h-12 font-bold uppercase tracking-wider",
                      mode === "encrypt" && "shadow-lg shadow-primary/20"
                    )}
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Encrypt
                  </Button>
                  <Button
                    variant={mode === "decrypt" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => handleAction("decrypt")}
                    className={cn(
                      "rounded-xl h-12 font-bold uppercase tracking-wider",
                      mode === "decrypt" && "shadow-lg shadow-primary/20"
                    )}
                  >
                    <Unlock className="w-4 h-4 mr-2" />
                    Decrypt
                  </Button>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-border/40">
                <div className="flex justify-between items-center">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Input Text</Label>
                  <Button variant="ghost" size="icon" onClick={clear} className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <Textarea
                  placeholder={mode === "encrypt" ? "Enter text to encrypt..." : "Enter AES encrypted string..."}
                  value={input}
                  onChange={(e) => process(e.target.value, passphrase, mode)}
                  className="w-full h-[200px] p-6 bg-muted/20 border-border/40 rounded-2xl focus-visible:ring-0 resize-none font-mono text-sm leading-relaxed"
                />
              </div>
            </CardContent>
          </Card>

          <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-primary">Security Notice</h3>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Encryption is performed entirely on your device. Your data and passphrase are never sent to a server. Always use a strong, unique passphrase.
            </p>
          </div>
        </div>

        {/* Right Column: Output */}
        <div className="lg:col-span-7 h-full">
          <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col h-full min-h-[600px]">
            <div className="px-8 py-6 border-b border-border/40 bg-primary/5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                {mode === "encrypt" ? <ShieldAlert className="w-4 h-4 text-primary" /> : <ShieldCheck className="w-4 h-4 text-primary" />}
                <span className="text-xs font-bold uppercase tracking-widest text-primary">
                  {mode === "encrypt" ? "Encrypted Output" : "Decrypted Text"}
                </span>
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
                {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied ? "Copied" : "Copy Result"}
              </Button>
            </div>
            <CardContent className="p-0 flex-1 relative bg-primary/[0.01]">
              {error ? (
                <div className="p-8 h-full bg-destructive/5 text-destructive font-mono text-sm space-y-4">
                  <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-[10px]">
                    <ShieldAlert className="w-4 h-4" />
                    Process Error
                  </div>
                  <div className="bg-destructive/10 p-4 rounded-xl border border-destructive/20 whitespace-pre-wrap leading-relaxed">
                    {error}
                    <br />
                    <span className="text-[10px] opacity-60">Check if your passphrase is correct and the input is valid AES encrypted text.</span>
                  </div>
                </div>
              ) : (
                <div className="p-8 font-mono text-sm leading-relaxed break-all whitespace-pre-wrap h-full min-h-[500px]">
                  {output || <span className="text-muted-foreground italic">Processed result will appear here...</span>}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
