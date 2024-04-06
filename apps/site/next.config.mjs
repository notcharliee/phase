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
        permanent: false,
      },
      {
        source: "/redirect/donate",
        destination: "https://www.buymeacoffee.com/notcharliee",
        permanent: false,
      },
      {
        source: "/redirect/github",
        destination: "https://github.com/notcharliee/phase",
        permanent: false,
      },
      {
        source: "/redirect/invite",
        destination: `https://discord.com/oauth2/authorize?client_id=${env.DISCORD_ID}&response_type=code&scope=bot%20applications.commands&permissions=17666911472`,
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
