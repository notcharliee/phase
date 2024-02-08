import type { MainNavItem, SidebarNavItem } from "@/types/nav"

import { modulesConfig } from "./modules"


interface DocsConfig {
  mainNav: MainNavItem[]
  sidebarNav: SidebarNavItem[]
}


export const docsConfig: DocsConfig = {
  mainNav: [
    {
      title: "Dashboard",
      href: "/dashboard",
    },
    {
      title: "Docs",
      href: "/docs",
    },
    {
      title: "Invite",
      href: "/redirect/invite",
      external: true,
    },
    {
      title: "Discord",
      href: "/redirect/discord",
      external: true,
    },
  ],
  sidebarNav: [
    {
      title: "Getting Started",
      items: [
        {
          title: "Introduction",
          href: "/docs",
          items: [],
        },
        {
          title: "Terms",
          href: "/docs/terms",
          items: [],
        },
        {
          title: "Privacy",
          href: "/docs/privacy",
          items: [],
        },
        {
          title: "Changelog",
          href: "/docs/changelog",
          items: [],
        },
      ],
    },
    {
      title: "Modules",
      items: modulesConfig.map(module => ({
        title: module.name,
        href: "/docs/modules" + module.path,
        disabled: module.disabled,
        label: module.label,
        items: [],
      })),
    },
    {
      title: "Commands",
      items: [
        {
          title: "/afk",
          href: "/docs/commands/afk",
          items: [],
        },
        {
          title: "/announce",
          href: "/docs/commands/announce",
          items: [],
        },
        {
          title: "/avatar",
          href: "/docs/commands/avatar",
          items: [],
        },
        {
          title: "/cat",
          href: "/docs/commands/cat",
          items: [],
        },
        {
          title: "/catfact",
          href: "/docs/commands/catfact",
          items: [],
        },
        {
          title: "/coffee",
          href: "/docs/commands/coffee",
          items: [],
        },
        {
          title: "/coinflip",
          href: "/docs/commands/coinflip",
          items: [],
        },
        {
          title: "/compliment",
          href: "/docs/commands/compliment",
          items: [],
        },
        {
          title: "/dadjoke",
          href: "/docs/commands/dadjoke",
          items: [],
        },
        {
          title: "/dog",
          href: "/docs/commands/dog",
          items: [],
        },
        {
          title: "/duck",
          href: "/docs/commands/duck",
          items: [],
        },
        {
          title: "/echo",
          href: "/docs/commands/echo",
          items: [],
        },
        {
          title: "/embed",
          href: "/docs/commands/embed",
          items: [],
        },
        {
          title: "/github",
          href: "/docs/commands/github",
          items: [],
        },
        {
          title: "/giveaway create",
          href: "/docs/commands/giveaway-create",
          items: [],
        },
        {
          title: "/giveaway delete",
          href: "/docs/commands/giveaway-delete",
          items: [],
        },
        {
          title: "/giveaway reroll",
          href: "/docs/commands/giveaway-reroll",
          items: [],
        },
        {
          title: "/help",
          href: "/docs/commands/help",
          items: [],
        },
        {
          title: "/level leaderboard",
          href: "/docs/commands/level-leaderboard",
          items: [],
        },
        {
          title: "/level rank",
          href: "/docs/commands/level-rank",
          items: [],
        },
        {
          title: "/level set",
          href: "/docs/commands/level-set",
          items: [],
        },
        {
          title: "/lock",
          href: "/docs/commands/lock",
          items: [],
        },
        {
          title: "/membercount",
          href: "/docs/commands/membercount",
          items: [],
        },
        {
          title: "/nuke",
          href: "/docs/commands/nuke",
          items: [],
        },
        {
          title: "/partner add",
          href: "/docs/commands/partner-add",
          items: [],
        },
        {
          title: "/partner advert",
          href: "/docs/commands/partner-advert",
          items: [],
        },
        {
          title: "/partner channel",
          href: "/docs/commands/partner-channel",
          items: [],
        },
        {
          title: "/partner invite",
          href: "/docs/commands/partner-invite",
          items: [],
        },
        {
          title: "/partner list",
          href: "/docs/commands/partner-list",
          items: [],
        },
        {
          title: "/partner remove",
          href: "/docs/commands/partner-remove",
          items: [],
        },
        {
          title: "/ping",
          href: "/docs/commands/ping",
          items: [],
        },
        {
          title: "/poll",
          href: "/docs/commands/poll",
          items: [],
        },
        {
          title: "/purge",
          href: "/docs/commands/purge",
          items: [],
        },
        {
          title: "/rps",
          href: "/docs/commands/rps",
          items: [],
        },
        {
          title: "/tag add",
          href: "/docs/commands/tag-add",
          items: [],
        },
        {
          title: "/tag edit",
          href: "/docs/commands/tag-edit",
          items: [],
        },
        {
          title: "/tag get",
          href: "/docs/commands/tag-get",
          items: [],
        },
        {
          title: "/tag list",
          href: "/docs/commands/tag-list",
          items: [],
        },
        {
          title: "/tag remove",
          href: "/docs/commands/tag-remove",
          items: [],
        },
        {
          title: "/tictactoe",
          href: "/docs/commands/tictactoe",
          items: [],
        },
        {
          title: "/whois",
          href: "/docs/commands/whois",
          items: [],
        },
        {
          title: "/youtube",
          href: "/docs/commands/youtube",
          items: [],
        },
      ],
    },
  ],
}