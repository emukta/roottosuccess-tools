/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fully static export -> `out/` folder (Cloudflare Pages friendly)
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
