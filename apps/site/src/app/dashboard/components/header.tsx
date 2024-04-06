"use client"

import Link from "next/link"

import { ExitIcon, HamburgerMenuIcon } from "@radix-ui/react-icons"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { buttonVariants } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"

import { useMediaQuery } from "@/hooks/use-media-query"

import { cn, getInitials } from "@/lib/utils"

import { DashboardSidebarNav } from "./sidebar-nav"

export const DashboardHeader = (props: {
  name?: string
  avatar?: string | null
  title?: string
}) => {
  const isMobile = useMediaQuery("(max-width: 768px)")
  const loading = !props.name && !props.title && !props.avatar

  if (loading)
    return (
      <header className="mb-8 flex items-center justify-between">
        <div className="space-y-1">
          <Skeleton className="h-6 w-[15ch] rounded-md" />
          <Skeleton className="h-10 w-[20ch] rounded-md" />
        </div>
        <Skeleton className="h-14 w-14 rounded-full" />
      </header>
    )

  return (
    <header className="mb-8 flex items-center justify-between">
      <div className="space-y-1">
        <span className="text-muted-foreground/75 font-semibold">
          {props.name ? `Hi ${props.name}, welcome!` : "Hi there, welcome!"}
        </span>
        <h1 className="text-4xl font-bold">{props.title}</h1>
      </div>
      {isMobile ? (
        <Sheet>
          <SheetTrigger className="relative">
            <Avatar className="h-14 w-14 border shadow-md">
              <AvatarImage src={props.avatar ?? "/discord.png"} />
              <AvatarFallback>
                {props.name && getInitials(props.name)}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -right-0.5 -top-0.5 h-6 w-6 overflow-hidden rounded-full border bg-neutral-900">
              <div className="bg-muted-foreground/50 grid h-full w-full place-items-center">
                <HamburgerMenuIcon className="h-3 w-3" />
              </div>
            </div>
          </SheetTrigger>
          <SheetContent
            side={"left"}
            className="flex w-[20rem] flex-col justify-between p-8"
          >
            <DashboardSidebarNav />
            <Link
              prefetch={false}
              href={"/dashboard/signout"}
              className={cn(
                buttonVariants({ variant: "outline", size: "xl" }),
                "bg-background gap-2.5 shadow-lg",
              )}
            >
              <ExitIcon className="h-4 w-4" />
              Sign Out
            </Link>
          </SheetContent>
        </Sheet>
      ) : (
        <Link href={"/dashboard/settings"} className="relative">
          <Avatar className="h-14 w-14 border shadow-md">
            <AvatarImage src={props.avatar ?? "/discord.png"} />
            <AvatarFallback>
              {props.name && getInitials(props.name)}
            </AvatarFallback>
          </Avatar>
        </Link>
      )}
    </header>
  )
}
