/** @type {import('next').NextConfig} */
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
    serverActions: true
  },
  staticPageGenerationTimeout: 180,
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
  distDir: '.next',
  generateEtags: false,
  poweredByHeader: false,
  compiler: {
    removeConsole: false
  }
}

module.exports = nextConfig