import "@/styles/globals.css"
import { GeistSans } from "geist/font"
import { Metadata, Viewport } from "next"
import { env } from '@/env'


export const metadata: Metadata = {
  title: "Phase",
  description:
    "Phase is a free and open source all-in-one Discord bot. Our aim is to provide a comprehensive set of tools that enable effortless management, moderation, and optimization of your servers.",
  icons: env.NEXT_PUBLIC_BASE_URL + "/og_image.png",
  authors: { name: "@notcharliee", url: "https://github.com/notcharliee" },
  keywords: [
    "discord",
    "bot",
    "phase",
    "phasebot",
    "levels",
    "free",
    "open source",
    "notcharliee",
  ],
  metadataBase: new URL(env.NEXT_PUBLIC_BASE_URL),
  openGraph: {
    type: "website",
    url: env.NEXT_PUBLIC_BASE_URL,
    title: "Phase",
    description:
      "Phase is a free and open source all-in-one Discord bot. Our aim is to provide a comprehensive set of tools that enable effortless management, moderation, and optimization of your servers.",
    images: env.NEXT_PUBLIC_BASE_URL + "/og_image.png",
  },
  twitter: {
    card: "summary",
    creator: "@notcharliee",
    description:
      "Phase is a free and open source all-in-one Discord bot. Our aim is to provide a comprehensive set of tools that enable effortless management, moderation, and optimization of your servers.",
    site: env.NEXT_PUBLIC_BASE_URL,
    images: env.NEXT_PUBLIC_BASE_URL + "/og_image.png",
  },
}


export const viewort: Viewport = {
  colorScheme: "dark",
  themeColor: "#A400FF",
}


export default ({ children }: { children: React.ReactNode }) => {
  return (
    <html
      lang="en"
      className={GeistSans.variable + " font-geist-sans tracking-tight"}
    >
      <body>
        <div id="modals"></div>
        {children}
      </body>
    </html>
  )
}
