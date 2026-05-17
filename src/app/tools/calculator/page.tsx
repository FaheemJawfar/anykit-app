"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Calculator() {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

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
      case "+":
        return firstValue + secondValue;
      case "-":
        return firstValue - secondValue;
      case "×":
        return firstValue * secondValue;
      case "÷":
        return firstValue / secondValue;
      default:
        return secondValue;
    }
  };

  const handleEqual = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const prevValue = parseFloat(previousValue);
      const newValue = calculate(prevValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  const buttons = [
    { label: "C", onClick: clear, variant: "destructive" as const, span: 1 },
    { label: "±", onClick: () => setDisplay(String(parseFloat(display) * -1)), variant: "outline" as const, span: 1 },
    { label: "%", onClick: () => setDisplay(String(parseFloat(display) / 100)), variant: "outline" as const, span: 1 },
    { label: "÷", onClick: () => performOperation("÷"), variant: "default" as const, span: 1 },
    { label: "7", onClick: () => inputDigit("7"), variant: "outline" as const, span: 1 },
    { label: "8", onClick: () => inputDigit("8"), variant: "outline" as const, span: 1 },
    { label: "9", onClick: () => inputDigit("9"), variant: "outline" as const, span: 1 },
    { label: "×", onClick: () => performOperation("×"), variant: "default" as const, span: 1 },
    { label: "4", onClick: () => inputDigit("4"), variant: "outline" as const, span: 1 },
    { label: "5", onClick: () => inputDigit("5"), variant: "outline" as const, span: 1 },
    { label: "6", onClick: () => inputDigit("6"), variant: "outline" as const, span: 1 },
    { label: "-", onClick: () => performOperation("-"), variant: "default" as const, span: 1 },
    { label: "1", onClick: () => inputDigit("1"), variant: "outline" as const, span: 1 },
    { label: "2", onClick: () => inputDigit("2"), variant: "outline" as const, span: 1 },
    { label: "3", onClick: () => inputDigit("3"), variant: "outline" as const, span: 1 },
    { label: "+", onClick: () => performOperation("+"), variant: "default" as const, span: 1 },
    { label: "0", onClick: () => inputDigit("0"), variant: "outline" as const, span: 2 },
    { label: ".", onClick: inputDecimal, variant: "outline" as const, span: 1 },
    { label: "=", onClick: handleEqual, variant: "default" as const, span: 1 },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Calculator</h1>
        <p className="text-muted-foreground">Simple and scientific calculator</p>
      </div>

      <Card className="max-w-sm mx-auto">
        <CardHeader>
          <CardTitle>Calculator</CardTitle>
          <CardDescription>Perform calculations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-4 mb-4 rounded-lg">
            <div className="text-right text-3xl font-mono font-bold overflow-hidden">
              {display}
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {buttons.map((button) => (
              <Button
                key={button.label}
                variant={button.variant}
                onClick={button.onClick}
                className={button.span === 2 ? "col-span-2" : ""}
              >
                {button.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
