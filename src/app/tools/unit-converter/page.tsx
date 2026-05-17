"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const conversions = {
  length: {
    base: "m",
    units: {
      m: { name: "Meters", factor: 1 },
      km: { name: "Kilometers", factor: 1000 },
      cm: { name: "Centimeters", factor: 0.01 },
      mm: { name: "Millimeters", factor: 0.001 },
      mi: { name: "Miles", factor: 1609.344 },
      yd: { name: "Yards", factor: 0.9144 },
      ft: { name: "Feet", factor: 0.3048 },
      in: { name: "Inches", factor: 0.0254 },
    },
  },
  weight: {
    base: "kg",
    units: {
      kg: { name: "Kilograms", factor: 1 },
      g: { name: "Grams", factor: 0.001 },
      mg: { name: "Milligrams", factor: 0.000001 },
      lb: { name: "Pounds", factor: 0.453592 },
      oz: { name: "Ounces", factor: 0.0283495 },
    },
  },
  temperature: {
    base: "c",
    units: {
      c: { name: "Celsius", factor: 1 },
      f: { name: "Fahrenheit", factor: 1 },
      k: { name: "Kelvin", factor: 1 },
    },
  },
  data: {
    base: "b",
    units: {
      b: { name: "Bytes", factor: 1 },
      kb: { name: "Kilobytes", factor: 1024 },
      mb: { name: "Megabytes", factor: 1048576 },
      gb: { name: "Gigabytes", factor: 1073741824 },
      tb: { name: "Terabytes", factor: 1099511627776 },
    },
  },
};

export default function UnitConverter() {
  const [category, setCategory] = useState<keyof typeof conversions>("length");
  const [value, setValue] = useState("");
  const [fromUnit, setFromUnit] = useState("m");
  const [toUnit, setToUnit] = useState("km");

  const currentConversions = conversions[category];
  const units = currentConversions.units;

  const convert = (val: string, from: string, to: string): string => {
    const num = parseFloat(val);
    if (isNaN(num)) return "";

    if (category === "temperature") {
      if (from === to) return val;
      let celsius: number;
      
      // Convert to Celsius first
      if (from === "c") {
        celsius = num;
      } else if (from === "f") {
        celsius = (num - 32) * (5 / 9);
      } else {
        celsius = num - 273.15;
      }
      
      // Convert from Celsius to target
      if (to === "c") {
        return celsius.toFixed(4);
      } else if (to === "f") {
        return ((celsius * 9 / 5) + 32).toFixed(4);
      } else {
        return (celsius + 273.15).toFixed(4);
      }
    }

    const fromFactor = (units as any)[from].factor;
    const toFactor = (units as any)[to].factor;
    const baseValue = num * fromFactor;
    const result = baseValue / toFactor;
    
    return result.toFixed(6);
  };

  const result = convert(value, fromUnit, toUnit);

  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const handleCategoryChange = (newCategory: keyof typeof conversions) => {
    setCategory(newCategory);
    const newUnits = conversions[newCategory].units;
    const unitKeys = Object.keys(newUnits);
    setFromUnit(unitKeys[0]);
    setToUnit(unitKeys[1]);
    setValue("");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Unit Converter</h1>
        <p className="text-muted-foreground">Convert between different units</p>
      </div>

      <div className="max-w-2xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Conversion Type</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={category} onValueChange={handleCategoryChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="length">Length</SelectItem>
                <SelectItem value="weight">Weight</SelectItem>
                <SelectItem value="temperature">Temperature</SelectItem>
                <SelectItem value="data">Data</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Convert</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="value">Value</Label>
              <Input
                id="value"
                type="number"
                placeholder="Enter value"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="mt-2"
              />
            </div>

            <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-center">
              <div>
                <Label htmlFor="from">From</Label>
                <Select value={fromUnit} onValueChange={setFromUnit}>
                  <SelectTrigger id="from">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(units).map(([key, unit]) => (
                      <SelectItem key={key} value={key}>
                        {unit.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={swapUnits} variant="outline" size="icon" className="mt-6">
                ⇄
              </Button>

              <div>
                <Label htmlFor="to">To</Label>
                <Select value={toUnit} onValueChange={setToUnit}>
                  <SelectTrigger id="to">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(units).map(([key, unit]) => (
                      <SelectItem key={key} value={key}>
                        {unit.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {result && (
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Result</div>
                <div className="text-3xl font-bold">
                  {result} {(units as any)[toUnit].name}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
