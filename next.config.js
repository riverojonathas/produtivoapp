Copy/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  experimental: {
    forceSwcTransforms: true,
    skipTrailingSlashRedirect: true,
    skipMiddlewareUrlNormalize: true
  }
}

module.exports = nextConfig