import "~/styles/globals.css"

import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { GeistMono } from "geist/font/mono"
import { GeistSans } from "geist/font/sans"

import { LoadingBar } from "~/components/loading-bar"
import { Toaster } from "~/components/ui/sonner"

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
      url: siteConfig.images.og,
      width: 1200,
      height: 630,
      alt: siteConfig.title,
    },
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: siteConfig.images.og,
  },
  icons: {
    icon: siteConfig.images.favicon,
    apple: siteConfig.images.apple,
  },
} satisfies Metadata

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#101010",
} satisfies Viewport

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en" style={{ colorScheme: "dark" }}>
      <body
        className={cn(
          "bg-background text-foreground font-sans tracking-tighter",
          GeistSans.variable,
          GeistMono.variable,
        )}
      >
        {children}
        <Toaster />
        <Analytics />
        <SpeedInsights />
        <LoadingBar />
      </body>
    </html>
  )
}
