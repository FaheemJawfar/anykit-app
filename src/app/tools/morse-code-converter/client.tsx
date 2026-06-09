"use client";

import React, { useState, useEffect } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Waves, RotateCcw, Copy, Info, ArrowRightLeft, Check, ShieldCheck, Type, Radio } from "lucide-react";

export default function MorseCodeConverter() {
  const [input, setInput] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [mode, setMode] = useState<"toMorse" | "fromMorse">("toMorse");
  const [copied, setCopied] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const morseMap: Record<string, string> = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
    'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
    'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
    'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
    'Y': '-.--', 'Z': '--..', '1': '.----', '2': '..---', '3': '...--',
    '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..',
    '9': '----.', '0': '-----', ' ': '/', '.': '.-.-.-', ',': '--..--',
    '?': '..--..', "'": '.----.', '!': '-.-.--', '/': '-..-.', '(': '-.--.',
    ')': '-.--.-', '&': '.-...', ':': '---...', ';': '-.-.-.', '=': '-...-',
    '+': '.-.-.', '-': '-....-', '_': '..--.-', '"': '.-..-.', '$': '...-..-',
    '@': '.--.-.'
  };

  const reverseMorseMap: Record<string, string> = Object.entries(morseMap).reduce((acc, [char, code]) => ({ ...acc, [code]: char }), {});

  useEffect(() => {
    if (!input.trim()) { setOutput(""); setError(""); return; }
    try {
      if (mode === "toMorse") {
        const chars = input.toUpperCase().split("");
        const translated = chars.map(c => morseMap[c] || c).join(" ");
        setOutput(translated);
      } else {
        const words = input.trim().split(" / ");
        const translated = words.map(word => word.split(" ").map(code => reverseMorseMap[code] || "").join("")).join(" ");
        setOutput(translated);
      }
      setError("");
    } catch (e) { setError("Invalid format detected"); setOutput(""); }
  }, [input, mode]);

  const swapMode = () => {
    const newMode = mode === "toMorse" ? "fromMorse" : "toMorse";
    setMode(newMode); setInput(output); setOutput(input);
  };

  const handleCopy = async () => {
    if (!output) return;
    try { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch (err) { console.error(err); }
  };

  return (
    <ToolLayout toolId="morse-code-converter">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 lg:order-last space-y-6">
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">Translator Mode</h3>
            <div className="space-y-2">
              {[{ id: "toMorse", label: "Text to Morse", icon: <Type className="w-4 h-4" /> }, { id: "fromMorse", label: "Morse to Text", icon: <Waves className="w-4 h-4" /> }].map((m) => (
                <button key={m.id} onClick={() => { if (mode !== m.id) swapMode(); }} className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all ${mode === m.id ? "border-primary bg-primary/5 text-primary" : "border-border bg-card text-muted-foreground hover:border-border"}`}>
                  <span className="text-sm font-bold">{m.label}</span>
                  {mode === m.id && <div className="w-2 h-2 rounded-full bg-primary" />}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <Button onClick={swapMode} className="w-full h-12 shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest text-xs rounded-xl">
              <ArrowRightLeft className="w-4 h-4 mr-2" /> Swap Direction
            </Button>
            <Button onClick={() => { setInput(""); setOutput(""); setError(""); }} variant="outline" className="w-full h-12 border-border hover:bg-accent text-muted-foreground hover:text-foreground font-bold uppercase tracking-widest text-xs">
              <RotateCcw className="w-4 h-4 mr-2" /> Reset All
            </Button>
          </div>
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">Standard</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">This translator adheres to International Morse Code conventions, utilizing single spaces for character separation and forward slashes (/) for word boundaries.</p>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between px-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{mode === "toMorse" ? "Plain Text Input" : "Morse Code Input"}</label>
                <span className="text-[10px] font-bold text-muted-foreground">{input.length} Chars</span>
              </div>
              <textarea value={input} onChange={(e) => setInput(e.target.value)} className="w-full min-h-[280px] p-6 bg-card border border-border rounded-[2.5rem] outline-none focus:border-primary transition-all text-lg font-medium text-foreground placeholder:text-muted-foreground resize-none shadow-sm" placeholder={mode === "toMorse" ? "Start typing..." : "... --- ..."} />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between px-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Result</label>
                {output && (
                  <button onClick={handleCopy} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                    <span className="text-[10px] font-bold uppercase tracking-widest">{copied ? "Copied" : "Copy"}</span>
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>
              <div className="w-full min-h-[280px] p-6 bg-gradient-to-br from-blue-600 to-indigo-800 text-primary-foreground rounded-[2.5rem] overflow-auto shadow-xl shadow-primary/20 relative">
                {error ? (
                  <div className="flex flex-col items-center justify-center min-h-[150px] gap-2"><Info className="w-8 h-8 text-red-400 opacity-50" /><p className="text-xs uppercase font-bold tracking-widest text-red-300">{error}</p></div>
                ) : output ? (
                  <p className={`text-2xl font-black tracking-widest leading-relaxed break-words relative z-10 ${mode === "toMorse" ? "font-mono" : ""}`}>{output}</p>
                ) : (
                  <div className="flex flex-col items-center justify-center min-h-[150px] opacity-10 gap-4 mt-8"><Waves className="w-16 h-16" /><p className="text-[10px] font-black uppercase tracking-[0.4em]">Awaiting signal...</p></div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4"><span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Morse Reference</span><div className="h-px flex-1 bg-border" /></div>
            <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-2">
              {Object.entries(morseMap).filter(([k]) => k.length === 1 && /[A-Z0-9]/.test(k)).map(([char, code]) => (
                <div key={char} className="flex flex-col items-center gap-1 group p-2 bg-card border border-border rounded-xl">
                  <span className="text-[10px] font-bold text-muted-foreground group-hover:text-foreground transition-colors">{char}</span>
                  <span className="text-xs font-mono font-bold text-muted-foreground bg-muted group-hover:bg-muted px-2 py-1 rounded-lg transition-colors">{code}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
