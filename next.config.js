/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true
  },
  env: {
    PORT: process.env.PORT?.toString() || '3000'
  },
  eslint: {
    ignoreDuringBuilds: true
  }
}

module.exports = nextConfig