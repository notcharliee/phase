import createMDX from "@next/mdx"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import rehypeSlug from "rehype-slug"
import remarkGfm from "remark-gfm"

import { env } from "./src/lib/env.js"

/** @type {import('next').NextConfig} */
const config = {
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  experimental: {
    serverComponentsExternalPackages: ["bcryptjs"],
    mdxRs: true,
    turbo: {
      resolveAlias: {
        "next-mdx-import-source-file": [
          "private-next-root-dir/src/mdx-components",
          "private-next-root-dir/mdx-components",
          "@mdx-js/react",
        ],
      },
      rules: {
        // @ts-expect-error type error for some reason idk
        test: /\.mdx$/,
        use: [
          {
            loader: import.meta.resolve(
              "./node_modules/@next/mdx/mdx-rs-loader.js",
            ),
            options: {
              providerImportSource: "next-mdx-import-source-file",
            },
          },
        ],
      },
    },
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
        source: "/redirect/developer",
        destination: "https://github.com/notcharliee",
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

const withMDX = createMDX({
  options: {
    // @ts-expect-error type error for some reason idk
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          properties: {
            className: ["subheading-anchor"],
            ariaLabel: "Link to section",
          },
        },
      ],
    ],
  },
})

export default withMDX(config)
