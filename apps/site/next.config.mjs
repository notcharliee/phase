import { env } from "./src/lib/env.js"

/** @type {import('next').NextConfig} */
const config = {
  experimental: {
    serverComponentsExternalPackages: ["bcryptjs"],
  },
  async redirects() {
    return [
      {
        source: "/redirect/discord",
        destination: "https://discord.com/invite/mZjRBKS29X",
        permanent: true,
      },
      {
        source: "/redirect/donate",
        destination: "https://www.buymeacoffee.com/notcharliee",
        permanent: true,
      },
      {
        source: "/redirect/github",
        destination: "https://github.com/notcharliee/phase",
        permanent: true,
      },
      {
        source: "/redirect/invite",
        destination: `https://discord.com/oauth2/authorize?client_id=${env.DISCORD_ID}&response_type=code&scope=guilds%20identify%20bot%20applications.commands&redirect_uri=${env.NEXT_PUBLIC_BASE_URL}/api/auth/callback&permissions=17666911472`,
        permanent: false,
      },
      {
        source: "/terms",
        destination: "/docs/terms",
        permanent: true,
      },
      {
        source: "/privacy",
        destination: "/docs/privacy",
        permanent: true,
      },
    ]
  },
  distDir: "build",
}

export default config
