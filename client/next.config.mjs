const API_URL = process.env.API_URL ?? "http://localhost:4000";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The repo root has its own lockfile (for the dev runner); pin the app root.
  turbopack: { root: import.meta.dirname },
  // The browser talks to /api on this origin; Next proxies it to the Express
  // API, so there is no CORS setup and the API URL stays server-side.
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${API_URL}/api/:path*` }];
  },
};

export default nextConfig;
