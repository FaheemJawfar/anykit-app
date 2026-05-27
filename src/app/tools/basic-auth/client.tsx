"use client";

import { ToolLayout } from "@/components/tool-layout";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Lock, 
  Copy, 
  Check, 
  Trash2,
  Key,
  Zap,
  Info,
  User,
  ShieldCheck,
  Eye,
  EyeOff
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function BasicAuthGenerator() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [header, setHeader] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!username.trim() && !password.trim()) {
      setHeader("");
      return;
    }
    const token = btoa(`${username}:${password}`);
    setHeader(`Authorization: Basic ${token}`);
  }, [username, password]);

  const copyToClipboard = () => {
    if (!header) return;
    navigator.clipboard.writeText(header);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clear = () => {
    setUsername("");
    setPassword("");
  };

  return (
    <ToolLayout toolId="basic-auth">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Panel */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 space-y-8">
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <Key className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Credentials</span>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Username</Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="e.g. admin"
                      className="h-14 pl-12 pr-6 rounded-2xl bg-muted/30 border-border/40 font-mono text-lg focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="e.g. secret123"
                      className="h-14 pl-12 pr-12 rounded-2xl bg-muted/30 border-border/40 font-mono text-lg focus:ring-primary/20"
                    />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl text-muted-foreground hover:text-primary"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </Button>
                  </div>
                </div>
              </div>

              <Button 
                onClick={clear}
                variant="ghost"
                className="w-full h-12 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 font-bold"
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
            <p className="text-[11px] text-muted-foreground leading-relaxed italic">
              Basic Authentication transmits credentials as a Base64-encoded string. It is <strong>not</strong> encrypted and should only be used over HTTPS.
            </p>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-7 h-full">
          <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col h-full min-h-[400px]">
            <div className="px-8 py-6 border-b border-border/40 bg-primary/5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-primary">Generated Header</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyToClipboard}
                disabled={!header}
                className={cn(
                  "rounded-xl font-bold px-4 hover:bg-primary/10 transition-all",
                  copied && "text-green-500 hover:text-green-500"
                )}
              >
                {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied ? "Copied" : "Copy Header"}
              </Button>
            </div>
            <CardContent className="p-8 flex-1 flex flex-col items-center justify-center bg-primary/[0.01]">
              <div className="w-full space-y-8">
                <div className={cn(
                  "w-full p-8 rounded-3xl border font-mono text-xl transition-all break-all text-center leading-relaxed",
                  header ? "bg-primary/5 border-primary/20 text-primary font-bold shadow-inner" : "bg-muted/10 border-dashed border-border/20 text-muted-foreground italic"
                )}>
                  {header || "Authorization: Basic ..."}
                </div>

                {header && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 space-y-4">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-primary" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Example Usage (Curl)</span>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/50 border border-border/40 font-mono text-[11px] leading-relaxed break-all">
                      curl -H "{header}" https://api.example.com
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
