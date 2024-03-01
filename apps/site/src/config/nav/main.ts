import type { MainNavItem, SidebarNavItem } from "@/types/nav"

interface MainNav {
  mainNav: MainNavItem[]
  sidebarNav: SidebarNavItem[]
}

export const mainNavConfig: MainNav = {
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
  sidebarNav: [],
}
