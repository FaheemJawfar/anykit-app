"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Copy, Check, Clock } from "lucide-react";

export default function TimestampConverter() {
  const [unixTimestamp, setUnixTimestamp] = useState("");
  const [isoDate, setIsoDate] = useState("");
  const [copied, setCopied] = useState(false);

  const convertToIso = () => {
    const timestamp = parseInt(unixTimestamp);
    if (isNaN(timestamp)) {
      setIsoDate("Invalid timestamp");
      return;
    }
    const date = new Date(timestamp * 1000);
    setIsoDate(date.toISOString());
  };

  const convertToUnix = () => {
    const date = new Date(isoDate);
    if (isNaN(date.getTime())) {
      setUnixTimestamp("Invalid date");
      return;
    }
    setUnixTimestamp(String(Math.floor(date.getTime() / 1000)));
  };

  const getCurrentTimestamp = () => {
    const now = Math.floor(Date.now() / 1000);
    setUnixTimestamp(String(now));
    convertToIso();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Timestamp Converter</h1>
        <p className="text-muted-foreground">Convert Unix timestamps to readable dates</p>
      </div>

      <div className="max-w-2xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Unix to ISO Date</CardTitle>
            <CardDescription>Convert Unix timestamp to ISO 8601 format</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="unix">Unix Timestamp</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="unix"
                  placeholder="e.g., 1715956800"
                  value={unixTimestamp}
                  onChange={(e) => setUnixTimestamp(e.target.value)}
                />
                <Button onClick={getCurrentTimestamp} variant="outline" size="icon">
                  <Clock className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <Button onClick={convertToIso} className="w-full">
              Convert to ISO Date
            </Button>
            {isoDate && (
              <div>
                <Label>ISO Date</Label>
                <div className="flex gap-2 mt-2">
                  <Input readOnly value={isoDate} />
                  <Button
                    onClick={() => copyToClipboard(isoDate)}
                    variant="outline"
                    size="icon"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ISO Date to Unix</CardTitle>
            <CardDescription>Convert ISO 8601 date to Unix timestamp</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="iso">ISO Date</Label>
              <Input
                id="iso"
                placeholder="e.g., 2024-05-17T10:00:00.000Z"
                value={isoDate}
                onChange={(e) => setIsoDate(e.target.value)}
                className="mt-2"
              />
            </div>
            <Button onClick={convertToUnix} className="w-full">
              Convert to Unix Timestamp
            </Button>
            {unixTimestamp && (
              <div>
                <Label>Unix Timestamp</Label>
                <div className="flex gap-2 mt-2">
                  <Input readOnly value={unixTimestamp} />
                  <Button
                    onClick={() => copyToClipboard(unixTimestamp)}
                    variant="outline"
                    size="icon"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
