"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  Clock,
  QrCode,
  Eye,
  EyeOff,
  User,
  Building
} from "lucide-react";
import { cn } from "@/lib/utils";
import * as OTPAuth from "otpauth";

export default function OTPGenerator() {
  const [secret, setSecret] = useState("JBSWY3DPEHPK3PXP");
  const [showSecret, setShowSecret] = useState(false);
  const [issuer, setIssuer] = useState("AnyKit");
  const [label, setLabel] = useState("user@example.com");
  const [token, setToken] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);
  const [copied, setCopied] = useState(false);

  const generateToken = () => {
    try {
      const totp = new OTPAuth.TOTP({
        issuer: issuer,
        label: label,
        algorithm: "SHA1",
        digits: 6,
        period: 30,
        secret: OTPAuth.Secret.fromBase32(secret.replace(/\s/g, ""))
      });
      setToken(totp.generate());
    } catch (e) {
      setToken("Invalid Secret");
    }
  };

  useEffect(() => {
    generateToken();
    const interval = setInterval(() => {
      const seconds = 30 - (Math.floor(Date.now() / 1000) % 30);
      setTimeLeft(seconds);
      if (seconds === 30 || seconds === 0) {
        generateToken();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [secret, issuer, label]);

  const copyToClipboard = () => {
    if (!token || token === "Invalid Secret") return;
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
          <Clock className="w-6 h-6" />
        </div>
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight">OTP Generator (TOTP)</h1>
          <p className="text-sm text-muted-foreground">
            Generate 2FA codes for services like Google, GitHub, and more.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Editor Side */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 space-y-6">
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <Key className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Account Config</span>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold">Secret Key (Base32)</Label>
                  <div className="relative">
                    <Input 
                      type={showSecret ? "text" : "password"}
                      value={secret}
                      onChange={(e) => setSecret(e.target.value.toUpperCase())}
                      placeholder="e.g. JBSW Y3DP EHPK 3PXP"
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold">Issuer</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        value={issuer}
                        onChange={(e) => setIssuer(e.target.value)}
                        placeholder="Google, GitHub..."
                        className="h-12 pl-10 rounded-xl bg-muted/30 border-border/40"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold">Label / Email</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        value={label}
                        onChange={(e) => setLabel(e.target.value)}
                        placeholder="user@example.com"
                        className="h-12 pl-10 rounded-xl bg-muted/30 border-border/40"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-border/40 flex justify-end">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => { setSecret(""); setToken(""); }}
                  className="h-9 rounded-xl font-bold text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear Secret
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-primary">Compatibility</h3>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              This tool implements the <strong>RFC 6238</strong> (TOTP) algorithm, which is the same standard used by Google Authenticator, Microsoft Authenticator, and Authy.
            </p>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-7 h-full">
          <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col h-full min-h-[400px]">
            <div className="px-8 py-6 border-b border-border/40 bg-primary/5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-primary">Authentication Code</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full">
                <RefreshCw className={cn("w-3 h-3 text-primary", timeLeft <= 5 && "animate-spin")} />
                <span className="text-[10px] font-bold text-primary">{timeLeft}s remaining</span>
              </div>
            </div>
            <CardContent className="p-0 flex-1 relative bg-primary/[0.01] flex flex-col items-center justify-center space-y-8">
              <div className="space-y-2 text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Current Token</p>
                <div 
                  onClick={copyToClipboard}
                  className={cn(
                    "text-7xl md:text-8xl font-black tracking-tighter cursor-pointer transition-all hover:scale-105 active:scale-95",
                    token === "Invalid Secret" ? "text-destructive text-3xl" : "text-foreground"
                  )}
                >
                  {token}
                </div>
              </div>

              <div className="w-full max-w-[200px] h-2 bg-muted/50 rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "h-full transition-all duration-1000 linear",
                    timeLeft > 10 ? "bg-primary" : timeLeft > 5 ? "bg-orange-500" : "bg-destructive"
                  )}
                  style={{ width: `${(timeLeft / 30) * 100}%` }}
                />
              </div>

              <Button
                onClick={copyToClipboard}
                disabled={!token || token === "Invalid Secret"}
                className={cn(
                  "rounded-2xl h-14 px-10 font-bold text-lg shadow-lg shadow-primary/20 transition-all",
                  copied ? "bg-green-500 hover:bg-green-600" : "bg-primary hover:bg-primary/90"
                )}
              >
                {copied ? <Check className="w-5 h-5 mr-2" /> : <Copy className="w-5 h-5 mr-2" />}
                {copied ? "Token Copied!" : "Copy Token"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
