"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  ShieldCheck, 
  Copy, 
  Check, 
  Trash2,
  Lock,
  Unlock,
  Zap,
  Info,
  ShieldAlert,
  Fingerprint,
  RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";
import bcrypt from "bcryptjs";

export default function BcryptHash() {
  const [input, setInput] = useState("");
  const [rounds, setRounds] = useState(10);
  const [hash, setHash] = useState("");
  const [compareHash, setCompareHash] = useState("");
  const [isMatch, setIsMatch] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateHash = () => {
    if (!input) return;
    setLoading(true);
    // Use setTimeout to allow UI to update (loading state)
    setTimeout(() => {
      try {
        const salt = bcrypt.genSaltSync(rounds);
        const result = bcrypt.hashSync(input, salt);
        setHash(result);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }, 100);
  };

  const verifyHash = () => {
    if (!input || !compareHash) return;
    try {
      const match = bcrypt.compareSync(input, compareHash);
      setIsMatch(match);
    } catch (e) {
      setIsMatch(false);
    }
  };

  const copyToClipboard = () => {
    if (!hash) return;
    navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight">Bcrypt Hash / Verify</h1>
          <p className="text-sm text-muted-foreground">
            Securely hash and verify passwords using the Bcrypt hashing algorithm.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input and Hash Generation */}
        <div className="lg:col-span-6 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center gap-3">
              <Lock className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Generator</span>
            </div>
            <CardContent className="p-8 space-y-8">
              <div className="space-y-4">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Plaintext / Password</Label>
                <Input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter text to hash..."
                  className="h-14 px-6 rounded-2xl bg-muted/30 border-border/40 font-mono text-lg focus:ring-primary/20"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Salting Rounds (Cost)</Label>
                  <span className="text-xs font-mono font-bold text-primary">{rounds}</span>
                </div>
                <input 
                  type="range" 
                  min="4" 
                  max="15" 
                  value={rounds} 
                  onChange={(e) => setRounds(parseInt(e.target.value))}
                  className="w-full h-2 bg-muted/50 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <p className="text-[10px] text-muted-foreground italic">Higher rounds = more secure but slower.</p>
              </div>

              <Button 
                onClick={generateHash}
                disabled={!input || loading}
                className="w-full h-14 rounded-2xl text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
              >
                {loading ? <RefreshCw className="w-5 h-5 mr-2 animate-spin" /> : <Zap className="w-5 h-5 mr-2" />}
                {loading ? "Generating..." : "Generate Bcrypt Hash"}
              </Button>

              {hash && (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Result Hash</span>
                    <Button variant="ghost" size="sm" onClick={copyToClipboard} className="h-8 rounded-xl font-bold">
                      {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                      {copied ? "Copied" : "Copy"}
                    </Button>
                  </div>
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 font-mono text-xs break-all leading-relaxed text-primary">
                    {hash}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-4">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-primary">Why Bcrypt?</h3>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Bcrypt is a slow hashing algorithm designed specifically for passwords. Its adaptive nature (salting rounds) makes it resistant to brute-force and rainbow table attacks.
            </p>
          </div>
        </div>

        {/* Right Column: Verification */}
        <div className="lg:col-span-6 space-y-6">
          <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Verifier</span>
            </div>
            <CardContent className="p-8 space-y-8">
              <div className="space-y-4">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Hash to Compare</Label>
                <Textarea 
                  value={compareHash}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                    setCompareHash(e.target.value);
                    setIsMatch(null);
                  }}
                  placeholder="Paste the bcrypt hash here..."
                  className="h-[100px] p-4 rounded-xl bg-muted/30 border-border/40 font-mono text-sm focus-visible:ring-0 resize-none"
                />
              </div>

              <Button 
                onClick={verifyHash}
                disabled={!input || !compareHash}
                variant="outline"
                className="w-full h-14 rounded-2xl text-lg font-bold border-border/40 hover:bg-primary/5 hover:text-primary transition-all active:scale-[0.98]"
              >
                <Unlock className="w-5 h-5 mr-2" />
                Check for Match
              </Button>

              {isMatch !== null && (
                <div className={cn(
                  "p-8 rounded-3xl border-2 flex flex-col items-center justify-center text-center space-y-4 animate-in zoom-in-95 duration-300",
                  isMatch ? "bg-green-500/10 border-green-500/30 text-green-600" : "bg-destructive/10 border-destructive/30 text-destructive"
                )}>
                  {isMatch ? (
                    <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                      <ShieldCheck className="w-8 h-8" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center">
                      <ShieldAlert className="w-8 h-8" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-bold">{isMatch ? "Passwords Match!" : "No Match Found"}</h3>
                    <p className="text-xs opacity-80 mt-1">
                      {isMatch ? "The plaintext matches the provided hash." : "The plaintext does NOT match the provided hash."}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
