"use client";

import React, { useState, useEffect } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Moon, Coins, Gem, TrendingUp, Wallet, Building2, HandCoins, RotateCcw, Info, CheckCircle2, AlertCircle, CircleDollarSign, ArrowRight, ShieldCheck, Globe, Lock } from "lucide-react";

export default function ZakatCalculator() {
  const [currency, setCurrency] = useState("USD");
  const [goldPrice, setGoldPrice] = useState("65");
  const [silverPrice, setSilverPrice] = useState("0.85");
  const [nisabType, setNisabType] = useState<"gold" | "silver">("silver");
  const [marketRates, setMarketRates] = useState<Record<string, { gold: string; silver: string }>>({});
  const [loadingRates, setLoadingRates] = useState(true);

  const [cash, setCash] = useState("");
  const [bankBalance, setBankBalance] = useState("");
  const [gold, setGold] = useState("");
  const [silver, setSilver] = useState("");
  const [investments, setInvestments] = useState("");
  const [businessAssets, setBusinessAssets] = useState("");
  const [otherAssets, setOtherAssets] = useState("");
  const [debts, setDebts] = useState("");
  const [loans, setLoans] = useState("");

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const [goldRes, silverRes, xrRes] = await Promise.all([
          fetch("https://api.gold-api.com/price/XAU/USD"),
          fetch("https://api.gold-api.com/price/XAG/USD"),
          fetch("https://open.er-api.com/v6/latest/USD"),
        ]);
        const goldData = await goldRes.json();
        const silverData = await silverRes.json();
        const xrData = await xrRes.json();

        if (goldData.price && silverData.price && xrData.rates) {
          const TROY_OZ_TO_GRAM = 31.1034768;
          const usdGoldPerGram = goldData.price / TROY_OZ_TO_GRAM;
          const usdSilverPerGram = silverData.price / TROY_OZ_TO_GRAM;

          const rates: Record<string, { gold: string; silver: string }> = {};

          Object.keys(xrData.rates).forEach((c) => {
            const rate = xrData.rates[c];
            rates[c] = {
              gold: (usdGoldPerGram * rate).toFixed(2),
              silver: (usdSilverPerGram * rate).toFixed(2),
            };
          });

          setMarketRates(rates);
          setLoadingRates(false);
        }
      } catch {
        setMarketRates({ USD: { gold: "137.00", silver: "2.10" }, EUR: { gold: "120.00", silver: "1.82" }, GBP: { gold: "102.00", silver: "1.57" }, PKR: { gold: "38000", silver: "582" }, INR: { gold: "11650", silver: "178" } });
        setLoadingRates(false);
      }
    };
    const detectCurrency = async () => {
      try { const res = await fetch("https://ipapi.co/currency/"); const detected = await res.text(); if (detected && detected.length === 3) setCurrency(detected); } catch { /* ignore */ }
    };
    fetchRates(); detectCurrency();
  }, []);

  useEffect(() => { if (marketRates[currency]) { setGoldPrice(marketRates[currency].gold.toString()); setSilverPrice(marketRates[currency].silver.toString()); } }, [currency, marketRates]);

  const getCurrencySymbol = (code: string) => { try { return (0).toLocaleString("en-US", { style: "currency", currency: code, minimumFractionDigits: 0, maximumFractionDigits: 0 }).replace(/\d/g, "").trim(); } catch { return code; } };
  const currentSymbol = getCurrencySymbol(currency);

  const getNisabThreshold = () => { const gp = parseFloat(goldPrice) || 0; const sp = parseFloat(silverPrice) || 0; return nisabType === "gold" ? 87.48 * gp : 612.36 * sp; };
  const getTotalAssets = () => {
    const goldVal = (parseFloat(gold) || 0) * (parseFloat(goldPrice) || 0);
    const silverVal = (parseFloat(silver) || 0) * (parseFloat(silverPrice) || 0);
    return (parseFloat(cash) || 0) + (parseFloat(bankBalance) || 0) + goldVal + silverVal + (parseFloat(investments) || 0) + (parseFloat(businessAssets) || 0) + (parseFloat(otherAssets) || 0);
  };
  const getTotalLiabilities = () => (parseFloat(debts) || 0) + (parseFloat(loans) || 0);

  const totalAssets = getTotalAssets();
  const totalLiabilities = getTotalLiabilities();
  const zakatableWealth = Math.max(0, totalAssets - totalLiabilities);
  const nisabThreshold = getNisabThreshold();
  const isZakatDue = zakatableWealth >= nisabThreshold;
  const zakatAmount = isZakatDue ? zakatableWealth * 0.025 : 0;

  const formatVal = (v: number) => `${currentSymbol} ${v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const handleReset = () => { setCash(""); setBankBalance(""); setGold(""); setSilver(""); setInvestments(""); setBusinessAssets(""); setOtherAssets(""); setDebts(""); setLoans(""); };

  return (
    <ToolLayout toolId="zakat-calculator">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 lg:order-last space-y-6">
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <Button onClick={handleReset} variant="outline" className="w-full h-12 border-border hover:bg-accent text-muted-foreground hover:text-foreground font-bold uppercase tracking-widest text-xs">
              <RotateCcw className="w-4 h-4 mr-2" /> Reset All Fields
            </Button>
          </div>
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">Market Rates</h3>
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Your Currency</label>
              {loadingRates ? <div className="h-12 w-full bg-muted rounded-xl animate-pulse" /> : (
                <div className="relative">
                  <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-xl focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all text-sm font-bold appearance-none cursor-pointer">
                    {Object.keys(marketRates).sort().map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Today's Prices (per gram)</label>
              <div className="space-y-2">
                <div className="relative"><input type="number" value={goldPrice} onChange={(e) => setGoldPrice(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-xl text-sm font-mono font-bold focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all" placeholder="Gold Price" /><Gem className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500" /><span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">GOLD</span></div>
                <div className="relative"><input type="number" value={silverPrice} onChange={(e) => setSilverPrice(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-xl text-sm font-mono font-bold focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all" placeholder="Silver Price" /><Coins className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">SILVER</span></div>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">Settings</h3>
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Your Threshold</label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-muted rounded-xl">
                {["silver", "gold"].map((type) => (
                  <button key={type} onClick={() => setNisabType(type as any)} className={`py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${nisabType === type ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>{type}</button>
                ))}
              </div>
              <div className="flex items-center justify-between pt-2 px-1"><span className="text-[11px] text-muted-foreground">Current Threshold:</span><span className="text-sm font-mono font-bold text-foreground">{formatVal(nisabThreshold)}</span></div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 items-start">
            <section className="bg-card border border-border rounded-3xl p-6 shadow-sm relative overflow-hidden">
              <div className="flex items-center gap-3 mb-4 border-b border-border pb-4">
                <div className="p-2 bg-emerald-100 rounded-xl"><Wallet className="w-5 h-5 text-emerald-600" /></div>
                <div><h3 className="text-lg font-black text-foreground">What You Own</h3><p className="text-xs text-muted-foreground font-medium">Wealth held for a full year.</p></div>
                <div className="ml-auto text-right"><p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Your Assets</p><p className="text-lg font-black text-emerald-600 tabular-nums">{formatVal(totalAssets)}</p></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AssetInput label="Cash on Hand" value={cash} onChange={setCash} icon={<CircleDollarSign className="w-3.5 h-3.5" />} symbol={currentSymbol} placeholder="0" />
                <AssetInput label="Bank Balances" value={bankBalance} onChange={setBankBalance} icon={<Building2 className="w-3.5 h-3.5" />} symbol={currentSymbol} placeholder="0" />
                <AssetInput label="Investments" value={investments} onChange={setInvestments} icon={<TrendingUp className="w-3.5 h-3.5" />} symbol={currentSymbol} placeholder="0" />
                <AssetInput label="Other Assets" value={otherAssets} onChange={setOtherAssets} icon={<ArrowRight className="w-3.5 h-3.5" />} symbol={currentSymbol} placeholder="0" />
                <div className="col-span-full h-px bg-muted my-1" />
                <AssetInput label="Gold (g)" value={gold} onChange={setGold} icon={<Gem className="w-3.5 h-3.5" />} suffix="g" subLabel={gold ? `≈ ${formatVal((parseFloat(gold) || 0) * (parseFloat(goldPrice) || 0))}` : undefined} placeholder="0" />
                <AssetInput label="Silver (g)" value={silver} onChange={setSilver} icon={<Coins className="w-3.5 h-3.5" />} suffix="g" subLabel={silver ? `≈ ${formatVal((parseFloat(silver) || 0) * (parseFloat(silverPrice) || 0))}` : undefined} placeholder="0" />
              </div>
            </section>
            <div className="space-y-4">
              <section className="bg-card border border-border rounded-3xl p-6 shadow-sm relative overflow-hidden">
                <div className="flex items-center gap-3 mb-4 border-b border-border pb-4">
                  <div className="p-2 bg-rose-100 rounded-xl"><HandCoins className="w-5 h-5 text-rose-600" /></div>
                  <div><h3 className="text-lg font-black text-foreground">What You Owe</h3><p className="text-xs text-muted-foreground font-medium">Money you need to pay back.</p></div>
                  <div className="ml-auto text-right"><p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Your Debts</p><p className="text-lg font-black text-rose-600 tabular-nums">{formatVal(totalLiabilities)}</p></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <AssetInput label="Debts Payable" value={debts} onChange={setDebts} icon={<AlertCircle className="w-3.5 h-3.5" />} symbol={currentSymbol} theme="rose" placeholder="0" />
                  <AssetInput label="Short-term Loans" value={loans} onChange={setLoans} icon={<HandCoins className="w-3.5 h-3.5" />} symbol={currentSymbol} theme="rose" placeholder="0" />
                </div>
              </section>
              <div className="flex items-center justify-center gap-2 text-muted-foreground opacity-60 py-2"><Lock className="w-3 h-3" /><p className="text-[10px] font-medium uppercase tracking-widest">Privacy First</p></div>
            </div>
          </div>

          <div className={`rounded-[2rem] p-6 text-primary-foreground shadow-xl relative overflow-hidden transition-all duration-500 ${isZakatDue ? "bg-gradient-to-br from-emerald-600 to-teal-700" : "bg-gradient-to-br from-slate-700 to-slate-800"}`}>
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none"><HandCoins className="w-64 h-64 -mr-16 -mt-16" /></div>
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-xs font-bold opacity-70 uppercase tracking-widest">Zakat to Pay</p>
                  <div className="text-5xl sm:text-6xl font-black tracking-tight tabular-nums">{isZakatDue ? formatVal(zakatAmount) : formatVal(0)}</div>
                </div>
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold backdrop-blur-md transition-colors ${isZakatDue ? "bg-emerald-500/20 border border-emerald-400/30 text-emerald-50" : "bg-card/5 border border-white/10 text-muted-foreground"}`}>
                  {isZakatDue ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}{isZakatDue ? "Zakat is due" : "No zakat due"}
                </div>
              </div>
              <div className="bg-black/20 rounded-2xl p-5 backdrop-blur-md border border-white/10 space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-baseline"><span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Net Wealth</span><span className="text-xl font-black tabular-nums">{formatVal(zakatableWealth)}</span></div>
                  <div className="h-1.5 bg-card/10 rounded-full overflow-hidden">
                    <div className={`h-full ${isZakatDue ? "bg-emerald-400" : "bg-muted"}`} style={{ width: `${Math.min(100, (zakatableWealth / (Math.max(zakatableWealth, nisabThreshold) * 1.5)) * 100)}%` }} />
                  </div>
                  <div className="flex justify-between items-center text-[10px] opacity-50 font-medium"><span>0</span><span>Threshold: {formatVal(nisabThreshold)}</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}

function AssetInput({ label, value, onChange, icon, symbol, suffix, subLabel, theme = "emerald", placeholder }: { label: string; value: string; onChange: (v: string) => void; icon: React.ReactNode; symbol?: string; suffix?: string; subLabel?: string; theme?: "emerald" | "rose"; placeholder?: string }) {
  return (
    <div className="space-y-1 group">
      <label className="text-[10px] font-bold text-muted-foreground flex items-center gap-2 ml-1 uppercase tracking-wider scale-95 origin-left group-hover:text-foreground transition-colors">{icon}{label}</label>
      <div className="relative transition-all duration-300 group-focus-within:scale-[1.01]">
        {symbol && <span className={`absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold ${theme === "rose" ? "text-rose-400" : "text-emerald-500"}`}>{symbol}</span>}
        <input type="number" value={value} onChange={(e) => onChange(e.target.value)} className={`w-full ${symbol ? "pl-14" : "pl-4"} pr-12 py-2.5 bg-muted border border-border rounded-xl outline-none transition-all focus:bg-card focus:ring-4 ${theme === "rose" ? "focus:ring-rose-500/10 focus:border-rose-200" : "focus:ring-emerald-500/10 focus:border-emerald-200"} text-sm font-bold font-mono text-foreground placeholder:text-muted-foreground shadow-sm`} placeholder={placeholder} />
        {suffix && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-muted-foreground uppercase">{suffix}</span>}
      </div>
      {subLabel && <p className="text-[10px] text-muted-foreground ml-2 font-medium">{subLabel}</p>}
    </div>
  );
}
