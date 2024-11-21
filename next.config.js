/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000']
    }
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig