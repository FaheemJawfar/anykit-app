"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Shield, 
  Copy, 
  Check, 
  Terminal,
  Lock,
  Unlock,
  User,
  Users,
  Globe,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";

type Permission = 'read' | 'write' | 'execute';
type Entity = 'owner' | 'group' | 'public';

export default function ChmodCalculator() {
  const [permissions, setPermissions] = useState({
    owner: { read: true, write: true, execute: false },
    group: { read: true, write: false, execute: false },
    public: { read: true, write: false, execute: false },
  });
  const [octal, setOctal] = useState("644");
  const [symbolic, setSymbolic] = useState("-rw-r--r--");
  const [copied, setCopied] = useState<string | null>(null);

  const calculateFromPermissions = () => {
    let octalVal = "";
    let symbolicVal = "-";

    const entities: Entity[] = ['owner', 'group', 'public'];
    entities.forEach((entity) => {
      let val = 0;
      if (permissions[entity].read) {
        val += 4;
        symbolicVal += "r";
      } else symbolicVal += "-";
      
      if (permissions[entity].write) {
        val += 2;
        symbolicVal += "w";
      } else symbolicVal += "-";
      
      if (permissions[entity].execute) {
        val += 1;
        symbolicVal += "x";
      } else symbolicVal += "-";
      
      octalVal += val.toString();
    });

    setOctal(octalVal);
    setSymbolic(symbolicVal);
  };

  const handleCheckboxChange = (entity: Entity, permission: Permission, checked: boolean) => {
    setPermissions((prev) => ({
      ...prev,
      [entity]: {
        ...prev[entity],
        [permission]: checked,
      },
    }));
  };

  const handleOctalChange = (val: string) => {
    if (!/^[0-7]{0,3}$/.test(val)) return;
    setOctal(val);
    
    if (val.length === 3) {
      const newPerms = { ...permissions };
      const entities: Entity[] = ['owner', 'group', 'public'];
      
      val.split('').forEach((digit, index) => {
        const num = parseInt(digit);
        const entity = entities[index];
        newPerms[entity] = {
          read: (num & 4) !== 0,
          write: (num & 2) !== 0,
          execute: (num & 1) !== 0,
        };
      });
      setPermissions(newPerms);
    }
  };

  useEffect(() => {
    calculateFromPermissions();
  }, [permissions]);

  const copy = (val: string, id: string) => {
    navigator.clipboard.writeText(val);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const PermissionRow = ({ entity, label, icon: Icon }: { entity: Entity, label: string, icon: any }) => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-primary" />
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {(['read', 'write', 'execute'] as Permission[]).map((p) => (
          <div 
            key={p}
            onClick={() => handleCheckboxChange(entity, p, !permissions[entity][p])}
            className={cn(
              "flex flex-col items-center justify-center p-4 rounded-2xl border transition-all cursor-pointer group",
              permissions[entity][p] 
                ? "bg-primary/10 border-primary/30 text-primary shadow-inner" 
                : "bg-muted/30 border-border/40 text-muted-foreground hover:bg-muted/50"
            )}
          >
            <span className="text-sm font-bold capitalize mb-1">{p}</span>
            <span className="text-[10px] font-mono opacity-60">
              {p === 'read' ? '4' : p === 'write' ? '2' : '1'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
          <Shield className="w-6 h-6" />
        </div>
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight">Chmod Calculator</h1>
          <p className="text-sm text-muted-foreground">
            Calculate Linux file permissions in octal and symbolic formats.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Permission Grid */}
        <div className="lg:col-span-8">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 space-y-10">
              <PermissionRow entity="owner" label="Owner (u)" icon={User} />
              <PermissionRow entity="group" label="Group (g)" icon={Users} />
              <PermissionRow entity="public" label="Public (o)" icon={Globe} />
            </CardContent>
          </Card>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center gap-3">
              <Terminal className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Permission Codes</span>
            </div>
            <CardContent className="p-8 space-y-8">
              <div className="space-y-4">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Octal Format</Label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={octal}
                    onChange={(e) => handleOctalChange(e.target.value)}
                    className="h-16 px-6 rounded-2xl bg-primary/5 border border-primary/10 text-3xl font-mono font-bold text-primary flex-1 focus:outline-none focus:ring-2 focus:ring-primary/20 text-center"
                    maxLength={3}
                  />
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => copy(octal, 'octal')}
                    className="h-16 w-16 rounded-2xl border-border/40"
                  >
                    {copied === 'octal' ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Symbolic Format</Label>
                <div className="flex gap-2">
                  <div className="h-16 px-6 rounded-2xl bg-muted/30 border border-border/40 flex items-center justify-center flex-1">
                    <span className="text-xl font-mono font-bold text-foreground/70">{symbolic}</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => copy(symbolic, 'symbolic')}
                    className="h-16 w-16 rounded-2xl border-border/40"
                  >
                    {copied === 'symbolic' ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                  </Button>
                </div>
              </div>

              <div className="pt-4 space-y-4">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Example Command</Label>
                <div className="p-4 rounded-xl bg-muted/50 border border-border/40 font-mono text-[11px] break-all">
                  chmod {octal} filename
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-4">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-primary">Quick Legend</h3>
            </div>
            <div className="grid grid-cols-3 gap-2 text-[10px] text-muted-foreground font-mono">
              <div className="flex flex-col"><span className="font-bold text-primary">4</span> Read</div>
              <div className="flex flex-col"><span className="font-bold text-primary">2</span> Write</div>
              <div className="flex flex-col"><span className="font-bold text-primary">1</span> Execute</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
