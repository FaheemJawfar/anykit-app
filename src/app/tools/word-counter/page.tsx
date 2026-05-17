"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export default function WordCounter() {
  const [text, setText] = useState("");
  const [stats, setStats] = useState({
    words: 0,
    characters: 0,
    charactersNoSpaces: 0,
    lines: 0,
    paragraphs: 0,
    sentences: 0,
  });

  useEffect(() => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, "").length;
    const lines = text ? text.split("\n").length : 0;
    const paragraphs = text.trim() ? text.trim().split(/\n\n+/).length : 0;
    const sentences = text.trim() ? text.trim().split(/[.!?]+/).filter(Boolean).length : 0;

    setStats({
      words,
      characters,
      charactersNoSpaces,
      lines,
      paragraphs,
      sentences,
    });
  }, [text]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Word Counter</h1>
        <p className="text-muted-foreground">Count words, characters, and lines</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Input</CardTitle>
            <CardDescription>Type or paste your text here</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Start typing..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[400px]"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
            <CardDescription>Real-time text analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="text-sm font-medium">Words</span>
                <span className="text-2xl font-bold">{stats.words}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="text-sm font-medium">Characters</span>
                <span className="text-2xl font-bold">{stats.characters}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="text-sm font-medium">Characters (no spaces)</span>
                <span className="text-2xl font-bold">{stats.charactersNoSpaces}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="text-sm font-medium">Lines</span>
                <span className="text-2xl font-bold">{stats.lines}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="text-sm font-medium">Paragraphs</span>
                <span className="text-2xl font-bold">{stats.paragraphs}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="text-sm font-medium">Sentences</span>
                <span className="text-2xl font-bold">{stats.sentences}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
