"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import type { MainNavItem } from "@/types/nav"


interface MainNavProps extends React.HTMLAttributes<HTMLElement> {
  items: MainNavItem[]
}

export const MainNav = ({ className, items, ...props }: MainNavProps) => {
  const pathname = usePathname()

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href!}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname !== item.href && "text-muted-foreground",
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  )
}