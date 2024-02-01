"use client"

import Link, { type LinkProps } from "next/link"
import { useRouter, usePathname } from "next/navigation"

import { useState } from "react"

import {
  ArrowTopRightIcon,
  HamburgerMenuIcon,
} from "@radix-ui/react-icons"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Moon } from "@/components/moon"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

import { docsConfig } from "@/config/docs"
import { cn } from "@/lib/utils"

import type { SidebarNavItem } from "@/types/nav"


export const MobileNav = (props: { pageNav: SidebarNavItem[] }) => {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant={"ghost"}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "w-9 px-0 mr-2 md:hidden",
          )}>
          <HamburgerMenuIcon className="h-5 w-5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <ScrollArea className="h-[70vh] w-full max-w-sm mx-auto py-10 px-6">
          <div className="flex flex-col gap-6">
            <DrawerHeader className="gap-3 pt-0">
              <DrawerTitle>
                <MobileLink
                  href={"/"}
                  onOpenChange={setOpen}
                  className="flex items-center justify-center space-x-3">
                  <Moon className="h-8 w-8" />
                  <span className="text-2xl font-bold leading-tight">Phase Bot</span>
                </MobileLink>
              </DrawerTitle>
              <DrawerDescription className="text-base text-center">
                The all-in-one Discord Bot.
              </DrawerDescription>
            </DrawerHeader>
            <div className="flex justify-between gap-3 mr-3">
              {docsConfig.mainNav.map((item) =>
                item.href && (
                  <MobileLink
                    key={item.href}
                    href={item.href}
                    onOpenChange={setOpen}
                    className={cn(
                      pathname === item.href ? "text-foreground" : "text-muted-foreground",
                      "relative"
                    )}
                  >
                    {item.title}
                    {item.external && <ArrowTopRightIcon shapeRendering="geometricPrecision" className="h-[9px] w-[9px] absolute top-0.5 -right-[12px]" />}
                  </MobileLink>
                )
              )}
            </div>
            <Separator />
            <div className="flex flex-col gap-8">
              {props.pageNav.map((item, index) => (
                <div key={index} className="flex flex-col gap-3">
                  <h4 className="font-medium">{item.title}</h4>
                  {item?.items?.length && item.items.map((item, index) => (
                    !item.disabled && (item.href ? (
                      <MobileLink
                        key={index}
                        href={item.href}
                        onOpenChange={setOpen}
                        className={"relative text-muted-foreground"}
                      >
                        {item.title}
                        {item.external && <ArrowTopRightIcon shapeRendering="geometricPrecision" className="h-[9px] w-[9px] absolute top-0.5 -right-[12px]" />}
                      </MobileLink>
                    ) : (
                      <span key={index} className="relative">
                        {item.title}
                        {item.external && <ArrowTopRightIcon shapeRendering="geometricPrecision" className="h-[9px] w-[9px] absolute top-0.5 -right-[12px]" />}
                      </span>
                    ))
                  ))}
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  )
}


interface MobileLinkProps extends LinkProps {
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
  className?: string
}

function MobileLink({
  href,
  onOpenChange,
  className,
  children,
  ...props
}: MobileLinkProps) {
  const router = useRouter()
  return (
    <Link
      href={href}
      onClick={() => {
        router.push(href.toString())
        onOpenChange?.(false)
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </Link>
  )
}
