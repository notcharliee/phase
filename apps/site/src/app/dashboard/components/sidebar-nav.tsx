"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

import { ScrollArea } from "@/components/ui/scroll-area"


export const SidebarNav = (props: { items: { title: string, href: string }[] }) => {
  const pathname = usePathname()

  return (
    <nav className="h-[161px] lg:sticky lg:top-[5.5rem] lg:h-[calc(100vh-196px-32px)]">
      <ScrollArea className="h-full w-full rounded-md border p-2 flex flex-col gap-2">
        {props.items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              pathname === item.href
                ? "bg-muted hover:bg-muted"
                : "hover:bg-transparent hover:underline",
              "justify-start w-full"
            )}
          >
            {item.title}
          </Link>
        ))}
      </ScrollArea>
    </nav>
  )
}