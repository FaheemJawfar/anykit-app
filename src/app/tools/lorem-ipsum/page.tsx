"use client";

import { ToolLayout } from "@/components/tool-layout";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { 
  FileText, 
  Copy, 
  Check, 
  RefreshCw,
  Type,
  AlignLeft,
  Settings2
} from "lucide-react";
import { cn } from "@/lib/utils";

const LOREM_WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
  "magna", "aliqua", "ut", "enim", "ad", "minim", "veniam", "quis", "nostrud",
  "exercitation", "ullamco", "laboris", "nisi", "ut", "aliquip", "ex", "ea",
  "commodo", "consequat", "duis", "aute", "irure", "dolor", "in", "reprehenderit",
  "in", "voluptate", "velit", "esse", "cillum", "dolore", "eu", "fugiat", "nulla",
  "pariatur", "excepteur", "sint", "occaecat", "cupidatat", "non", "proident",
  "sunt", "in", "culpa", "qui", "officia", "deserunt", "mollit", "anim", "id", "est", "laborum"
];

export default function LoremIpsumGenerator() {
  const [type, setType] = useState<"paragraphs" | "sentences" | "words">("paragraphs");
  const [count, setCount] = useState(3);
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [generatedText, setGeneratedText] = useState("");
  const [copied, setCopied] = useState(false);

  const generateText = () => {
    let result = "";
    
    if (type === "words") {
      result = generateWords(count);
    } else if (type === "sentences") {
      result = Array.from({ length: count }, () => generateSentence()).join(" ");
    } else {
      result = Array.from({ length: count }, () => generateParagraph()).join("\n\n");
    }

    if (startWithLorem) {
      const words = result.split(" ");
      words[0] = "Lorem";
      words[1] = "ipsum";
      words[2] = "dolor";
      words[3] = "sit";
      words[4] = "amet,";
      result = words.join(" ");
    }

    setGeneratedText(result);
  };

  const generateWords = (n: number) => {
    return Array.from({ length: n }, () => LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]).join(" ");
  };

  const generateSentence = () => {
    const wordCount = Math.floor(Math.random() * 10) + 5;
    let sentence = generateWords(wordCount);
    sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1) + ".";
    return sentence;
  };

  const generateParagraph = () => {
    const sentenceCount = Math.floor(Math.random() * 4) + 3;
    return Array.from({ length: sentenceCount }, () => generateSentence()).join(" ");
  };

  useEffect(() => {
    generateText();
  }, [type, count, startWithLorem]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout toolId="lorem-ipsum">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Configuration Panel */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 space-y-8">
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Settings2 className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Generator Settings</span>
                </div>

                <div className="space-y-4">
                  <Label className="text-sm font-bold">Type of Content</Label>
                  <div className="grid grid-cols-3 gap-2 p-1 bg-muted/50 rounded-xl border border-border/50">
                    {(["paragraphs", "sentences", "words"] as const).map((t) => (
                      <Button
                        key={t}
                        variant={type === t ? "default" : "ghost"}
                        size="sm"
                        onClick={() => {
                          setType(t);
                          if (t === 'words' && count < 10) setCount(50);
                          if (t === 'paragraphs' && count > 10) setCount(3);
                        }}
                        className={cn(
                          "rounded-lg text-[10px] font-bold uppercase tracking-wider h-10",
                          type === t && "shadow-md"
                        )}
                      >
                        {t}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm font-bold">Amount</Label>
                    <span className="text-xs font-mono font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      {count} {type}
                    </span>
                  </div>
                  <Slider
                    value={[count]}
                    onValueChange={([v]) => setCount(v)}
                    max={type === "words" ? 500 : type === "sentences" ? 50 : 20}
                    min={1}
                    step={1}
                    className="py-4"
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/40">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-bold">Start with "Lorem ipsum..."</Label>
                    <p className="text-[10px] text-muted-foreground">Always begin with the standard phrase</p>
                  </div>
                  <Switch
                    checked={startWithLorem}
                    onCheckedChange={setStartWithLorem}
                  />
                </div>
              </div>

              <Button 
                onClick={generateText}
                className="w-full h-14 rounded-2xl text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Regenerate
              </Button>
            </CardContent>
          </Card>

          <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-4">
            <div className="flex items-center gap-2">
              <Type className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-primary">About Lorem Ipsum</h3>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed italic">
              "Lorem ipsum dolor sit amet..." is the standard placeholder text used in the design and printing industry since the 1500s.
            </p>
          </div>
        </div>

        {/* Output Panel */}
        <div className="lg:col-span-8">
          <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/30 backdrop-blur-sm rounded-[2.5rem] overflow-hidden h-full flex flex-col">
            <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <AlignLeft className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Generated Output</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyToClipboard}
                className={cn(
                  "rounded-xl font-bold px-4 hover:bg-primary/10 transition-all",
                  copied && "text-green-500 hover:text-green-500"
                )}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy All
                  </>
                )}
              </Button>
            </div>
            <CardContent className="p-8 flex-1 overflow-auto">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                {generatedText.split('\n\n').map((para, i) => (
                  <p key={i} className="text-lg leading-relaxed text-foreground/80 mb-6 last:mb-0">
                    {para}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
