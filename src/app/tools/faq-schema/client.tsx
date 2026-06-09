"use client";

import React, { useState, useEffect } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { HelpCircle, Plus, Copy, Trash2, CheckCircle2, Info, Globe, Code as CodeIcon } from "lucide-react";

interface FAQItem { id: string; question: string; answer: string; }

export default function FAQSchemaGenerator() {
  const [faqs, setFaqs] = useState<FAQItem[]>([{ id: Math.random().toString(36).substr(2, 9), question: "", answer: "" }]);
  const [generatedSchema, setGeneratedSchema] = useState("");
  const [copied, setCopied] = useState(false);

  const addFaq = () => { setFaqs([...faqs, { id: Math.random().toString(36).substr(2, 9), question: "", answer: "" }]); };
  const removeFaq = (id: string) => { if (faqs.length > 1) setFaqs(faqs.filter(faq => faq.id !== id)); };
  const updateFaq = (id: string, field: "question" | "answer", value: string) => { setFaqs(faqs.map(faq => faq.id === id ? { ...faq, [field]: value } : faq)); };
  const isAllValid = faqs.every(f => f.question.trim() && f.answer.trim());

  useEffect(() => {
    const validFaqs = faqs.filter(f => f.question.trim() && f.answer.trim());
    if (validFaqs.length > 0) {
      const schema = { "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": validFaqs.map(faq => ({ "@type": "Question", "name": faq.question.trim(), "acceptedAnswer": { "@type": "Answer", "text": faq.answer.trim() } })) };
      setGeneratedSchema(JSON.stringify(schema, null, 2));
    } else { setGeneratedSchema(""); }
  }, [faqs]);

  const handleCopy = async () => { if (!generatedSchema || !isAllValid) return; try { await navigator.clipboard.writeText(`<script type="application/ld+json">\n${generatedSchema}\n</script>`); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch (err) { console.error(err); } };
  const handleReset = () => { setFaqs([{ id: Math.random().toString(36).substr(2, 9), question: "", answer: "" }]); };

  return (
    <ToolLayout toolId="faq-schema">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 lg:order-last space-y-6">
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <Button onClick={handleCopy} disabled={!generatedSchema || !isAllValid} className="w-full h-12 shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest text-xs rounded-xl">{copied ? <CheckCircle2 className="w-5 h-5 mr-2" /> : <Copy className="w-5 h-5 mr-2" />}{copied ? "Copied!" : "Copy Schema Code"}</Button>
            {!isAllValid && faqs.some(f => f.question || f.answer) && <p className="text-xs text-red-500 text-center font-black">Please fill all fields</p>}
          </div>
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <Button onClick={handleReset} variant="outline" className="w-full h-12 border-border hover:bg-accent text-muted-foreground hover:text-foreground font-bold uppercase tracking-widest text-xs"><Trash2 className="w-4 h-4 mr-2" /> Reset Generator</Button>
          </div>
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">Schema Info</h3>
            <div className="flex items-start gap-3 p-3 bg-primary/5 rounded-xl border border-primary/10"><Info className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" /><p className="text-xs text-muted-foreground leading-relaxed font-medium">FAQ Schema helps search engines understand your content better and can lead to expanded snippets in search results.</p></div>
            <div className="flex items-center gap-2 p-3 bg-muted rounded-xl border border-border italic text-xs text-muted-foreground font-medium"><Globe className="w-3 h-3" /><span>Supports multiple languages</span></div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <div className="bg-card rounded-[2rem] shadow-sm border border-border overflow-hidden">
            <div className="p-6 border-b border-border flex items-center justify-between bg-muted/50"><h3 className="text-lg font-black text-foreground">Questions &amp; Answers</h3><Button onClick={addFaq} variant="outline" size="sm"><Plus className="w-4 h-4 mr-2" /> Add Question</Button></div>
            <div className="p-6 space-y-6">
              {faqs.map((faq, index) => (
                <div key={faq.id} className="relative p-6 bg-muted/50 border border-border rounded-3xl group hover:border-primary/20 transition-colors">
                  <div className="absolute -left-3 top-6 w-8 h-8 bg-primary text-primary-foreground rounded-xl flex items-center justify-center text-sm font-black shadow-lg shadow-primary/20 z-10">{index + 1}</div>
                  {faqs.length > 1 && <button onClick={() => removeFaq(faq.id)} className="absolute -right-2 -top-2 w-8 h-8 bg-card text-red-500 rounded-full border border-border shadow-sm flex items-center justify-center hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 z-10"><Trash2 className="w-4 h-4" /></button>}
                  <div className="space-y-4 pl-4">
                    <div><label className="block text-xs font-black text-muted-foreground mb-2 ml-1">Question</label><input type="text" value={faq.question} onChange={(e) => updateFaq(faq.id, "question", e.target.value)} placeholder="e.g., What is your return policy?" className="w-full px-4 py-3 bg-card border border-border rounded-2xl focus:border-primary focus:outline-none transition-all text-sm font-bold text-foreground placeholder:font-normal" /></div>
                    <div><label className="block text-xs font-black text-muted-foreground mb-2 ml-1">Answer</label><textarea value={faq.answer} onChange={(e) => updateFaq(faq.id, "answer", e.target.value)} placeholder="e.g., We offer a 30-day money back guarantee..." rows={2} className="w-full px-4 py-3 bg-card border border-border rounded-2xl focus:border-primary focus:outline-none transition-all text-sm font-medium text-foreground resize-none placeholder:font-normal" /></div>
                  </div>
                </div>
              ))}
              <button onClick={addFaq} className="w-full py-4 rounded-2xl border-2 border-dashed border-border text-muted-foreground font-bold text-sm hover:border-primary hover:text-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2 group"><div className="w-8 h-8 rounded-lg bg-muted group-hover:bg-primary/10 flex items-center justify-center transition-colors"><Plus className="w-4 h-4 group-hover:scale-110 transition-transform" /></div>Add Another Question</button>
            </div>
          </div>

          <div className="bg-card rounded-[2rem] shadow-sm border border-border overflow-hidden">
            <div className="p-6 border-b border-border flex items-center justify-between bg-muted/50">
              <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center"><CodeIcon className="w-4 h-4 text-primary" /></div><h3 className="text-lg font-black text-foreground">Generated Schema</h3></div>
              {generatedSchema && <Button onClick={handleCopy} variant="outline" size="sm" className="h-8 text-[10px] font-black">{copied ? <CheckCircle2 className="w-3.5 h-3.5 mr-2" /> : <Copy className="w-3.5 h-3.5 mr-2" />}{copied ? "Copied!" : "Copy Code"}</Button>}
            </div>
            <div className="p-0 bg-muted relative group">
              <pre className="p-8 overflow-x-auto text-xs font-mono text-foreground min-h-[250px] leading-relaxed">{generatedSchema ? (<><span className="text-primary font-bold">{`<script type="application/ld+json">`}</span>{"\n"}{generatedSchema}{"\n"}<span className="text-primary font-bold">{`</script>`}</span></>) : (<div className="flex flex-col items-center justify-center h-full py-16 opacity-50"><CodeIcon className="w-12 h-12 text-muted-foreground mb-4" /><span className="text-muted-foreground italic">Add at least one question and answer to see the code...</span></div>)}</pre>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
