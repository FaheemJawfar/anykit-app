"use client";

import { ToolLayout } from "@/components/tool-layout";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Calculator as CalcIcon, 
  History, 
  Divide, 
  X, 
  Minus, 
  Plus, 
  Equal,
  Delete
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Calculator() {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [history, setHistory] = useState<{ expression: string; result: string }[]>([]);

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === "0" ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
    } else if (display.indexOf(".") === -1) {
      setDisplay(display + ".");
    }
  };

  const clear = () => {
    setDisplay("0");
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const deleteLast = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay("0");
    }
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(String(inputValue));
    } else if (operation) {
      const currentValue = parseFloat(previousValue) || 0;
      const newValue = calculate(currentValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(String(newValue));
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string) => {
    switch (operation) {
      case "+": return firstValue + secondValue;
      case "-": return firstValue - secondValue;
      case "×": return firstValue * secondValue;
      case "÷": return firstValue / secondValue;
      default: return secondValue;
    }
  };

  const handleEqual = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const prevValue = parseFloat(previousValue);
      const newValue = calculate(prevValue, inputValue, operation);
      const expression = `${prevValue} ${operation} ${inputValue} =`;
      const result = String(newValue);
      
      setHistory(prev => [{ expression, result }, ...prev].slice(0, 5));
      setDisplay(result);
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  const buttons = [
    { label: "AC", onClick: clear, type: "action", className: "text-red-500" },
    { label: "DEL", onClick: deleteLast, type: "action", icon: Delete },
    { label: "%", onClick: () => setDisplay(String(parseFloat(display) / 100)), type: "action" },
    { label: "÷", onClick: () => performOperation("÷"), type: "operator", icon: Divide },
    { label: "7", onClick: () => inputDigit("7"), type: "number" },
    { label: "8", onClick: () => inputDigit("8"), type: "number" },
    { label: "9", onClick: () => inputDigit("9"), type: "number" },
    { label: "×", onClick: () => performOperation("×"), type: "operator", icon: X },
    { label: "4", onClick: () => inputDigit("4"), type: "number" },
    { label: "5", onClick: () => inputDigit("5"), type: "number" },
    { label: "6", onClick: () => inputDigit("6"), type: "number" },
    { label: "-", onClick: () => performOperation("-"), type: "operator", icon: Minus },
    { label: "1", onClick: () => inputDigit("1"), type: "number" },
    { label: "2", onClick: () => inputDigit("2"), type: "number" },
    { label: "3", onClick: () => inputDigit("3"), type: "number" },
    { label: "+", onClick: () => performOperation("+"), type: "operator", icon: Plus },
    { label: "0", onClick: () => inputDigit("0"), type: "number", span: 2 },
    { label: ".", onClick: inputDecimal, type: "number" },
    { label: "=", onClick: handleEqual, type: "operator", icon: Equal, className: "bg-primary text-primary-foreground hover:bg-primary/90" },
  ];

  return (
    <ToolLayout toolId="calculator">

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        <div className="md:col-span-7 flex justify-center">
          <Card className="w-full max-w-sm border-border/40 shadow-2xl shadow-primary/10 bg-card/40 backdrop-blur-xl rounded-[2.5rem] overflow-hidden p-6 space-y-6">
            <div className="bg-muted/30 rounded-[2rem] p-6 space-y-1">
              <div className="text-right h-6 text-xs font-mono text-muted-foreground/60 overflow-hidden truncate">
                {previousValue} {operation}
              </div>
              <div className="text-right text-5xl font-mono font-bold tracking-tighter overflow-hidden truncate">
                {display}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {buttons.map((btn, i) => (
                <Button
                  key={i}
                  variant="ghost"
                  onClick={btn.onClick}
                  className={cn(
                    "h-16 rounded-2xl text-lg font-bold transition-all active:scale-90",
                    btn.span === 2 ? "col-span-2" : "col-span-1",
                    btn.type === "number" && "bg-muted/20 hover:bg-muted/40",
                    btn.type === "action" && "bg-primary/5 text-primary hover:bg-primary/10",
                    btn.type === "operator" && !btn.className && "bg-muted/40 hover:bg-muted/60 text-primary",
                    btn.className
                  )}
                >
                  {btn.icon ? <btn.icon className="w-5 h-5" /> : btn.label}
                </Button>
              ))}
            </div>
          </Card>
        </div>

        <div className="md:col-span-5 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center gap-2">
              <History className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Calculation History</span>
            </div>
            <CardContent className="p-6">
              {history.length > 0 ? (
                <div className="space-y-4">
                  {history.map((item, i) => (
                    <div key={i} className="flex flex-col items-end border-b border-border/40 pb-3 last:border-0 last:pb-0">
                      <span className="text-[10px] font-mono text-muted-foreground">{item.expression}</span>
                      <span className="text-lg font-mono font-bold text-primary">{item.result}</span>
                    </div>
                  ))}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full text-[10px] uppercase font-bold text-muted-foreground hover:text-red-500"
                    onClick={() => setHistory([])}
                  >
                    Clear History
                  </Button>
                </div>
              ) : (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-3 opacity-20">
                  <History className="w-12 h-12" />
                  <p className="text-sm font-medium">No history yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="bg-primary/5 rounded-3xl p-6 border border-primary/10 space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-primary">Keyboard Shortcuts</h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-[10px] font-mono text-muted-foreground">
              <div className="flex justify-between"><span>Numbers</span><span>0-9</span></div>
              <div className="flex justify-between"><span>Equals</span><span>Enter</span></div>
              <div className="flex justify-between"><span>Clear</span><span>Esc</span></div>
              <div className="flex justify-between"><span>Operators</span><span>+ - * /</span></div>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}

