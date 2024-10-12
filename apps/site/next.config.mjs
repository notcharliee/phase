/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

// @ts-nocheck

import "@total-typescript/ts-reset"

import { fileURLToPath } from "node:url"

import createMDX from "@next/mdx"
import { createJiti } from "jiti"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import rehypeSlug from "rehype-slug"
import remarkGfm from "remark-gfm"

const jiti = createJiti(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const config = {
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  experimental: {
    mdxRs: true,
    turbo: {
      resolveAlias: {
        "next-mdx-import-source-file": [
          "private-next-root-dir/src/mdx-components",
          "private-next-root-dir/mdx-components",
          "@mdx-js/react",
        ],
      },
    },
  },
  async redirects() {
    const env = (await jiti.import("./src/lib/env.ts")).env

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
        destination: `https://discord.com/api/oauth2/authorize?client_id=${env.DISCORD_ID}&response_type=code&scope=identify&redirect_uri=${env.BASE_URL}/auth/login`,
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
        destination: `${env.BASE_URL}/redirect/buymeacoffee`,
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
        destination: "/dashboard/guilds",
        permanent: false,
      },
      {
        // dashboard page
        source: "/dashboard/modules",
        destination: "/dashboard/guilds",
        permanent: false,
      },
    ]
  },
}

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
  },
})

export default withMDX(config)
