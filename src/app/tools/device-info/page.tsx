"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Monitor, 
  Smartphone, 
  Cpu, 
  Globe, 
  Zap,
  Info,
  Maximize2,
  Battery,
  Wifi,
  Navigation,
  Languages,
  MousePointer2,
  HardDrive,
  RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function DeviceInformation() {
  const [info, setInfo] = useState<any>(null);

  useEffect(() => {
    const updateInfo = () => {
      setInfo({
        screen: {
          resolution: `${window.screen.width} x ${window.screen.height}`,
          available: `${window.screen.availWidth} x ${window.screen.availHeight}`,
          colorDepth: `${window.screen.colorDepth}-bit`,
          pixelRatio: window.devicePixelRatio,
          orientation: window.screen.orientation?.type || "N/A"
        },
        browser: {
          vendor: navigator.vendor,
          language: navigator.language,
          cookies: navigator.cookieEnabled ? "Enabled" : "Disabled",
          online: navigator.onLine ? "Yes" : "No",
          doNotTrack: navigator.doNotTrack === "1" ? "Yes" : "No",
          platform: (navigator as any).platform || "N/A"
        },
        hardware: {
          cores: navigator.hardwareConcurrency || "N/A",
          memory: (navigator as any).deviceMemory ? `${(navigator as any).deviceMemory} GB` : "N/A",
          maxTouchPoints: navigator.maxTouchPoints
        }
      });
    };

    updateInfo();
    window.addEventListener("resize", updateInfo);
    return () => window.removeEventListener("resize", updateInfo);
  }, []);

  const InfoCard = ({ title, icon: Icon, data }: { title: string, icon: any, data: any }) => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-primary" />
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{title}</span>
      </div>
      <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden transition-all hover:shadow-2xl hover:shadow-primary/10">
        <CardContent className="p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6">
            {Object.entries(data).map(([key, value]) => (
              <div key={key} className="space-y-1">
                <p className="text-[10px] font-bold uppercase text-muted-foreground/60 tracking-wider">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </p>
                <p className="text-lg font-bold truncate">{String(value)}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
          <Monitor className="w-6 h-6" />
        </div>
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight">Device Information</h1>
          <p className="text-sm text-muted-foreground">
            A comprehensive breakdown of your hardware, screen, and browser capabilities.
          </p>
        </div>
      </div>

      {!info ? (
        <div className="h-96 flex items-center justify-center">
          <RefreshCw className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <InfoCard title="Screen & Display" icon={Maximize2} data={info.screen} />
            <InfoCard title="Hardware Specs" icon={Cpu} data={info.hardware} />
          </div>
          
          <InfoCard title="Browser Capabilities" icon={Globe} data={info.browser} />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
            {[
              { label: "Battery Status", icon: Battery, value: "Web API Required" },
              { label: "Connection", icon: Wifi, value: info.browser.online === "Yes" ? "Online" : "Offline" },
              { label: "Navigation", icon: Navigation, value: "HTTPS Only" },
              { label: "Language", icon: Languages, value: info.browser.language }
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-3xl bg-muted/20 border border-border/40 flex flex-col items-center justify-center text-center gap-3">
                <item.icon className="w-6 h-6 text-primary/40" />
                <div>
                  <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">{item.label}</p>
                  <p className="text-sm font-bold">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="p-8 rounded-[2.5rem] bg-primary/5 border border-primary/10 flex items-start gap-6">
        <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
          <Zap className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-primary">Privacy Note</h3>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
            This information is retrieved using standard Web APIs available to any website you visit. It helps developers optimize layouts and features for your specific hardware. No data is collected or sent to our servers.
          </p>
        </div>
      </div>
    </div>
  );
}
