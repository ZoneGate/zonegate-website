import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Emits a self-contained server bundle so the runtime image does not need
  // node_modules — see Dockerfile.
  output: "standalone",
  async rewrites() {
    const backend = (process.env.BACKEND_API_URL ?? "http://127.0.0.1:8000").replace(/\/$/, "");
    return [{ source: "/api/backend/:path*", destination: `${backend}/:path*` }];
  },

  // Pin the workspace root: a stray package-lock.json above this folder
  // otherwise makes Turbopack infer the wrong project root.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
