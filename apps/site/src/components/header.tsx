"use client"

import { usePathname, useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

import { FileIcon, GlobeIcon, RocketIcon } from "@radix-ui/react-icons"

import { Moon } from "~/components/moon"
import { Button, buttonVariants } from "~/components/ui/button"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "~/components/ui/command"
import { Link } from "~/components/ui/link"

import { docsPages, mainPages, splitPagesByCategory } from "~/config/nav"

import type { NavItem } from "~/config/nav"
import type { WithRequired } from "~/types/utils"

export const Header = () => {
  const pathname = usePathname()
  const router = useRouter()

  const [open, setOpen] = useState(false)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        if (
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
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = useCallback((command: () => unknown) => {
    setOpen(false)
    command()
  }, [])

  return (
    <header className="sticky top-0 z-50 h-16 w-full border-b backdrop-blur-sm">
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
                aria-selected={item.href === pathname}
                external={item.external}
                variant={"hover"}
                size={"sm"}
              >
                {item.label}
              </Link>
            ))}
        </nav>
        <div className="flex flex-1 items-center justify-between space-x-3 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Button
              variant="outline"
              className="bg-background text-muted-foreground relative h-9 w-full justify-start text-sm sm:pr-[52px] md:w-64"
              onClick={() => setOpen(true)}
            >
              <span className="flex items-center gap-2">
                <RocketIcon className="h-3.5 w-3.5" />
                Wanna explore?
              </span>
              <kbd className="bg-muted pointer-events-none absolute right-[4.333px] top-[4.333] hidden h-[26px] select-none items-center gap-1 rounded-sm px-2.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>
            <CommandDialog open={open} onOpenChange={setOpen}>
              <CommandInput placeholder="Where do you want to go?" />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Popular Links">
                  {mainPages.map((page) => (
                    <CommandItem
                      key={page.href}
                      value={page.label}
                      onSelect={() => {
                        runCommand(() => router.push(page.href))
                      }}
                    >
                      {page.external ? (
                        <GlobeIcon className="mr-2 h-4 w-4" />
                      ) : (
                        <FileIcon className="mr-2 h-4 w-4" />
                      )}
                      {page.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
                <CommandSeparator className="mb-2 mt-1" />
                {Object.entries(splitPagesByCategory(docsPages)).map(
                  ([category, pages]) => (
                    <CommandGroup key={category} heading={category}>
                      {pages.map((page) => (
                        <CommandItem
                          key={page.href}
                          value={page.label}
                          onSelect={() => {
                            runCommand(() => router.push(page.href))
                          }}
                        >
                          {page.external ? (
                            <GlobeIcon className="mr-2 h-4 w-4" />
                          ) : (
                            <FileIcon className="mr-2 h-4 w-4" />
                          )}
                          {page.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  ),
                )}
              </CommandList>
            </CommandDialog>
          </div>
          <nav className="flex items-center gap-1.5">
            {mainPages
              .filter((i): i is WithRequired<NavItem, "icon"> => !!i.icon)
              .map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  title={item.label}
                  aria-label={item.label}
                  external={item.external}
                  target="_blank"
                  rel="noreferrer"
                  className={buttonVariants({
                    variant: "outline",
                    size: "icon",
                  })}
                >
                  <item.icon className="h-5 w-5" />
                </Link>
              ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
