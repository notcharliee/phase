import { DiscordLogoIcon, GitHubLogoIcon } from "@radix-ui/react-icons"

interface Page {
  label: string
  href: string
  icon?: typeof GitHubLogoIcon
  category?: string
  external?: boolean
}

export const mainPages: Page[] = [
  { label: "Home", href: "/" },
  { label: "Docs", href: "/docs" },
  { label: "Login", href: "/auth/login" },
  { label: "Invite", href: "/redirect/invite", external: true },
  {
    label: "GitHub",
    href: "/redirect/github",
    external: true,
    icon: GitHubLogoIcon,
  },
  {
    label: "Discord",
    href: "/redirect/discord",
    external: true,
    icon: DiscordLogoIcon,
  },
]

export const docsPages: Page[] = [
  {
    label: "Introduction",
    href: "/docs",
    category: "Getting Started",
  },
  {
    label: "Changelog",
    href: "/docs/changelog",
    category: "Getting Started",
  },
  {
    label: "Terms",
    href: "/docs/terms",
    category: "Getting Started",
  },
  {
    label: "Privacy",
    href: "/docs/privacy",
    category: "Getting Started",
  },
  // modules
  {
    label: "Counters",
    href: "/docs/modules/counters",
    category: "Modules",
  },
  {
    label: "Welcome Messages",
    href: "/docs/modules/welcome-messages",
    category: "Modules",
  },
]

export const splitPagesByCategory = (pages: Page[]): Record<string, Page[]> => {
  return pages.reduce(
    (acc, page) => {
      const category = page.category ?? "Misc"
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(page)
      return acc
    },
    {} as Record<string, Page[]>,
  )
}
