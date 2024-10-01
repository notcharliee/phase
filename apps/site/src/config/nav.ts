import {
  DashboardIcon,
  DiscordLogoIcon,
  GitHubLogoIcon,
  MixerHorizontalIcon,
} from "@radix-ui/react-icons"

import { CommandIcon } from "~/components/icons/command-icon"

import type { IconProps } from "@radix-ui/react-icons/dist/types"

export interface NavItem {
  label: string
  href: string
  icon?: React.FC<IconProps>
  category?: string
  external?: boolean
}

export const mainPages: NavItem[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Docs",
    href: "/docs",
  },
  {
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    label: "Invite",
    href: "/redirect/invite",
    external: true,
  },
  // icons
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

export const dashboardPages: NavItem[] = [
  // pages
  {
    label: "Modules",
    href: "/dashboard/modules",
    icon: DashboardIcon,
  },
  {
    label: "Commands",
    href: "/dashboard/commands",
    icon: CommandIcon,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: MixerHorizontalIcon,
  },
  // resources
  {
    label: "Documentation",
    href: "/docs",
    category: "Resources",
  },
  {
    label: "Support",
    href: "/redirect/discord",
    category: "Resources",
    external: true,
  },
  // other links
  {
    label: "Report a Bug",
    href: "/contact/bug-report",
    category: "Other Links",
  },
  {
    label: "Make a Suggestion",
    href: "/redirect/discord",
    category: "Other Links",
    external: true,
  },
  {
    label: "Give me money :3",
    href: "/redirect/donate",
    category: "Other Links",
    external: true,
  },
]

export const docsPages: NavItem[] = [
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

export const splitPagesByCategory = (
  pages: NavItem[],
): Record<string, NavItem[]> => {
  return pages.reduce(
    (acc, page) => {
      const category = page.category ?? "Misc"
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(page)
      return acc
    },
    {} as Record<string, NavItem[]>,
  )
}
