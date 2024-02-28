import type { MainNavItem, SidebarNavItem } from "@/types/nav"

import { commandsConfig } from "../commands"
import { modulesConfig } from "../modules"

import { mainNavConfig } from "./main"


interface DocsConfig {
  mainNav: MainNavItem[]
  sidebarNav: SidebarNavItem[]
}


export const docsNavConfig: DocsConfig = {
  mainNav: mainNavConfig.mainNav,
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
          title: "Changelog",
          href: "/docs/changelog",
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
      ],
    },
    {
      title: "Modules",
      items: modulesConfig.map(module => ({
        title: module.name,
        href: "/docs/modules" + module.path,
        disabled: module.disabled,
        items: [],
      })),
    },
    {
      title: "Commands",
      items: commandsConfig.map(command => ({
        title: command.name,
        href: "/docs/commands" + command.path,
        disabled: command.disabled,
        label: command.label,
        items: [],
      })),
    },
  ],
}
