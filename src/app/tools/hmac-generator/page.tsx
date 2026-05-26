"use client";

import { ToolLayout } from "@/components/tool-layout";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ShieldCheck, 
  Copy, 
  Check, 
  Trash2,
  Key,
  Zap,
  Lock,
  RefreshCw,
  Fingerprint,
  Info,
  Eye,
  EyeOff
} from "lucide-react";
import { cn } from "@/lib/utils";
import CryptoJS from "crypto-js";

export default function HMACGenerator() {
  const [message, setMessage] = useState("");
  const [secret, setSecret] = useState("");
  const [showSecret, setShowSecret] = useState(false);
  const [algorithm, setAlgorithm] = useState("SHA256");
  const [hmac, setHmac] = useState("");
  const [copied, setCopied] = useState(false);

  const algorithms = ["MD5", "SHA1", "SHA256", "SHA512", "SHA224", "SHA384"];

  const generateHMAC = (msg: string, sec: string, algo: string) => {
    setMessage(msg);
    setSecret(sec);
    if (!msg || !sec) {
      setHmac("");
      return;
    }

    try {
      let result;
      switch (algo) {
        case "MD5": result = CryptoJS.HmacMD5(msg, sec); break;
        case "SHA1": result = CryptoJS.HmacSHA1(msg, sec); break;
        case "SHA256": result = CryptoJS.HmacSHA256(msg, sec); break;
        case "SHA512": result = CryptoJS.HmacSHA512(msg, sec); break;
        case "SHA224": result = CryptoJS.HmacSHA224(msg, sec); break;
        case "SHA384": result = CryptoJS.HmacSHA384(msg, sec); break;
        default: result = CryptoJS.HmacSHA256(msg, sec);
      }
      setHmac(result.toString());
    } catch (e) {
      console.error(e);
      setHmac("");
    }
  };

  const copyToClipboard = () => {
    if (!hmac) return;
    navigator.clipboard.writeText(hmac);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clear = () => {
    setMessage("");
    setSecret("");
    setHmac("");
  };

  return (
    <ToolLayout toolId="hmac-generator">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Configuration Panel */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 space-y-8">
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <Key className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Configuration</span>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-bold">Secret Key</Label>
                  <div className="relative">
                    <Input 
                      type={showSecret ? "text" : "password"}
                      value={secret}
                      onChange={(e) => generateHMAC(message, e.target.value, algorithm)}
                      placeholder="Enter HMAC secret..."
                      className="h-12 px-6 pr-12 rounded-xl bg-muted/30 border-border/40 font-mono"
                    />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setShowSecret(!showSecret)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg text-muted-foreground"
                    >
                      {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-bold">Algorithm</Label>
                  <div className="grid grid-cols-3 gap-2 p-1 bg-muted/50 rounded-xl border border-border/40">
                    {algorithms.map((algo) => (
                      <Button
                        key={algo}
                        variant={algorithm === algo ? "default" : "ghost"}
                        size="sm"
                        onClick={() => {
                          setAlgorithm(algo);
                          generateHMAC(message, secret, algo);
                        }}
                        className={cn(
                          "rounded-lg text-[10px] font-bold h-9",
                          algorithm === algo && "shadow-md"
                        )}
                      >
                        {algo}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-border/40">
                  <Label className="text-sm font-bold">Message</Label>
                  <Textarea 
                    value={message}
                    onChange={(e) => generateHMAC(e.target.value, secret, algorithm)}
                    placeholder="Type or paste the message to authenticate..."
                    className="h-32 rounded-xl bg-muted/30 border-border/40 resize-none font-mono text-sm"
                  />
                </div>
              </div>

              <Button 
                variant="ghost"
                onClick={clear}
                className="w-full h-12 rounded-xl font-bold text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            </CardContent>
          </Card>

          <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-4">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-primary">Security Note</h3>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              HMAC provides a way to verify both the <strong>integrity</strong> and the <strong>authenticity</strong> of a message by using a shared secret. All calculations happen locally in your browser.
            </p>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-7 h-full">
          <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col h-full min-h-[400px]">
            <div className="px-8 py-6 border-b border-border/40 bg-primary/5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-primary">Generated HMAC</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyToClipboard}
                disabled={!hmac}
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
              <div className="p-8 font-mono text-lg leading-relaxed break-all whitespace-pre-wrap h-full flex items-center justify-center text-center">
                {hmac ? (
                  <span className="text-primary font-bold shadow-sm">{hmac}</span>
                ) : (
                  <span className="text-muted-foreground italic opacity-50">
                    Enter a secret and message to generate the authentication code.
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
