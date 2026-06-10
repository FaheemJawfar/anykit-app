"use client";

import React, { useState, useEffect } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock, Copy, CheckCircle2, Info, Calendar, Zap, List } from "lucide-react";

const PRESETS = [
  { label: "Every Minute", value: "* * * * *" },
  { label: "Every Hour", value: "0 * * * *" },
  { label: "Every Day at Midnight", value: "0 0 * * *" },
  { label: "Every Sunday at Midnight", value: "0 0 * * 0" },
  { label: "Every 1st of Month", value: "0 0 1 * *" },
  { label: "Every Weekday at 9 AM", value: "0 9 * * 1-5" },
];

function getCronDescription(cron: { minute: string; hour: string; dom: string; month: string; dow: string }) {
  const { minute, hour, dom, month, dow } = cron;
  if (minute === "*" && hour === "*" && dom === "*" && month === "*" && dow === "*") return "Every minute";
  if (minute === "0" && hour === "*" && dom === "*" && month === "*" && dow === "*") return "Every hour";
  if (minute === "0" && hour === "0" && dom === "*" && month === "*" && dow === "*") return "Every day at midnight";
  if (minute === "0" && hour === "0" && dom === "*" && month === "*" && dow === "0") return "Every Sunday at midnight";
  if (minute === "0" && hour === "0" && dom === "1" && month === "*" && dow === "*") return "Every 1st of the month";
  if (minute === "0" && hour === "9" && dom === "*" && month === "*" && dow === "1-5") return "Every weekday at 9 AM";
  return `At minute ${minute}, hour ${hour}, day ${dom}, month ${month}, weekday ${dow}`;
}

export default function CronGenerator() {
  const [cron, setCron] = useState({ minute: "*", hour: "*", dom: "*", month: "*", dow: "*" });
  const [errors, setErrors] = useState({ minute: false, hour: false, dom: false, month: false, dow: false });
  const [cronString, setCronString] = useState("* * * * *");
  const [copied, setCopied] = useState(false);
  const [description, setDescription] = useState("Every minute");

  const validatePart = (part: keyof typeof cron, value: string): boolean => {
    if (value === "*") return true;
    const rangeRegex = /^(\*|[0-9]+)(-([0-9]+))?(\/([0-9]+))?$/;
    const listParts = value.split(",");
    return listParts.every(p => {
      const match = p.match(rangeRegex);
      if (!match) return false;
      const start = match[1] === "*" ? -1 : parseInt(match[1]);
      const end = match[3] ? parseInt(match[3]) : -1;
      const limits = { minute: { min: 0, max: 59 }, hour: { min: 0, max: 23 }, dom: { min: 1, max: 31 }, month: { min: 1, max: 12 }, dow: { min: 0, max: 6 } };
      const { min, max } = limits[part];
      if (start !== -1 && (start < min || start > max)) return false;
      if (end !== -1 && (end < min || end > max || end < start)) return false;
      return true;
    });
  };

  const updatePart = (part: keyof typeof cron, value: string) => {
    setCron(prev => ({ ...prev, [part]: value }));
    setErrors(prev => ({ ...prev, [part]: !validatePart(part, value) }));
  };

  useEffect(() => {
    const str = `${cron.minute} ${cron.hour} ${cron.dom} ${cron.month} ${cron.dow}`;
    setCronString(str);
    const hasErrors = Object.values(errors).some(v => v);
    setDescription(hasErrors ? "Invalid cron expression" : getCronDescription(cron));
  }, [cron, errors]);

  const copyToClipboard = async () => { try { await navigator.clipboard.writeText(cronString); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch (err) { console.error(err); } };

  return (
    <ToolLayout toolId="cron">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center gap-3"><Clock className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Cron Expression</span></div>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {(["minute", "hour", "dom", "month", "dow"] as const).map((part) => (
                  <div key={part}>
                    <Label className={`text-[10px] font-black uppercase tracking-wider ml-1 ${errors[part] ? "text-red-500" : "text-muted-foreground"}`}>{part}</Label>
                    <Input type="text" value={cron[part]} onChange={(e) => updatePart(part, e.target.value)} className={`mt-1.5 h-12 px-4 bg-muted/30 border-transparent rounded-xl text-sm font-bold text-center uppercase ${errors[part] ? "border-red-200 focus:border-red-500" : "focus:border-primary/20"}`} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="border-primary/40 shadow-xl shadow-primary/20 bg-primary/5 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 space-y-4">
              <div className="flex items-center gap-3"><div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center"><Calendar className="w-5 h-5 text-primary" /></div><h3 className="text-lg font-black text-foreground">Result</h3></div>
              <div className="p-6 bg-muted/30 rounded-2xl border border-border font-mono text-xl md:text-2xl font-black break-all text-foreground">{cronString}</div>
              <p className="text-muted-foreground font-medium">{description}</p>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-6 sticky top-24">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center gap-2"><Zap className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Actions</span></div>
            <CardContent className="p-8">
              <Button onClick={copyToClipboard} className="w-full h-14 rounded-2xl text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]">{copied ? <CheckCircle2 className="w-5 h-5 mr-2" /> : <Copy className="w-5 h-5 mr-2" />}{copied ? "Copied!" : "Copy Expression"}</Button>
            </CardContent>
          </Card>
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center gap-2"><List className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Presets</span></div>
            <CardContent className="p-6 space-y-2">{PRESETS.map((preset) => (<button key={preset.value} onClick={() => { const [m, h, d, mo, w] = preset.value.split(" "); setCron({ minute: m, hour: h, dom: d, month: mo, dow: w }); setErrors({ minute: false, hour: false, dom: false, month: false, dow: false }); }} className="w-full text-left px-4 py-3 bg-muted/30 border border-border rounded-xl text-sm font-bold text-foreground hover:bg-primary/5 hover:border-primary/30 transition-all">{preset.label}</button>))}</CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
