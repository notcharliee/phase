import "@/styles/globals.css"
import "@/styles/keyframes.css"
import { GeistSans } from "geist/font"
import { Metadata, Viewport } from "next"
import { env } from '@/env'


export const metadata = {
  title: "Phase Bot",
  description: "Phase is a free to use, open source Discord bot that aims to be the all-in-one solution for as many servers as possible.",
  metadataBase: new URL(env.NEXT_PUBLIC_BASE_URL),
  icons: env.NEXT_PUBLIC_BASE_URL + "/og_image.png",
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
  <html lang="en" className={GeistSans.variable + " font-geist-sans tracking-tight"}>
    <body>
      <div id="modals"></div>
      {children}
    </body>
  </html>
)
