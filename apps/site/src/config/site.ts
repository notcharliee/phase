import { env } from "~/lib/env"

const BASE_URL = new URL(env.BASE_URL)

export const siteConfig = {
  url: BASE_URL,
  title: "Phase Bot",
  description: `Phase is a free to use, open source Discord bot that aims to be the all-in-one solution for as many servers as possible.`,
  keywords: ["Discord", "Bot", "Phase", "Free"],
  developer: {
    name: "mikaela",
    url: "https://github.com/mikaeladev",
  },
  images: {
    logo: new URL("/phase.png", BASE_URL),
    favicon: new URL("/favicon.ico", BASE_URL),
    apple: new URL("/apple.png", BASE_URL),
  }
}
