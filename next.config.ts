import path from "node:path";
import { fileURLToPath } from "node:url";

import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const distDir = process.env.NEXT_DIST_DIR ?? ".next";

const nextConfig: NextConfig = {
  distDir,
  reactStrictMode: true,
  outputFileTracingRoot: rootDir
};

if (process.env.NODE_ENV === "development") {
  initOpenNextCloudflareForDev();
}

export default nextConfig;
