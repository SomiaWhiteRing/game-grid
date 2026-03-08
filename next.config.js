/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.cloudflare.steamstatic.com",
      },
      {
        protocol: "http",
        hostname: "lain.bgm.tv",
      },
      {
        protocol: "https",
        hostname: "lain.bgm.tv",
      },
      {
        protocol: "http",
        hostname: "img.bgm.tv",
      },
      {
        protocol: "https",
        hostname: "img.bgm.tv",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true, // 忽略 eslint 检查
  },
  typescript: {
    // 忽略 TypeScript 构建错误
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;

