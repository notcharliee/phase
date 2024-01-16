import { env } from "./src/lib/env.js"

/** @type {import('next').NextConfig} */
const config = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.discordapp.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        port: "",
        pathname: "/**",
      },
    ],
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
        destination: `https://discord.com/oauth2/authorize?client_id=${env.DISCORD_ID}&response_type=code&scope=guilds%20identify%20bot%20applications.commands&redirect_uri=${env.NEXT_PUBLIC_BASE_URL}/api/login&permissions=486911216`,
        permanent: true,
      },
    ]
  },
  distDir: "build",
}

export default config
