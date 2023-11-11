await import("./src/env.mjs")

/** @type {import('next').NextConfig} */
const config = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.discordapp.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
    domains: [
      'cdn.discordapp.com',
      'raw.githubusercontent.com',
    ],
  },
  distDir: 'build',
}

export default config