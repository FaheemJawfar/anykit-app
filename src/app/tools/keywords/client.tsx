"use client";

import React, { useState, useEffect } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Copy, CheckCircle2, Target, BarChart3, TrendingUp, Zap, FileText, Settings2 } from "lucide-react";

interface KeywordStats { keyword: string; count: number; density: number; }

export default function KeywordAnalyzer() {
  const [content, setContent] = useState("");
  const [targetKeywords, setTargetKeywords] = useState("");
  const [analysis, setAnalysis] = useState<{ wordCount: number; charCount: number; keywordStats: KeywordStats[]; targetKeywordStats: KeywordStats[]; }>({ wordCount: 0, charCount: 0, keywordStats: [], targetKeywordStats: [] });
  const [copied, setCopied] = useState(false);

  const analyzeContent = () => {
    if (!content.trim()) { setAnalysis({ wordCount: 0, charCount: 0, keywordStats: [], targetKeywordStats: [] }); return; }
    const text = content.toLowerCase().replace(/[^\w\s]/g, " ");
    const words = text.split(/\s+/).filter(word => word.length > 2);
    const wordCount = words.length;
    const charCount = content.length;
    const wordFreq: { [key: string]: number } = {};
    words.forEach(word => { wordFreq[word] = (wordFreq[word] || 0) + 1; });
    const keywordStats: KeywordStats[] = Object.entries(wordFreq).map(([keyword, count]) => ({ keyword, count, density: (count / wordCount) * 100 })).sort((a, b) => b.count - a.count).slice(0, 20);
    const targetKeywordStats: KeywordStats[] = [];
    if (targetKeywords.trim()) {
      const targets = targetKeywords.toLowerCase().split(",").map(k => k.trim());
      targets.forEach(target => { const count = (content.toLowerCase().match(new RegExp(target, "g")) || []).length; targetKeywordStats.push({ keyword: target, count, density: wordCount > 0 ? (count / wordCount) * 100 : 0 }); });
    }
    setAnalysis({ wordCount, charCount, keywordStats, targetKeywordStats });
  };

  useEffect(() => { analyzeContent(); }, [content, targetKeywords]);

  const copyToClipboard = async () => {
    const report = `Keyword Analysis Report\n=====================================\n\nContent Statistics:\n- Word Count: ${analysis.wordCount}\n- Character Count: ${analysis.charCount}\n\nTarget Keywords Analysis:\n${analysis.targetKeywordStats.map(stat => `- "${stat.keyword}": ${stat.count} occurrences (${stat.density.toFixed(2)}% density)`).join("\n")}\n\nTop Keywords:\n${analysis.keywordStats.slice(0, 10).map((stat, index) => `${index + 1}. "${stat.keyword}": ${stat.count} occurrences (${stat.density.toFixed(2)}% density)`).join("\n")}\n\nRecommendations:\n- Ideal keyword density: 1-3%\n- Avoid keyword stuffing (over 5% density)\n`;
    try { await navigator.clipboard.writeText(report); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch (err) { console.error(err); }
  };

  const getDensityColor = (density: number) => { if (density < 1) return "text-red-500"; if (density <= 3) return "text-primary"; if (density <= 5) return "text-orange-500"; return "text-red-500"; };

  return (
    <ToolLayout toolId="keywords">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center gap-3"><FileText className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Your Text</span></div>
            <CardContent className="p-8"><Textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Paste your content here for deep keyword analysis..." rows={12} className="w-full px-6 py-6 bg-muted/30 border-transparent rounded-2xl focus:border-primary/20 text-sm font-medium text-foreground leading-relaxed resize-none placeholder:font-normal" /></CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
              <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center gap-2"><Target className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Target Keywords</span></div>
              <CardContent className="p-6">
                {analysis.targetKeywordStats.length > 0 ? (<div className="space-y-3">{analysis.targetKeywordStats.map((stat, index) => (<div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-border hover:border-primary/20 transition-all"><div className="flex flex-col"><span className="text-sm font-black text-foreground capitalize italic">&quot;{stat.keyword}&quot;</span><span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">{stat.count} occurrences</span></div><div className="text-right"><span className={`text-sm font-black ${getDensityColor(stat.density)}`}>{stat.density.toFixed(2)}%</span><p className="text-xs text-muted-foreground font-black mt-0.5">Density</p></div></div>))}</div>) : (<div className="text-center py-12 opacity-20"><Target className="w-10 h-10 mx-auto mb-3" /><p className="text-xs font-medium">No keywords tracked</p></div>)}
              </CardContent>
            </Card>
            <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
              <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center justify-between"><div className="flex items-center gap-2"><BarChart3 className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Top Keywords</span></div><TrendingUp className="w-4 h-4 text-muted-foreground" /></div>
              <CardContent className="p-6">
                {analysis.keywordStats.length > 0 ? (<div className="space-y-6 max-h-[400px] overflow-y-auto pr-2">{analysis.keywordStats.map((stat, index) => (<div key={index} className="group"><div className="flex justify-between items-center mb-2"><span className="font-bold text-muted-foreground text-sm flex items-center gap-2"><span className="w-6 h-6 rounded bg-muted flex items-center justify-center text-[10px] font-black group-hover:bg-primary group-hover:text-primary-foreground transition-all">{index + 1}</span>{stat.keyword}</span><span className={`font-black ${getDensityColor(stat.density)} text-xs`}>{stat.density.toFixed(2)}%</span></div><div className="w-full h-2 bg-muted rounded-full overflow-hidden"><div className="h-full bg-primary rounded-full transition-all duration-700 ease-out" style={{ width: `${Math.min(stat.density * 20, 100)}%` }} /></div></div>))}</div>) : (<div className="text-center py-12 opacity-20"><BarChart3 className="w-10 h-10 mx-auto mb-3" /><p className="text-xs font-medium">No content analyzed</p></div>)}
              </CardContent>
            </Card>
          </div>

          {analysis.keywordStats.length > 0 && (
            <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
              <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center gap-2"><Zap className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Density Legend</span></div>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-muted/30 p-5 rounded-2xl border border-border flex items-start gap-4"><div className="w-3 h-3 rounded-full bg-red-500 mt-1" /><div><p className="text-xs font-black text-foreground uppercase tracking-widest mb-1">Critical Range</p><p className="text-[10px] text-muted-foreground font-medium leading-relaxed">&lt;1% (Low focus) or &gt;5% (Spam risk)</p></div></div>
                  <div className="bg-muted/30 p-5 rounded-2xl border border-border flex items-start gap-4"><div className="w-3 h-3 rounded-full bg-primary mt-1" /><div><p className="text-xs font-black text-foreground uppercase tracking-widest mb-1">Optimal Range</p><p className="text-[10px] text-muted-foreground font-medium leading-relaxed">1-3% (Natural presence &amp; strong focus)</p></div></div>
                  <div className="bg-muted/30 p-5 rounded-2xl border border-border flex items-start gap-4"><div className="w-3 h-3 rounded-full bg-orange-500 mt-1" /><div><p className="text-xs font-black text-foreground uppercase tracking-widest mb-1">High Range</p><p className="text-[10px] text-muted-foreground font-medium leading-relaxed">3-5% (High focus, use with caution)</p></div></div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:col-span-4 space-y-6 sticky top-24">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center gap-2"><Settings2 className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Actions</span></div>
            <CardContent className="p-8 space-y-3">
              <Button onClick={copyToClipboard} disabled={analysis.wordCount === 0} className="w-full h-14 rounded-2xl text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]">{copied ? <CheckCircle2 className="w-5 h-5 mr-2" /> : <Copy className="w-5 h-5 mr-2" />}{copied ? "Copied!" : "Copy Full Report"}</Button>
            </CardContent>
          </Card>

          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center gap-2"><Target className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Target Analysis</span></div>
            <CardContent className="p-8 space-y-4">
              <div className="space-y-2"><Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Track Keywords</Label><Input type="text" value={targetKeywords} onChange={(e) => setTargetKeywords(e.target.value)} placeholder="e.g. SEO, keywords, tools" className="h-12 px-4 rounded-xl bg-muted/30 border-transparent focus:border-primary/20 text-sm font-bold" /><p className="text-[10px] text-muted-foreground ml-1 font-medium italic">Separate keywords with commas</p></div>
            </CardContent>
          </Card>

          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Content Statistics</span></div>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/30 rounded-xl border border-border p-4"><p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Words</p><p className="text-2xl font-black text-foreground">{analysis.wordCount}</p></div>
                <div className="bg-muted/30 rounded-xl border border-border p-4"><p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Chars</p><p className="text-2xl font-black text-foreground">{analysis.charCount}</p></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
