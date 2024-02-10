import { absoluteURL } from "@/lib/utils"


export const siteConfig = {
  name: "Phase Bot",
  url: absoluteURL(""),
  ogImage: absoluteURL("/og.png"),
  favicon: absoluteURL("/favicon.ico"),
  apple: absoluteURL("/apple.png"),
  description:
    "Phase is a free to use, open source Discord bot that aims to be the all-in-one solution for as many servers as possible.",
  creator: "notcharliee",
  author: {
    name: "notcharliee",
    url: "https://github.com/notcharliee",
  },
  links: {
    discord: "/redirect/discord",
    github: "/redirect/github",
  },
  keywords: [
    "Discord",
    "Bot",
    "Phase",
    "Free",
  ],
}

export type SiteConfig = typeof siteConfig