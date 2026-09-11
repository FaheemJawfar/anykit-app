import type { NextConfig } from "next";
import { PHASE_PRODUCTION_BUILD } from "next/constants";

// `next build` writes to .next-new while `next start` keeps serving from .next.
// The deploy script swaps .next-new into .next once the build is complete, so the
// running server never reads a half-built directory.
export const BUILD_DIST_DIR = ".next-new";
export const SERVE_DIST_DIR = ".next";

const nextConfig = (phase: string): NextConfig => ({
  distDir: phase === PHASE_PRODUCTION_BUILD ? BUILD_DIST_DIR : SERVE_DIST_DIR,
});

export default nextConfig;
