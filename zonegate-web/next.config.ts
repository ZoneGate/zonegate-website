import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Emits a self-contained server bundle so the runtime image does not need
  // node_modules — see Dockerfile.
  output: "standalone",

  // Pin the workspace root: a stray package-lock.json above this folder
  // otherwise makes Turbopack infer the wrong project root.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
