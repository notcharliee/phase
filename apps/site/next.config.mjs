import "@total-typescript/ts-reset"

import createMDX from "@next/mdx"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import rehypeSlug from "rehype-slug"
import remarkGfm from "remark-gfm"

import { env } from "./src/lib/env.js"

/** @type {import('next').NextConfig} */
const config = {
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  experimental: { mdxRs: true },
  async redirects() {
    return [
      {
        // discord server
        source: "/redirect/discord",
        destination: "https://discord.com/invite/mZjRBKS29X",
        permanent: false,
      },
      {
        // dashboard oauth
        source: "/redirect/oauth",
        destination: `https://discord.com/api/oauth2/authorize?client_id=${env.DISCORD_ID}&response_type=code&scope=identify&redirect_uri=${env.NEXT_PUBLIC_BASE_URL}/auth/login`,
        permanent: false,
      },
      {
        // bot invite
        source: "/redirect/invite",
        destination: `https://discord.com/oauth2/authorize?client_id=${env.DISCORD_ID}&response_type=code&scope=bot%20applications.commands&permissions=17666911472`,
        permanent: false,
      },
      {
        // old donation redirect
        source: "/redirect/donate",
        destination: `${env.NEXT_PUBLIC_BASE_URL}/redirect/buymeacoffee`,
        permanent: false,
      },
      {
        // donation page 1
        source: "/redirect/buymeacoffee",
        destination: "https://www.buymeacoffee.com/notcharliee",
        permanent: false,
      },
      {
        // donation page 2
        source: "/redirect/ko-fi",
        destination: "https://ko-fi.com/mikaelareid",
        permanent: false,
      },
      {
        // developer page
        source: "/redirect/developer",
        destination: "https://github.com/notcharliee",
        permanent: false,
      },
      {
        // github repo
        source: "/redirect/github",
        destination: "https://github.com/notcharliee/phase",
        permanent: false,
      },
      {
        // terms page
        source: "/terms",
        destination: "/docs/terms",
        permanent: true,
      },
      {
        // privacy page
        source: "/privacy",
        destination: "/docs/privacy",
        permanent: true,
      },
      {
        // dashboard page
        source: "/dashboard",
        destination: "/dashboard/modules",
        permanent: false,
      },
    ]
  },
}

const withMDX = createMDX({
  options: {
    remarkPlugins: [
      // @ts-expect-error type error for some reason idk
      remarkGfm,
    ],
    rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
  },
})

export default withMDX(config)
