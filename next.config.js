/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  staticPageGenerationTimeout: 1000,
  experimental: {
    workerThreads: false,
    cpus: 1
  },
  skipTrailingSlashRedirect: true,
  skipMiddlewareUrlNormalize: true
}

module.exports = nextConfig