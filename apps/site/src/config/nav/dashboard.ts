import type { MainNavItem, SidebarNavItem } from "@/types/nav"

import { commandsConfig } from "../commands"
import { modulesConfig } from "../modules"


interface DashboardNav {
  mainNav: MainNavItem[]
  sidebarNav: SidebarNavItem[]
}


export const dashboardNavConfig: DashboardNav = {
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
      items: modulesConfig.map(module => ({
        title: module.name,
        href: "/dashboard/modules" + module.path,
        disabled: module.disabled,
        items: [],
      })),
    },
    {
      title: "Commands",
      items: commandsConfig.map(command => ({
        title: command.name,
        href: "/dashboard/commands" + command.path,
        disabled: command.disabled,
        label: command.label,
        items: [],
      })),
    },
  ],
}
