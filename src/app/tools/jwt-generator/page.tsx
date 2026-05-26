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
  EyeOff,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SignJWT } from "jose";

export default function JWTGenerator() {
  const [payload, setPayload] = useState('{\n  "sub": "1234567890",\n  "name": "AnyKit App User",\n  "admin": true,\n  "iat": 1516239022\n}');
  const [secret, setSecret] = useState("your-256-bit-secret");
  const [showSecret, setShowSecret] = useState(false);
  const [token, setToken] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const generateJWT = async () => {
    setError(null);
    if (!payload.trim() || !secret.trim()) return;

    try {
      const data = JSON.parse(payload);
      const encodedSecret = new TextEncoder().encode(secret);
      
      const jwt = await new SignJWT(data)
        .setProtectedHeader({ alg: 'HS256' })
        .sign(encodedSecret);
      
      setToken(jwt);
    } catch (e: any) {
      setError(e.message || "Failed to generate JWT. Ensure payload is valid JSON.");
    }
  };

  const copyToClipboard = () => {
    if (!token) return;
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout toolId="jwt-generator">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Editor Side */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 space-y-6">
              <div className="space-y-4">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Payload (JSON)</Label>
                <Textarea 
                  value={payload}
                  onChange={(e) => setPayload(e.target.value)}
                  placeholder="Paste JSON payload here..."
                  className="h-48 rounded-xl bg-muted/30 border-border/40 font-mono text-sm resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Secret Key (HS256)</Label>
                <div className="relative">
                  <Input 
                    type={showSecret ? "text" : "password"}
                    value={secret}
                    onChange={(e) => setSecret(e.target.value)}
                    placeholder="Enter signing secret..."
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

              <Button 
                onClick={generateJWT}
                className="w-full h-14 rounded-2xl text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Generate Token
              </Button>

              {error && (
                <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-7 h-full">
          <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col min-h-[400px]">
            <div className="px-8 py-6 border-b border-border/40 bg-primary/5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-primary">Signed Token</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyToClipboard}
                disabled={!token}
                className={cn(
                  "rounded-xl font-bold px-4 hover:bg-primary/10 transition-all",
                  copied && "text-green-500 hover:text-green-500"
                )}
              >
                {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied ? "Copied" : "Copy Token"}
              </Button>
            </div>
            <CardContent className="p-12 flex-1 relative bg-primary/[0.01] flex flex-col items-center justify-center">
              {token ? (
                <div className="w-full p-8 rounded-3xl bg-background border border-border/40 shadow-inner group transition-all hover:border-primary/20 break-all text-center font-mono text-sm leading-relaxed text-primary">
                  {token}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center py-20 text-center opacity-30 gap-4">
                  <Lock className="w-16 h-16" />
                  <p className="italic font-medium">Click generate to create your JWT...</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
