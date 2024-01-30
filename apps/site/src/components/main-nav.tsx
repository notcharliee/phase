"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"

import { ArrowTopRightIcon } from "@radix-ui/react-icons"

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
            "text-sm font-medium transition-colors hover:text-primary relative",
            pathname !== item.href && "text-muted-foreground",
          )}
        >
          {item.title}
          {item.external && <ArrowTopRightIcon shapeRendering="geometricPrecision" className="h-[9px] w-[9px] absolute top-0.5 -right-[12px]" />}
        </Link>
      ))}
    </nav>
  )
}