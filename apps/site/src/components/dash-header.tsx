"use client"

import Link, { type LinkProps } from "next/link"
import { useRouter, usePathname } from "next/navigation"

import { useState } from "react"

import { ArrowTopRightIcon, HamburgerMenuIcon } from "@radix-ui/react-icons"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

import { dashboardNavConfig } from "@/config/nav/dashboard"
import { cn } from "@/lib/utils"

import { SearchDashboard } from "@/app/dashboard/components/search-dashboard"

import type { MainNavItem, SidebarNavItem } from "@/types/nav"

export const DashHeader = (props: {
  selectServerCombobox: JSX.Element
  userNav: JSX.Element
}) => (
  <header className="sticky top-0 z-50 w-full border-b backdrop-blur-sm">
    <div className="mx-auto flex h-16 items-center px-8">
      <MainNav
        mainNav={dashboardNavConfig.mainNav}
        selectServerCombobox={props.selectServerCombobox}
      />
      <div className="flex flex-1 items-center justify-between space-x-4 md:justify-end">
        <div className="w-full flex-1 md:w-auto md:flex-none">
          <SearchDashboard />
        </div>
        <nav className="flex items-center">{props.userNav}</nav>
      </div>
    </div>
  </header>
)

export const MainNav = (props: {
  mainNav: MainNavItem[]
  selectServerCombobox: JSX.Element
}) => {
  const pathname = usePathname()

  return (
    <nav className="mr-8 hidden items-center space-x-4 md:flex lg:space-x-6">
      {props.selectServerCombobox}
      {props.mainNav.map((item) => (
        <Link
          key={item.href}
          href={item.href!}
          className={cn(
            "hover:text-primary relative text-sm font-medium transition-colors",
            pathname !== item.href && "text-muted-foreground",
          )}
        >
          {item.title}
          {item.external && (
            <ArrowTopRightIcon
              shapeRendering="geometricPrecision"
              className="absolute -right-[12px] top-0.5 h-[9px] w-[9px]"
            />
          )}
        </Link>
      ))}
    </nav>
  )
}

export const MobileNav = (props: {
  mainNav: MainNavItem[]
  pageNav: SidebarNavItem[]
  selectServerCombobox: JSX.Element
}) => {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant={"ghost"}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "mr-2 w-9 px-0 md:hidden",
          )}
        >
          <HamburgerMenuIcon className="h-5 w-5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <ScrollArea className="mx-auto h-[70vh] w-full max-w-sm px-6 py-10">
          <div className="flex flex-col gap-6">
            <DrawerHeader className="gap-3 pt-0">
              {props.selectServerCombobox}
            </DrawerHeader>
            <div className="mr-3 flex justify-between gap-3">
              {props.mainNav.map(
                (item) =>
                  item.href && (
                    <MobileLink
                      key={item.href}
                      href={item.href}
                      onOpenChange={setOpen}
                      className={cn(
                        pathname === item.href
                          ? "text-foreground"
                          : "text-muted-foreground",
                        "relative",
                      )}
                    >
                      {item.title}
                      {item.external && (
                        <ArrowTopRightIcon
                          shapeRendering="geometricPrecision"
                          className="absolute -right-[12px] top-0.5 h-[9px] w-[9px]"
                        />
                      )}
                    </MobileLink>
                  ),
              )}
            </div>
            <Separator />
            <div className="flex flex-col gap-8">
              {props.pageNav.map((item, index) => (
                <div key={index} className="flex flex-col gap-3">
                  <h4 className="font-medium">{item.title}</h4>
                  {item?.items?.length &&
                    item.items.map(
                      (item, index) =>
                        !item.disabled &&
                        (item.href ? (
                          <MobileLink
                            key={index}
                            href={item.href}
                            onOpenChange={setOpen}
                            className={"text-muted-foreground relative"}
                          >
                            {item.title}
                            {item.external && (
                              <ArrowTopRightIcon
                                shapeRendering="geometricPrecision"
                                className="absolute -right-[12px] top-0.5 h-[9px] w-[9px]"
                              />
                            )}
                          </MobileLink>
                        ) : (
                          <span key={index} className="relative">
                            {item.title}
                            {item.external && (
                              <ArrowTopRightIcon
                                shapeRendering="geometricPrecision"
                                className="absolute -right-[12px] top-0.5 h-[9px] w-[9px]"
                              />
                            )}
                          </span>
                        )),
                    )}
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

const MobileLink = ({
  href,
  onOpenChange,
  className,
  children,
  ...props
}: MobileLinkProps) => {
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
