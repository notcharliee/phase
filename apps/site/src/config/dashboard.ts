import type { MainNavItem, SidebarNavItem } from "@/types/nav"


interface DashboardConfig {
  mainNav: MainNavItem[]
  sidebarNav: SidebarNavItem[]
}


export const dashboardConfig: DashboardConfig = {
  mainNav: [
    {
      title: "Overview",
      href: "/dashboard",
    },
    {
      title: "Modules",
      href: "/dashboard/modules",
    },
    {
      title: "Commands",
      href: "/dashboard/commands",
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
    },
  ],
  sidebarNav: [
    {
      title: "Modules",
      items: [
        {
          title: "Audit Logs",
          href: "/dashboard/modules/audit-logs",
          items: [],
        },
        {
          title: "Auto Partners",
          href: "/dashboard/modules/auto-partners",
          items: [],
        },
        {
          title: "Auto Roles",
          href: "/dashboard/modules/auto-roles",
          items: [],
        },
        {
          title: "Join to Create",
          href: "/dashboard/modules/join-to-create",
          items: [],
        },
        {
          title: "Levels",
          href: "/dashboard/modules/levels",
          items: [],
        },
        {
          title: "Reaction Roles",
          href: "/dashboard/modules/reaction-roles",
          items: [],
        },
        {
          title: "Tickets",
          href: "/dashboard/modules/tickets",
          items: [],
        },
      ],
    },
    {
      title: "Commands",
      items: [
        {
          title: "/afk",
          href: "/dashboard/commands/afk",
          items: [],
        },
        {
          title: "/announce",
          href: "/dashboard/commands/announce",
          items: [],
        },
        {
          title: "/avatar",
          href: "/dashboard/commands/avatar",
          items: [],
        },
        {
          title: "/cat",
          href: "/dashboard/commands/cat",
          items: [],
        },
        {
          title: "/catfact",
          href: "/dashboard/commands/catfact",
          items: [],
        },
        {
          title: "/coffee",
          href: "/dashboard/commands/coffee",
          items: [],
        },
        {
          title: "/coinflip",
          href: "/dashboard/commands/coinflip",
          items: [],
        },
        {
          title: "/compliment",
          href: "/dashboard/commands/compliment",
          items: [],
        },
        {
          title: "/dadjoke",
          href: "/dashboard/commands/dadjoke",
          items: [],
        },
        {
          title: "/dog",
          href: "/dashboard/commands/dog",
          items: [],
        },
        {
          title: "/duck",
          href: "/dashboard/commands/duck",
          items: [],
        },
        {
          title: "/echo",
          href: "/dashboard/commands/echo",
          items: [],
        },
        {
          title: "/embed",
          href: "/dashboard/commands/embed",
          items: [],
        },
        {
          title: "/github",
          href: "/dashboard/commands/github",
          items: [],
        },
        {
          title: "/giveaway create",
          href: "/dashboard/commands/giveaway-create",
          items: [],
        },
        {
          title: "/giveaway delete",
          href: "/dashboard/commands/giveaway-delete",
          items: [],
        },
        {
          title: "/giveaway reroll",
          href: "/dashboard/commands/giveaway-reroll",
          items: [],
        },
        {
          title: "/help",
          href: "/dashboard/commands/help",
          items: [],
        },
        {
          title: "/level leaderboard",
          href: "/dashboard/commands/level-leaderboard",
          items: [],
        },
        {
          title: "/level rank",
          href: "/dashboard/commands/level-rank",
          items: [],
        },
        {
          title: "/level set",
          href: "/dashboard/commands/level-set",
          items: [],
        },
        {
          title: "/lock",
          href: "/dashboard/commands/lock",
          items: [],
        },
        {
          title: "/membercount",
          href: "/dashboard/commands/membercount",
          items: [],
        },
        {
          title: "/nuke",
          href: "/dashboard/commands/nuke",
          items: [],
        },
        {
          title: "/partner add",
          href: "/dashboard/commands/partner-add",
          items: [],
        },
        {
          title: "/partner advert",
          href: "/dashboard/commands/partner-advert",
          items: [],
        },
        {
          title: "/partner channel",
          href: "/dashboard/commands/partner-channel",
          items: [],
        },
        {
          title: "/partner invite",
          href: "/dashboard/commands/partner-invite",
          items: [],
        },
        {
          title: "/partner list",
          href: "/dashboard/commands/partner-list",
          items: [],
        },
        {
          title: "/partner remove",
          href: "/dashboard/commands/partner-remove",
          items: [],
        },
        {
          title: "/ping",
          href: "/dashboard/commands/ping",
          items: [],
        },
        {
          title: "/poll",
          href: "/dashboard/commands/poll",
          items: [],
        },
        {
          title: "/purge",
          href: "/dashboard/commands/purge",
          items: [],
        },
        {
          title: "/rps",
          href: "/dashboard/commands/rps",
          items: [],
        },
        {
          title: "/tag add",
          href: "/dashboard/commands/tag-add",
          items: [],
        },
        {
          title: "/tag edit",
          href: "/dashboard/commands/tag-edit",
          items: [],
        },
        {
          title: "/tag get",
          href: "/dashboard/commands/tag-get",
          items: [],
        },
        {
          title: "/tag list",
          href: "/dashboard/commands/tag-list",
          items: [],
        },
        {
          title: "/tag remove",
          href: "/dashboard/commands/tag-remove",
          items: [],
        },
        {
          title: "/tictactoe",
          href: "/dashboard/commands/tictactoe",
          items: [],
        },
        {
          title: "/whois",
          href: "/dashboard/commands/whois",
          items: [],
        },
        {
          title: "/youtube",
          href: "/dashboard/commands/youtube",
          items: [],
        },
      ],
    },
  ],
}