"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function TextDiff() {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [diff, setDiff] = useState<React.ReactNode[]>([]);

  const computeDiff = () => {
    const lines1 = text1.split("\n");
    const lines2 = text2.split("\n");
    const result: React.ReactNode[] = [];

    let i = 0;
    let j = 0;

    while (i < lines1.length || j < lines2.length) {
      if (i < lines1.length && j < lines2.length && lines1[i] === lines2[j]) {
        result.push(
          <div key={`${i}-${j}`} className="py-1 px-2 bg-muted/50">
            {lines1[i]}
          </div>
        );
        i++;
        j++;
      } else if (i < lines1.length && (j >= lines2.length || !lines2.includes(lines1[i]))) {
        result.push(
          <div key={`del-${i}`} className="py-1 px-2 bg-red-100 dark:bg-red-900/30 text-red-900 dark:text-red-100">
            - {lines1[i]}
          </div>
        );
        i++;
      } else if (j < lines2.length && (i >= lines1.length || !lines1.includes(lines2[j]))) {
        result.push(
          <div key={`add-${j}`} className="py-1 px-2 bg-green-100 dark:bg-green-900/30 text-green-900 dark:text-green-100">
            + {lines2[j]}
          </div>
        );
        j++;
      } else {
        result.push(
          <div key={`${i}-${j}`} className="py-1 px-2 bg-muted/50">
            {lines1[i]}
          </div>
        );
        i++;
        j++;
      }
    }

    setDiff(result);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Text Diff</h1>
        <p className="text-muted-foreground">Compare two texts and find differences</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Original Text</CardTitle>
            <CardDescription>Paste the original text here</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Paste original text..."
              value={text1}
              onChange={(e) => setText1(e.target.value)}
              className="min-h-[300px] font-mono text-sm"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Modified Text</CardTitle>
            <CardDescription>Paste the modified text here</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Paste modified text..."
              value={text2}
              onChange={(e) => setText2(e.target.value)}
              className="min-h-[300px] font-mono text-sm"
            />
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-2 mb-6">
        <Button onClick={computeDiff} className="w-full">
          Compare
        </Button>
        <Button onClick={() => { setText1(""); setText2(""); setDiff([]); }} variant="outline">
          Clear
        </Button>
      </div>

      {diff.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Diff Result</CardTitle>
            <CardDescription>
              <span className="inline-block w-3 h-3 bg-red-100 dark:bg-red-900/30 mr-1"></span>
              Removed lines
              <span className="inline-block w-3 h-3 bg-green-100 dark:bg-green-900/30 ml-3 mr-1"></span>
              Added lines
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="font-mono text-sm bg-muted rounded-lg p-4 overflow-x-auto">
              {diff}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
