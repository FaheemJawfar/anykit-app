"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Wifi, 
  Copy, 
  Check, 
  Download,
  Zap,
  Info,
  ShieldCheck,
  Eye,
  EyeOff,
  RefreshCw,
  QrCode
} from "lucide-react";
import { cn } from "@/lib/utils";
import { QRCodeSVG } from "qrcode.react";

export default function WiFiQRGenerator() {
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [encryption, setEncryption] = useState("WPA");
  const [hidden, setHidden] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [qrValue, setQrCodeValue] = useState("");
  const [copied, setCopied] = useState(false);

  const escapeString = (str: string) => {
    return str.replace(/([\\;,:"])/g, '\\$1');
  };

  useEffect(() => {
    if (!ssid) {
      setQrCodeValue("");
      return;
    }

    let value = `WIFI:S:${escapeString(ssid)};`;
    if (encryption !== "nopass") {
      value += `T:${encryption};P:${escapeString(password)};`;
    }
    if (hidden) {
      value += `H:true;`;
    }
    value += ";";
    setQrCodeValue(value);
  }, [ssid, password, encryption, hidden]);

  const downloadQR = () => {
    const svg = document.getElementById("wifi-qr-code");
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = 1024;
      canvas.height = 1024;
      ctx?.drawImage(img, 0, 0, 1024, 1024);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `wifi-qr-${ssid}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
          <Wifi className="w-6 h-6" />
        </div>
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight">WiFi QR Code Generator</h1>
          <p className="text-sm text-muted-foreground">
            Generate a QR code for your WiFi network so guests can connect instantly.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Editor Side */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Network Name (SSID)</Label>
                  <Input 
                    value={ssid}
                    onChange={(e) => setSsid(e.target.value)}
                    placeholder="e.g. Home_Network"
                    className="h-12 rounded-xl bg-muted/30 border-border/40 font-bold"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Encryption</Label>
                  <div className="grid grid-cols-3 gap-2 p-1 bg-muted/50 rounded-xl border border-border/40">
                    {[
                      { id: "WPA", label: "WPA/WPA2" },
                      { id: "WEP", label: "WEP" },
                      { id: "nopass", label: "None" }
                    ].map((opt) => (
                      <Button
                        key={opt.id}
                        variant={encryption === opt.id ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setEncryption(opt.id)}
                        className={cn("rounded-lg font-bold h-9 text-[10px] uppercase", encryption === opt.id && "shadow-md")}
                      >
                        {opt.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {encryption !== "nopass" && (
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Password</Label>
                    <div className="relative">
                      <Input 
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="WiFi password..."
                        className="h-12 px-6 pr-12 rounded-xl bg-muted/30 border-border/40 font-mono"
                      />
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg text-muted-foreground"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 pt-2">
                  <input 
                    type="checkbox" 
                    id="hidden-ssid" 
                    checked={hidden}
                    onChange={(e) => setHidden(e.target.checked)}
                    className="w-4 h-4 rounded border-border/40 text-primary focus:ring-primary/20"
                  />
                  <Label htmlFor="hidden-ssid" className="text-xs font-bold cursor-pointer select-none">Hidden Network</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-primary">How it works</h3>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed italic">
              Modern smartphones can scan this QR code to join your network without typing anything. All data is kept in the QR code locally—no passwords are saved online.
            </p>
          </div>
        </div>

        {/* Preview Side */}
        <div className="lg:col-span-7 h-full flex flex-col gap-6">
          <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex-1 flex flex-col min-h-[500px]">
            <div className="px-8 py-6 border-b border-border/40 bg-primary/5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-primary">Scan to Connect</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Live Preview</span>
              </div>
            </div>
            
            <CardContent className="p-8 flex-1 flex flex-col items-center justify-center space-y-8 bg-primary/[0.01]">
              {qrValue ? (
                <div className="relative group p-8 bg-white rounded-3xl shadow-2xl transition-all hover:scale-105">
                  <QRCodeSVG 
                    id="wifi-qr-code"
                    value={qrValue} 
                    size={256}
                    level="H"
                    includeMargin={true}
                  />
                  <div className="absolute inset-0 border-2 border-primary/5 rounded-3xl pointer-events-none" />
                </div>
              ) : (
                <div className="w-64 h-64 rounded-[2rem] border-4 border-dashed border-border/40 flex flex-col items-center justify-center text-center p-8 gap-4">
                  <Wifi className="w-12 h-12 text-muted-foreground/20" />
                  <p className="text-xs text-muted-foreground/60 font-medium">Enter a network name to generate QR</p>
                </div>
              )}

              {qrValue && (
                <div className="flex gap-4 w-full max-w-sm animate-in fade-in slide-in-from-bottom-4">
                  <Button 
                    onClick={downloadQR}
                    className="flex-1 h-14 rounded-2xl text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Save Image
                  </Button>
                </div>
              )}
            </CardContent>

            {ssid && (
              <div className="px-8 py-4 bg-muted/30 border-t border-border/40 flex justify-center">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Network: <span className="text-foreground">{ssid}</span> 
                  {encryption !== 'nopass' && <span className="mx-2 opacity-30">|</span>}
                  {encryption !== 'nopass' && <>Security: <span className="text-foreground">{encryption}</span></>}
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
