"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { 
  Copy, 
  Check, 
  RefreshCw, 
  Shield, 
  ShieldCheck, 
  ShieldAlert,
  Settings2,
  Lock
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function PasswordGenerator() {
  const [length, setLength] = useState(20);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const generatePassword = useCallback(() => {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    let chars = "";
    if (includeUppercase) chars += uppercase;
    if (includeLowercase) chars += lowercase;
    if (includeNumbers) chars += numbers;
    if (includeSymbols) chars += symbols;

    if (chars === "") {
      setPassword("");
      return;
    }

    let result = "";
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);
    
    for (let i = 0; i < length; i++) {
      result += chars.charAt(array[i] % chars.length);
    }
    setPassword(result);
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols]);

  const copyToClipboard = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  const getStrength = () => {
    if (length < 8) return { label: "Very Weak", color: "text-red-500", icon: ShieldAlert, width: "20%" };
    if (length < 12) return { label: "Weak", color: "text-orange-500", icon: ShieldAlert, width: "40%" };
    
    let varietyCount = 0;
    if (includeUppercase) varietyCount++;
    if (includeLowercase) varietyCount++;
    if (includeNumbers) varietyCount++;
    if (includeSymbols) varietyCount++;

    if (length < 16 || varietyCount < 3) return { label: "Moderate", color: "text-yellow-500", icon: Shield, width: "60%" };
    if (length < 24 || varietyCount < 4) return { label: "Strong", color: "text-green-500", icon: ShieldCheck, width: "85%" };
    return { label: "Unbreakable", color: "text-indigo-500", icon: ShieldCheck, width: "100%" };
  };

  const strength = getStrength();

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
          <Lock className="w-6 h-6" />
        </div>
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight">Password Generator</h1>
          <p className="text-sm text-muted-foreground">
            Create secure, random passwords instantly.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        <div className="lg:col-span-3 space-y-6">
          <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/50 backdrop-blur-sm rounded-3xl overflow-hidden">
            <CardContent className="p-8 space-y-8">
              <div className="relative group">
                <Input
                  readOnly
                  value={password || "Select options below"}
                  className={cn(
                    "h-20 text-2xl font-mono text-center tracking-wider bg-muted/30 border-2 border-dashed transition-all",
                    password ? "border-primary/20" : "border-muted text-muted-foreground"
                  )}
                />
                {password && (
                  <div className="absolute inset-y-0 right-3 flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="rounded-xl hover:bg-background transition-colors"
                      onClick={generatePassword}
                    >
                      <RefreshCw className="w-5 h-5 text-muted-foreground" />
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between gap-4">
                <Button 
                  onClick={copyToClipboard} 
                  disabled={!password}
                  className={cn(
                    "flex-1 h-14 rounded-2xl text-lg font-bold transition-all shadow-lg",
                    copied ? "bg-green-500 hover:bg-green-600 shadow-green-500/20" : "bg-primary hover:bg-primary/90 shadow-primary/20"
                  )}
                >
                  {copied ? (
                    <span className="flex items-center gap-2">
                      <Check className="w-5 h-5" /> Copied!
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Copy className="w-5 h-5" /> Copy Password
                    </span>
                  )}
                </Button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <strength.icon className={cn("w-5 h-5", strength.color)} />
                    <span className={cn("text-sm font-bold uppercase tracking-wider", strength.color)}>
                      {strength.label}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">Security Score</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div 
                    className={cn("h-full transition-all duration-500 ease-out bg-current", strength.color)}
                    style={{ width: strength.width }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            {[16, 24, 32, 64].map((v) => (
              <Button
                key={v}
                variant="outline"
                className={cn(
                  "h-12 rounded-xl border-border/50 font-mono transition-all",
                  length === v ? "bg-primary/10 text-primary border-primary/20" : "hover:bg-muted"
                )}
                onClick={() => setLength(v)}
              >
                {v} chars
              </Button>
            ))}
          </div>
        </div>

        <Card className="lg:col-span-2 border-border/40 shadow-xl shadow-primary/5 bg-card/30 backdrop-blur-xl rounded-3xl">
          <CardContent className="p-8 space-y-8">
            <div className="flex items-center gap-3">
              <Settings2 className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-lg">Configuration</h3>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label htmlFor="length" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Length</Label>
                  <span className="text-2xl font-mono font-bold text-primary">{length}</span>
                </div>
                <Slider
                  id="length"
                  min={4}
                  max={128}
                  step={1}
                  value={[length]}
                  onValueChange={(value) => setLength(value[0])}
                  className="py-4"
                />
              </div>

              <div className="space-y-3 pt-2">
                {[
                  { id: "uppercase", checked: includeUppercase, set: setIncludeUppercase, label: "Uppercase", sub: "A-Z" },
                  { id: "lowercase", checked: includeLowercase, set: setIncludeLowercase, label: "Lowercase", sub: "a-z" },
                  { id: "numbers", checked: includeNumbers, set: setIncludeNumbers, label: "Numbers", sub: "0-9" },
                  { id: "symbols", checked: includeSymbols, set: setIncludeSymbols, label: "Symbols", sub: "!@#$" },
                ].map((opt) => (
                  <div 
                    key={opt.id}
                    className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-transparent hover:border-border/50 transition-colors cursor-pointer group"
                    onClick={() => opt.set(!opt.checked)}
                  >
                    <div className="flex flex-col">
                      <Label className="font-bold pointer-events-none">{opt.label}</Label>
                      <span className="text-[10px] text-muted-foreground font-mono uppercase">{opt.sub}</span>
                    </div>
                    <Checkbox
                      id={opt.id}
                      checked={opt.checked}
                      onCheckedChange={(checked) => opt.set(checked === true)}
                      className="rounded-lg h-6 w-6"
                    />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-primary/5 rounded-3xl p-8 border border-primary/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <h4 className="font-bold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" /> 
              Client-Side Only
            </h4>
            <p className="text-sm text-muted-foreground">Passwords are generated in your browser and never sent to our servers.</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-bold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" /> 
              Secure Randomness
            </h4>
            <p className="text-sm text-muted-foreground">Uses the window.crypto API for cryptographically strong random values.</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-bold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" /> 
              Privacy First
            </h4>
            <p className="text-sm text-muted-foreground">No tracking, no analytics, no cookies. Your data stays on your machine.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

