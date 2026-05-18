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
  Zap,
  ShieldAlert,
  Info,
  Lock,
  Eye,
  EyeOff,
  Clock,
  History,
  AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";
import zxcvbn from "zxcvbn";

export default function PasswordStrengthAnalyzer() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!password) {
      setResult(null);
      return;
    }
    setResult(zxcvbn(password));
  }, [password]);

  const getScoreColor = (score: number) => {
    switch (score) {
      case 0: return "bg-destructive";
      case 1: return "bg-orange-500";
      case 2: return "bg-yellow-500";
      case 3: return "bg-blue-500";
      case 4: return "bg-green-500";
      default: return "bg-muted";
    }
  };

  const getScoreLabel = (score: number) => {
    switch (score) {
      case 0: return "Very Weak";
      case 1: return "Weak";
      case 2: return "Fair";
      case 3: return "Strong";
      case 4: return "Very Strong";
      default: return "";
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight">Password Strength Analyzer</h1>
          <p className="text-sm text-muted-foreground">
            Deep analysis of password complexity and estimated crack time.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Section */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 space-y-6">
              <div className="space-y-4">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Test Password</Label>
                <div className="relative">
                  <Input 
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password to analyze..."
                    className="h-16 px-6 pr-14 rounded-2xl bg-muted/30 border-border/40 font-mono text-xl focus:ring-primary/20"
                  />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl text-muted-foreground hover:text-primary h-10 w-10"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </Button>
                </div>
              </div>

              {result && (
                <div className="space-y-6 animate-in fade-in slide-in-from-top-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center px-1">
                      <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Strength Score</span>
                      <span className={cn(
                        "text-xs font-bold px-3 py-1 rounded-full text-white",
                        getScoreColor(result.score)
                      )}>
                        {getScoreLabel(result.score)}
                      </span>
                    </div>
                    <div className="h-3 w-full bg-muted/50 rounded-full overflow-hidden flex gap-1">
                      {[0, 1, 2, 3].map((i) => (
                        <div 
                          key={i} 
                          className={cn(
                            "h-full flex-1 transition-all duration-500",
                            result.score > i ? getScoreColor(result.score) : "bg-transparent"
                          )} 
                        />
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-3xl bg-primary/5 border border-primary/10 flex items-center gap-3">
                      <Clock className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-[10px] font-bold uppercase text-muted-foreground">Crack Time</p>
                        <p className="text-sm font-bold truncate">{result.crack_times_display.offline_slow_hashing_1e4_per_second}</p>
                      </div>
                    </div>
                    <div className="p-4 rounded-3xl bg-primary/5 border border-primary/10 flex items-center gap-3">
                      <History className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-[10px] font-bold uppercase text-muted-foreground">Complexity</p>
                        <p className="text-sm font-bold">{Math.round(result.guesses_log10)} logs</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-primary">Analysis Logic</h3>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              This tool uses the <strong>zxcvbn</strong> library to estimate crack time based on pattern matching and dictionary searches. It identifies common dates, sequences, and leaked passwords.
            </p>
          </div>
        </div>

        {/* Feedback Section */}
        <div className="lg:col-span-7 space-y-6">
          {result ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              {result.feedback.warning && (
                <div className="p-6 rounded-[2rem] bg-destructive/10 border border-destructive/20 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-destructive/20 flex items-center justify-center text-destructive shrink-0">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-destructive">Security Warning</h3>
                    <p className="text-sm text-destructive/80 mt-1 italic">"{result.feedback.warning}"</p>
                  </div>
                </div>
              )}

              {result.feedback.suggestions.length > 0 && (
                <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
                  <div className="px-8 py-4 border-b border-border/40 bg-primary/5 flex items-center gap-3">
                    <Zap className="w-4 h-4 text-primary" />
                    <span className="text-xs font-bold uppercase tracking-widest text-primary">Suggestions for Improvement</span>
                  </div>
                  <CardContent className="p-8">
                    <ul className="space-y-4">
                      {result.feedback.suggestions.map((s: string, i: number) => (
                        <li key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-muted/30 border border-border/40 transition-all hover:bg-muted/50">
                          <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                            <Check className="w-4 h-4" />
                          </div>
                          <span className="text-sm font-bold leading-relaxed">{s}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
                <div className="px-8 py-4 border-b border-border/40 bg-muted/30 flex items-center gap-3">
                  <Info className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Estimated Crack Times</span>
                </div>
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { label: "Online Throttled", value: result.crack_times_display.online_throttled_100_per_hour, desc: "100 guesses/hour" },
                      { label: "Online Unthrottled", value: result.crack_times_display.online_no_throttling_10_per_second, desc: "10 guesses/sec" },
                      { label: "Offline (Fast Hash)", value: result.crack_times_display.offline_fast_hashing_1e10_per_second, desc: "10B guesses/sec" },
                      { label: "Offline (Slow Hash)", value: result.crack_times_display.offline_slow_hashing_1e4_per_second, desc: "10K guesses/sec" },
                    ].map((item, i) => (
                      <div key={i} className="p-4 rounded-2xl border border-border/20 bg-muted/20">
                        <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">{item.label}</p>
                        <p className="text-lg font-bold text-foreground mt-1">{item.value}</p>
                        <p className="text-[9px] text-muted-foreground mt-0.5">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-6 bg-muted/20 rounded-[2.5rem] border border-dashed border-border/40 min-h-[500px]">
              <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center">
                <Lock className="w-10 h-10 text-muted-foreground/30" />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-lg">Waiting for Input</h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                  Enter a password to see a detailed security analysis.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
