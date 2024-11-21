/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'vercel.app']
    },
    missingSuspenseWithCSRBailout: false
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  distDir: '.next',
  generateBuildId: async () => {
    return 'build-' + Date.now()
  }
}

module.exports = nextConfig