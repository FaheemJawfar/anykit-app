"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function PercentageCalculator() {
  const [mode, setMode] = useState("what-is");
  const [value1, setValue1] = useState("");
  const [value2, setValue2] = useState("");
  const [result, setResult] = useState("");

  const calculate = () => {
    const v1 = parseFloat(value1);
    const v2 = parseFloat(value2);

    if (isNaN(v1) || isNaN(v2)) {
      setResult("Please enter valid numbers");
      return;
    }

    switch (mode) {
      case "what-is":
        setResult(`${v1}% of ${v2} = ${(v1 / 100) * v2}`);
        break;
      case "what-percent":
        setResult(`${v1} is ${((v1 / v2) * 100).toFixed(2)}% of ${v2}`);
        break;
      case "increase":
        setResult(`${v1} increased by ${v2}% = ${v1 + (v1 * v2 / 100)}`);
        break;
      case "decrease":
        setResult(`${v1} decreased by ${v2}% = ${v1 - (v1 * v2 / 100)}`);
        break;
    }
  };

  const clear = () => {
    setValue1("");
    setValue2("");
    setResult("");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Percentage Calculator</h1>
        <p className="text-muted-foreground">Calculate percentages easily</p>
      </div>

      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Calculate</CardTitle>
            <CardDescription>Choose a calculation type</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={mode} onValueChange={(v: string) => { setMode(v); clear(); }} className="w-full">
              <TabsList className="grid grid-cols-2 w-full mb-6">
                <TabsTrigger value="what-is">What is X% of Y?</TabsTrigger>
                <TabsTrigger value="what-percent">X is what % of Y?</TabsTrigger>
                <TabsTrigger value="increase">Increase by %</TabsTrigger>
                <TabsTrigger value="decrease">Decrease by %</TabsTrigger>
              </TabsList>

              <TabsContent value="what-is" className="space-y-4">
                <div>
                  <Label htmlFor="percent1">What is</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Input
                      id="percent1"
                      type="number"
                      placeholder="Enter percentage"
                      value={value1}
                      onChange={(e) => setValue1(e.target.value)}
                    />
                    <span>% of</span>
                  </div>
                </div>
                <div>
                  <Label htmlFor="value1">Value</Label>
                  <Input
                    id="value1"
                    type="number"
                    placeholder="Enter value"
                    value={value2}
                    onChange={(e) => setValue2(e.target.value)}
                    className="mt-2"
                  />
                </div>
              </TabsContent>

              <TabsContent value="what-percent" className="space-y-4">
                <div>
                  <Label htmlFor="value2">Value</Label>
                  <Input
                    id="value2"
                    type="number"
                    placeholder="Enter value"
                    value={value1}
                    onChange={(e) => setValue1(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="total1">is what % of</Label>
                  <Input
                    id="total1"
                    type="number"
                    placeholder="Enter total"
                    value={value2}
                    onChange={(e) => setValue2(e.target.value)}
                    className="mt-2"
                  />
                </div>
              </TabsContent>

              <TabsContent value="increase" className="space-y-4">
                <div>
                  <Label htmlFor="value3">Value</Label>
                  <Input
                    id="value3"
                    type="number"
                    placeholder="Enter value"
                    value={value1}
                    onChange={(e) => setValue1(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="percent2">Increase by</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Input
                      id="percent2"
                      type="number"
                      placeholder="Enter percentage"
                      value={value2}
                      onChange={(e) => setValue2(e.target.value)}
                    />
                    <span>%</span>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="decrease" className="space-y-4">
                <div>
                  <Label htmlFor="value4">Value</Label>
                  <Input
                    id="value4"
                    type="number"
                    placeholder="Enter value"
                    value={value1}
                    onChange={(e) => setValue1(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="percent3">Decrease by</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Input
                      id="percent3"
                      type="number"
                      placeholder="Enter percentage"
                      value={value2}
                      onChange={(e) => setValue2(e.target.value)}
                    />
                    <span>%</span>
                  </div>
                </div>
              </TabsContent>

              <div className="flex gap-2 mt-6">
                <Button onClick={calculate} className="flex-1">
                  Calculate
                </Button>
                <Button onClick={clear} variant="outline">
                  Clear
                </Button>
              </div>

              {result && (
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Result</div>
                  <div className="text-2xl font-bold">{result}</div>
                </div>
              )}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
