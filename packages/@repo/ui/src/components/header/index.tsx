"use client"

import * as React from "react"

import { Button } from "~/components/button"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/command"
import { LucideIcon } from "~/components/lucide-icon"
import { Moon } from "~/components/moon"
import { SimpleIcon } from "~/components/simple-icon"

import { cn } from "~/lib/utils"

import type { BaseLink } from "~/components/base-link"
import type { LucideIconName } from "~/components/lucide-icon"
import type { SimpleIconName } from "~/components/simple-icon"
import type { WithRequired } from "~/types/utils"

interface NavItem {
  label: string
  href: string
  external?: boolean
  icon?:
    | { type: "lucide"; name: LucideIconName }
    | { type: "simple"; name: SimpleIconName }
}

interface NavItemWithIcon extends WithRequired<NavItem, "icon"> {}

export interface HeaderNavItems {
  main: NavItem[]
  icons: NavItemWithIcon[]
}

export const headerNavItems: HeaderNavItems = {
  main: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Docs",
      href: "/docs",
    },
    {
      label: "Dashboard",
      href: "/dashboard/guilds",
    },
    {
      label: "Invite",
      href: "/redirect/invite",
      external: true,
    },
  ],
  icons: [
    {
      label: "GitHub",
      href: "/redirect/github",
      external: true,
      icon: {
        type: "simple",
        name: "github",
      },
    },
    {
      label: "Discord",
      href: "/redirect/discord",
      external: true,
      icon: {
        type: "simple",
        name: "discord",
      },
    },
  ],
}

export interface HeaderProps extends React.ComponentPropsWithRef<"header"> {
  link: typeof BaseLink
}

export function Header({ className, link: Link, ...props }: HeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 h-16 w-full border-b backdrop-blur-sm",
        className,
      )}
      {...props}
    >
      <div className="container flex h-full items-center">
        <nav className="mr-8 hidden items-center space-x-4 md:flex lg:space-x-6">
          <Link
            href={"/"}
            title="Home"
            variant={"no-underline"}
            className="mr-6 flex items-center space-x-2"
          >
            <Moon className="h-5 w-5" />
            <span className="font-bold leading-tight">Phase</span>
          </Link>
          {headerNavItems.main.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              aria-label={item.label}
              external={item.external}
              variant={"hover"}
              size={"sm"}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-1 items-center justify-between space-x-3 md:justify-end">
          <NavigationCombobox link={Link} />
          <nav className="flex items-center gap-1.5">
            {headerNavItems.icons.map((item) => (
              <Button
                key={item.href}
                title={item.label}
                aria-label={item.label}
                variant={"outline"}
                size={"icon"}
                asChild
              >
                <Link href={item.href} external={item.external}>
                  {item.icon.type === "lucide" ? (
                    <LucideIcon name={item.icon.name} />
                  ) : (
                    <SimpleIcon name={item.icon.name} />
                  )}
                </Link>
              </Button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}

interface NavigationComboboxProps {
  link: typeof BaseLink
}

function NavigationCombobox({ link: Link }: NavigationComboboxProps) {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        !((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") ||
        (e.target instanceof HTMLElement && e.target.isContentEditable) ||
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return
      }

      e.preventDefault()
      setOpen((open) => !open)
    }

    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [])

  const onItemClick = React.useCallback(() => setOpen(false), [])

  return (
    <div className="w-full flex-1 md:w-auto md:flex-none">
      <Button
        aria-label="Navigation"
        aria-description="Navigate to a page"
        variant="outline"
        className="bg-background text-muted-foreground relative h-9 w-full justify-start text-sm sm:pr-[52px] md:w-64"
        onClick={() => setOpen(!open)}
      >
        <span className="flex items-center gap-2">
          <LucideIcon name="telescope" className="size-3.5" />
          Wanna explore?
        </span>
        <kbd className="bg-muted pointer-events-none absolute right-[4.333px] top-[4.333] hidden h-[26px] select-none items-center gap-1 rounded-sm px-2.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        dialogLabel="Navigation"
        dialogDescription="Navigate to a page"
      >
        <CommandInput placeholder="Where do you want to go?" />
        <CommandList>
          <CommandEmpty>{"No results found :("}</CommandEmpty>
          <CommandGroup heading="Main Links">
            {[...headerNavItems.main, ...headerNavItems.icons].map((item) => (
              <CommandItem key={item.href} value={item.label} asChild>
                <Link
                  label={item.label}
                  href={item.href}
                  external={item.external}
                  variant={"no-underline"}
                  onClick={onItemClick}
                >
                  <LucideIcon
                    name={item.external ? "external-link" : "scroll-text"}
                    className="mr-2"
                  />
                  {item.label}
                </Link>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  )
}
