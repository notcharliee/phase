"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  DashboardIcon,
  GearIcon,
  InputIcon,
  RocketIcon,
} from "@radix-ui/react-icons"

import { Moon } from "@/components/moon"

import { cn } from "@/lib/utils"

export const DashboardSidebarNav = ({
  items = [
    {
      title: "Overview",
      href: "/dashboard",
      icon: <DashboardIcon />,
    },
    {
      title: "Modules",
      href: "/dashboard/modules",
      icon: <RocketIcon />,
    },
    {
      title: "Commands",
      href: "/dashboard/commands",
      icon: <InputIcon />,
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: <GearIcon />,
    },
  ],
}: {
  items?: { title: string; href: string; icon: JSX.Element }[]
}) => {
  const pathname = usePathname()

  return (
    <nav className="space-y-8">
      <div className="flex items-center gap-3.5">
        <Link href={"/"}>
          <Moon className="h-6 w-6" />
        </Link>
        <span className="text-xl font-bold">Dashboard</span>
      </div>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.href}>
            <AsideLink href={item.href} aria-selected={pathname === item.href}>
              {item.icon}
              {item.title}
            </AsideLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

const AsideLink = ({
  children,
  className,
  ...props
}: React.ComponentProps<typeof Link>) => {
  return (
    <Link
      aria-selected={props["aria-selected"]}
      className={cn(
        "text-muted-foreground aria-selected:text-foreground aria-selected:bg-card aria-selected:border-border flex items-center gap-3 rounded-lg border border-transparent px-4 py-3 text-sm font-medium transition-all aria-selected:shadow-lg",
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  )
}
