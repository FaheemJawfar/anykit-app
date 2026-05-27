"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

const CORE_URL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.js";
const WASM_URL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.wasm";

async function createBlobURL(url: string, mimeType: string): Promise<string> {
  const response = await fetch(url);
  const blob = await response.blob();
  return URL.createObjectURL(new Blob([blob], { type: mimeType }));
}

export function useFFmpeg() {
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const ffmpegRef = useRef<FFmpeg | null>(null);
  const progressCallbackRef = useRef<((pct: number) => void) | null>(null);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const load = async () => {
    try {
      const ffmpeg = new FFmpeg();
      ffmpegRef.current = ffmpeg;

      ffmpeg.on("log", ({ message }) => {
        console.log("[FFmpeg]", message);
      });

      ffmpeg.on("progress", ({ progress }) => {
        if (progressCallbackRef.current) {
          const pct = Math.min(100, Math.max(0, Math.round(progress * 100)));
          progressCallbackRef.current(pct);
        }
      });

      const coreURL = await createBlobURL(CORE_URL, "text/javascript");
      const wasmURL = await createBlobURL(WASM_URL, "application/wasm");

      await ffmpeg.load({ coreURL, wasmURL });

      setLoaded(true);
      setLoading(false);
    } catch (error) {
      console.error("Failed to load FFmpeg:", error);
      setLoading(false);
    }
  };

  const resetFFmpeg = async () => {
    setLoaded(false);
    setLoading(true);
    if (ffmpegRef.current) {
      try {
        ffmpegRef.current.terminate();
      } catch (e) {
        console.error("Failed to terminate FFmpeg:", e);
      }
    }
    await load();
    return ffmpegRef.current;
  };

  const setOnProgress = useCallback((cb: ((pct: number) => void) | null) => {
    progressCallbackRef.current = cb;
  }, []);

  return {
    ffmpeg: ffmpegRef.current,
    loaded,
    loading,
    fetchFile,
    setOnProgress,
    resetFFmpeg,
  };
}
