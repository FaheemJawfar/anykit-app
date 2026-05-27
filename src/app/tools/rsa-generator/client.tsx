"use client";

import { ToolLayout } from "@/components/tool-layout";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { 
  Key, 
  Copy, 
  Check, 
  RefreshCw,
  Zap,
  ShieldCheck,
  Info,
  Download,
  Lock,
  Unlock
} from "lucide-react";
import { cn } from "@/lib/utils";
import forge from "node-forge";

export default function RSAKeyGenerator() {
  const [keySize, setKeySize] = useState<number>(2048);
  const [keys, setKeys] = useState<{ public: string, private: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const generateKeys = () => {
    setLoading(true);
    // Use setTimeout to allow UI to update (loading state)
    setTimeout(() => {
      try {
        const pair = forge.pki.rsa.generateKeyPair(keySize);
        const publicKey = forge.pki.publicKeyToPem(pair.publicKey);
        const privateKey = forge.pki.privateKeyToPem(pair.privateKey);
        setKeys({ public: publicKey, private: privateKey });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }, 100);
  };

  const copy = (val: string, id: string) => {
    navigator.clipboard.writeText(val);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const downloadKey = (val: string, filename: string) => {
    const blob = new Blob([val], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <ToolLayout toolId="rsa-generator">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Configuration Panel */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 space-y-8">
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Key Settings</span>
                </div>

                <div className="space-y-4">
                  <Label className="text-sm font-bold">Key Size (bits)</Label>
                  <div className="grid grid-cols-2 gap-2 p-1 bg-muted/50 rounded-2xl border border-border/40">
                    {[1024, 2048, 3072, 4096].map((size) => (
                      <Button
                        key={size}
                        variant={keySize === size ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setKeySize(size)}
                        className={cn(
                          "rounded-xl font-mono font-bold h-10",
                          keySize === size && "shadow-md"
                        )}
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                  <p className="text-[10px] text-muted-foreground italic px-1">
                    2048-bit is standard. 4096-bit is ultra-secure but slower to generate.
                  </p>
                </div>
              </div>

              <Button 
                onClick={generateKeys}
                disabled={loading}
                className="w-full h-14 rounded-2xl text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
              >
                {loading ? <RefreshCw className="w-5 h-5 mr-2 animate-spin" /> : <Zap className="w-5 h-5 mr-2" />}
                {loading ? "Generating..." : "Generate New Keys"}
              </Button>
            </CardContent>
          </Card>

          <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-4">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-primary">Security Note</h3>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed italic">
              Keys are generated using the <strong>node-forge</strong> library entirely in your browser. No data ever leaves your computer.
            </p>
          </div>
        </div>

        {/* Output Panel */}
        <div className="lg:col-span-8 space-y-8">
          {keys ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Private Key */}
              <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
                <div className="px-8 py-4 border-b border-border/40 bg-destructive/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-destructive" />
                    <span className="text-xs font-bold uppercase tracking-widest text-destructive">Private Key (Keep Secret!)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => downloadKey(keys.private, 'id_rsa')} className="h-8 rounded-xl font-bold">
                      <Download className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => copy(keys.private, 'private')} className="h-8 rounded-xl font-bold">
                      {copied === 'private' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                <CardContent className="p-6">
                  <pre className="text-[10px] font-mono text-destructive/80 leading-relaxed overflow-auto max-h-[250px] bg-destructive/[0.02] p-4 rounded-xl">
                    {keys.private}
                  </pre>
                </CardContent>
              </Card>

              {/* Public Key */}
              <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
                <div className="px-8 py-4 border-b border-border/40 bg-green-500/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Unlock className="w-4 h-4 text-green-600" />
                    <span className="text-xs font-bold uppercase tracking-widest text-green-600">Public Key (Safe to Share)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => downloadKey(keys.public, 'id_rsa.pub')} className="h-8 rounded-xl font-bold">
                      <Download className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => copy(keys.public, 'public')} className="h-8 rounded-xl font-bold">
                      {copied === 'public' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                <CardContent className="p-6">
                  <pre className="text-[10px] font-mono text-green-600/80 leading-relaxed overflow-auto max-h-[150px] bg-green-500/[0.02] p-4 rounded-xl">
                    {keys.public}
                  </pre>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-6 bg-muted/20 rounded-[2.5rem] border border-dashed border-border/40 min-h-[500px]">
              <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center">
                <Key className="w-10 h-10 text-muted-foreground/30" />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-lg">No Keys Generated</h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                  Select a key size and click "Generate New Keys" to create your RSA pair.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
