import "~/styles/globals.css"

import { Analytics } from "@vercel/analytics/react"
import { GeistMono } from "geist/font/mono"
import { GeistSans } from "geist/font/sans"
import { NuqsAdapter } from "nuqs/adapters/next/pages"

import { Toaster } from "~/components/sonner"

import { siteConfig } from "~/config/site"

import { cn } from "~/lib/utils"

import type { LayoutProps } from "~/types/props"
import type { Metadata, Viewport } from "next"

export const metadata: Metadata = {
  metadataBase: siteConfig.url,
  title: { default: siteConfig.title, template: `%s - ${siteConfig.title}` },
  description: siteConfig.description,
  authors: siteConfig.developer,
  creator: siteConfig.developer.name,
  keywords: siteConfig.keywords,
  openGraph: {
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.title,
    type: "website",
    locale: "en_GB",
    images: {
      url: siteConfig.images.logo,
      width: 512,
      height: 512,
      alt: siteConfig.title,
    },
  },
  twitter: {
    card: "summary",
    title: siteConfig.title,
    description: siteConfig.description,
    images: siteConfig.images.logo,
  },
  icons: {
    apple: siteConfig.images.apple,
  },
} satisfies Metadata

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#f8f8f8", // used in rich embeds
} satisfies Viewport

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en" style={{ colorScheme: "dark" }}>
      <body
        className={cn(
          "bg-background text-foreground font-sans tracking-tighter antialiased",
          GeistSans.variable,
          GeistMono.variable,
        )}
      >
        <NuqsAdapter>{children}</NuqsAdapter>
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
