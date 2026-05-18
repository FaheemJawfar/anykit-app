"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { 
  ShieldCheck, 
  Copy, 
  Check, 
  Trash2,
  Zap,
  Info,
  Lock,
  Search,
  Calendar,
  User,
  Shield,
  Fingerprint,
  Globe,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import forge from "node-forge";

interface CertInfo {
  subject: any;
  issuer: any;
  validFrom: string;
  validTo: string;
  serialNumber: string;
  fingerprint: string;
}

export default function SSLDecoder() {
  const [input, setInput] = useState("");
  const [certInfo, setCertInfo] = useState<CertInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const decodeCert = (pem: string) => {
    setInput(pem);
    setError(null);
    if (!pem.trim()) {
      setCertInfo(null);
      return;
    }

    try {
      const cert = forge.pki.certificateFromPem(pem);
      
      const getAttrs = (attrs: any[]) => {
        const obj: any = {};
        attrs.forEach(a => {
          obj[a.name || a.type] = a.value;
        });
        return obj;
      };

      // Calculate fingerprint
      const der = forge.asn1.toDer(forge.pki.certificateToAsn1(cert)).getBytes();
      const md = forge.md.sha256.create();
      md.update(der);
      const fingerprint = md.digest().toHex().match(/.{2}/g)?.join(':').toUpperCase() || "";

      setCertInfo({
        subject: getAttrs(cert.subject.attributes),
        issuer: getAttrs(cert.issuer.attributes),
        validFrom: cert.validity.notBefore.toLocaleString(),
        validTo: cert.validity.notAfter.toLocaleString(),
        serialNumber: cert.serialNumber,
        fingerprint
      });
    } catch (e: any) {
      setError("Invalid PEM format. Ensure it starts with -----BEGIN CERTIFICATE-----");
      setCertInfo(null);
    }
  };

  const copy = (val: string, id: string) => {
    navigator.clipboard.writeText(val);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const InfoGroup = ({ title, icon: Icon, data }: { title: string, icon: any, data: any }) => (
    <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-3xl overflow-hidden transition-all hover:shadow-2xl hover:shadow-primary/10">
      <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center gap-3">
        <Icon className="w-4 h-4 text-primary" />
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{title}</span>
      </div>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="space-y-1">
              <p className="text-[10px] font-bold uppercase text-muted-foreground/60 tracking-wider">
                {key}
              </p>
              <p className="text-sm font-bold truncate" title={String(value)}>{String(value)}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8 text-foreground">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
          <Lock className="w-6 h-6" />
        </div>
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight">SSL Certificate Decoder</h1>
          <p className="text-sm text-muted-foreground">
            Decode and inspect X.509 certificates (PEM format) locally in your browser.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Editor Side */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col min-h-[400px]">
            <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Certificate PEM</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => decodeCert("")} className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <CardContent className="p-0 flex-1 relative">
              <Textarea
                placeholder="-----BEGIN CERTIFICATE-----\n..."
                value={input}
                onChange={(e) => decodeCert(e.target.value)}
                className="w-full h-full min-h-[300px] p-8 bg-transparent border-none focus-visible:ring-0 resize-none font-mono text-[10px] leading-relaxed"
              />
            </CardContent>
          </Card>

          {error && (
            <div className="p-6 rounded-[2rem] bg-destructive/5 border border-destructive/20 flex items-start gap-4 animate-in zoom-in-95">
              <div className="w-12 h-12 rounded-2xl bg-destructive/10 flex items-center justify-center text-destructive shrink-0">
                <AlertCircle className="w-6 h-6" />
              </div>
              <p className="text-xs font-mono text-destructive/80 leading-relaxed">
                {error}
              </p>
            </div>
          )}
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-7 space-y-6">
          {certInfo ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-6 rounded-3xl border border-border/40 bg-card shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase text-muted-foreground">Expires On</p>
                    <p className="text-sm font-bold">{certInfo.validTo}</p>
                  </div>
                </Card>
                <Card className="p-6 rounded-3xl border border-border/40 bg-card shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <Fingerprint className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase text-muted-foreground">SHA-256 Fingerprint</p>
                    <p className="text-[10px] font-mono font-bold truncate">{certInfo.fingerprint}</p>
                  </div>
                </Card>
              </div>

              <InfoGroup title="Subject (Owner)" icon={User} data={certInfo.subject} />
              <InfoGroup title="Issuer (CA)" icon={ShieldCheck} data={certInfo.issuer} />

              <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
                <div className="px-8 py-4 border-b border-border/40 bg-muted/30">
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Additional Details</span>
                </div>
                <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Serial Number</p>
                    <p className="text-sm font-mono font-bold break-all">{certInfo.serialNumber}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Valid From</p>
                    <p className="text-sm font-bold">{certInfo.validFrom}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-6 bg-muted/20 rounded-[2.5rem] border border-dashed border-border/40 min-h-[500px]">
              <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center">
                <Search className="w-10 h-10 text-muted-foreground/30" />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-lg">Waiting for Certificate</h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                  Paste an X.509 certificate in PEM format to see its details.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
