"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { 
  Clock, 
  Copy, 
  Check, 
  RefreshCw,
  Terminal,
  Calendar,
  Zap,
  Info,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import cronstrue from "cronstrue";

type CronPart = "minute" | "hour" | "day" | "month" | "weekday";

interface CronOption {
  label: string;
  value: string;
}

export default function CrontabGenerator() {
  const [cron, setCron] = useState({
    minute: "*",
    hour: "*",
    day: "*",
    month: "*",
    weekday: "*",
  });
  const [expression, setExpression] = useState("* * * * *");
  const [description, setDescription] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const exp = `${cron.minute} ${cron.hour} ${cron.day} ${cron.month} ${cron.weekday}`;
    setExpression(exp);
    try {
      setDescription(cronstrue.toString(exp));
    } catch (e) {
      setDescription("Invalid expression");
    }
  }, [cron]);

  const updateCron = (part: CronPart, value: string) => {
    setCron(prev => ({ ...prev, [part]: value }));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(expression);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const commonPresets = [
    { label: "Every Minute", value: "* * * * *" },
    { label: "Every Hour", value: "0 * * * *" },
    { label: "Every Day at Midnight", value: "0 0 * * *" },
    { label: "Every Sunday", value: "0 0 * * 0" },
    { label: "Every Month (1st)", value: "0 0 1 * *" },
  ];

  const applyPreset = (preset: string) => {
    const [minute, hour, day, month, weekday] = preset.split(" ");
    setCron({ minute, hour, day, month, weekday });
  };

  const CronField = ({ label, value, options, part }: { label: string, value: string, options: CronOption[], part: CronPart }) => (
    <div className="space-y-3">
      <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">{label}</Label>
      <div className="relative group">
        <select 
          value={value}
          onChange={(e) => updateCron(part, e.target.value)}
          className="w-full h-12 px-4 rounded-xl bg-muted/30 border border-border/40 font-mono text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer transition-all hover:bg-muted/50"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
          {!options.find(o => o.value === value) && <option value={value}>{value}</option>}
        </select>
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none group-hover:text-primary transition-colors" />
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
          <Clock className="w-6 h-6" />
        </div>
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight">Crontab Generator</h1>
          <p className="text-sm text-muted-foreground">
            Create cron expressions visually and understand exactly when they run.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Editor Panel */}
        <div className="lg:col-span-8 space-y-8">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <CronField 
                  label="Minute" 
                  value={cron.minute} 
                  part="minute"
                  options={[
                    { label: "Every minute (*)", value: "*" },
                    { label: "Every 5 minutes (*/5)", value: "*/5" },
                    { label: "Every 15 minutes (*/15)", value: "*/15" },
                    { label: "At :00", value: "0" },
                    { label: "At :30", value: "30" },
                  ]}
                />
                <CronField 
                  label="Hour" 
                  value={cron.hour} 
                  part="hour"
                  options={[
                    { label: "Every hour (*)", value: "*" },
                    { label: "Every 2 hours (*/2)", value: "*/2" },
                    { label: "At midnight (0)", value: "0" },
                    { label: "At noon (12)", value: "12" },
                  ]}
                />
                <CronField 
                  label="Day of Month" 
                  value={cron.day} 
                  part="day"
                  options={[
                    { label: "Every day (*)", value: "*" },
                    { label: "1st day of month (1)", value: "1" },
                    { label: "15th day of month (15)", value: "15" },
                    { label: "Last day of month (L)", value: "L" },
                  ]}
                />
                <CronField 
                  label="Month" 
                  value={cron.month} 
                  part="month"
                  options={[
                    { label: "Every month (*)", value: "*" },
                    { label: "January (1)", value: "1" },
                    { label: "July (7)", value: "7" },
                    { label: "December (12)", value: "12" },
                  ]}
                />
                <CronField 
                  label="Day of Week" 
                  value={cron.weekday} 
                  part="weekday"
                  options={[
                    { label: "Every day (*)", value: "*" },
                    { label: "Mon-Fri (1-5)", value: "1-5" },
                    { label: "Sat-Sun (0,6)", value: "0,6" },
                    { label: "Sunday (0)", value: "0" },
                  ]}
                />
              </div>

              <div className="pt-6 border-t border-border/40">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Presets</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {commonPresets.map((preset) => (
                    <Button
                      key={preset.value}
                      variant="outline"
                      size="sm"
                      onClick={() => applyPreset(preset.value)}
                      className="rounded-xl text-[10px] font-bold border-border/40 hover:bg-primary/5 hover:text-primary transition-all"
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-primary">Human Readable Description</h3>
              <p className="text-lg font-bold text-foreground leading-snug">
                "{description}"
              </p>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center gap-3">
              <Terminal className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Cron Expression</span>
            </div>
            <CardContent className="p-8 space-y-8">
              <div className="space-y-4">
                <div className="h-24 px-6 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center">
                  <span className="text-3xl font-mono font-bold text-primary tracking-wider">{expression}</span>
                </div>
                <Button 
                  onClick={copyToClipboard}
                  className="w-full h-14 rounded-2xl text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                >
                  {copied ? <Check className="w-5 h-5 mr-2" /> : <Copy className="w-5 h-5 mr-2" />}
                  {copied ? "Copied!" : "Copy Expression"}
                </Button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="w-3 h-3 text-muted-foreground" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Example usage</span>
                </div>
                <div className="p-4 rounded-xl bg-muted/50 border border-border/40 font-mono text-[11px] leading-relaxed">
                  # Runs {description.toLowerCase()}
                  <br />
                  {expression} /path/to/command.sh
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
