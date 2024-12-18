"use client"

import { useRouter } from "next/navigation"
import * as React from "react"

import { useIntersectionObserver } from "@uidotdev/usehooks"

import { Button } from "@repo/ui/button"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@repo/ui/command"
import { LucideIcon } from "@repo/ui/lucide-icon"
import { SimpleIcon } from "@repo/ui/simple-icon"
import { Link } from "~/components/link"
import { Moon } from "~/components/moon"

import { docsPages, mainPages, splitPagesByCategory } from "~/config/nav"

import { cn } from "~/lib/utils"

import type { NavItem } from "~/config/nav"
import type { WithRequired } from "~/types/utils"

export interface HeaderProps extends React.ComponentPropsWithRef<"header"> {}

export function Header({ className, ...props }: HeaderProps) {
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
          {mainPages
            .filter((item) => !item.icon)
            .map((item) => (
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
          <NavigationCombobox />
          <nav className="flex items-center gap-1.5">
            {mainPages
              .filter((i): i is WithRequired<NavItem, "icon"> => !!i.icon)
              .map((item) => (
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

function NavigationCombobox() {
  const [open, setOpen] = React.useState(false)

  const router = useRouter()

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

  const navigateTo = React.useCallback(
    (href: string) => {
      setOpen(false)
      router.push(href)
    },
    [router],
  )

  const Item = ({ item }: { item: NavItem }) => {
    const [ref, entry] = useIntersectionObserver()

    React.useEffect(() => {
      if (item.external || !entry?.isIntersecting) return
      router.prefetch(item.href)
    }, [entry, item.external, item.href])

    return (
      <CommandItem
        ref={ref}
        key={item.href}
        value={item.label}
        onSelect={() => navigateTo(item.href)}
      >
        {item.external ? (
          <LucideIcon name="external-link" className="mr-2" />
        ) : (
          <LucideIcon name="scroll-text" className="mr-2" />
        )}
        {item.label}
      </CommandItem>
    )
  }

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
            {mainPages.map((item) => (
              <Item key={item.href} item={item} />
            ))}
          </CommandGroup>
          <CommandSeparator className="mb-2 mt-1" />
          {Object.entries(splitPagesByCategory(docsPages)).map(
            ([category, pages]) => (
              <CommandGroup key={category} heading={category}>
                {pages.map((item) => (
                  <Item key={item.href} item={item} />
                ))}
              </CommandGroup>
            ),
          )}
        </CommandList>
      </CommandDialog>
    </div>
  )
}
