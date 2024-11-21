/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
  },
  env: {
    PORT: process.env.PORT?.toString() || '3000'
  },
  experimental: {
  }
}

module.exports = nextConfig 