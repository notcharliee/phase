import "@/styles/globals.css"
import "@/styles/keyframes.css"
import "@/styles/scrollbars.css"

import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"

import { GeistSans } from "geist/font/sans"
import { Metadata, Viewport } from "next"

import { env } from "@/lib/env"

import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"


export const metadata = {
  title: "Phase Bot",
  description: "Phase is a free to use, open source Discord bot that aims to be the all-in-one solution for as many servers as possible.",
  metadataBase: new URL(env.NEXT_PUBLIC_BASE_URL),
  icons: env.NEXT_PUBLIC_BASE_URL + "/favicon.png",
  authors: {
    name: "@notcharliee",
    url: "https://github.com/notcharliee",
  },
  keywords: [
    "discord",
    "bot",
    "phase",
    "phasebot",
    "free",
    "open source",
    "notcharliee",
    "charliee",
  ],
} satisfies Metadata


export const viewort = {
  colorScheme: "dark",
  themeColor: "#F8F8F8",
} satisfies Viewport


export default ({
  children,
}: {
  children: React.ReactNode,
}) => (
  <html lang="en" className={GeistSans.variable + " font-geist-sans tracking-tight"} style={{ colorScheme: "dark" }}>
    <body>
      <div className="pointer-events-none fixed -z-10 h-full w-full overflow-hidden before:absolute before:-left-1/2 before:-top-1/2 before:h-[200%] before:w-[200%] before:bg-[auto_768px] before:bg-[url(/noise.png)]"/>
      <TooltipProvider children={children} />
      <Toaster />
      <Analytics />
      <SpeedInsights />
    </body>
  </html>
)
