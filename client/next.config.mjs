/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The repo root has its own lockfile (for the dev scripts); pin the app root.
  turbopack: { root: import.meta.dirname },
  // The database is opened by path at runtime, which file tracing can't see,
  // so ship it explicitly with the server routes (e.g. /api/search on Vercel).
  outputFileTracingIncludes: {
    "/api/**": ["./data/dua_main.sqlite"],
    "/duas/**": ["./data/dua_main.sqlite"],
  },
};

export default nextConfig;
