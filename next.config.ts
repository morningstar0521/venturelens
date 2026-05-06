import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Fix: Turbopack incorrectly infers the workspace root.
  // Explicitly point it to this project directory so /public assets resolve correctly.
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
