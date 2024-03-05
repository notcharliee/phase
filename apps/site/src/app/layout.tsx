import "@/styles/globals.css"

import { GeistSans } from "geist/font/sans"

import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"

import { type Metadata, type Viewport } from "next"

import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"

import { cn } from "@/lib/utils"
import { siteConfig } from "@/config/site"

export const metadata = {
  title: { default: siteConfig.name, template: `%s - ${siteConfig.name}` },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  authors: siteConfig.author,
  creator: siteConfig.creator,
  keywords: siteConfig.keywords,
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@" + siteConfig.creator,
  },
  icons: {
    icon: siteConfig.favicon,
    apple: siteConfig.apple,
  },
} satisfies Metadata

export const viewport = {
  colorScheme: "dark",
  themeColor: "#f8f8f8",
} satisfies Viewport

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" style={{ colorScheme: "dark" }}>
      <body
        className={cn(
          "font-geist-sans bg-background text-foreground tracking-tight",
          GeistSans.variable,
        )}
      >
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
