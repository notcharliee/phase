"use client"

import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"

import { useCallback, useEffect, useState } from "react"

import {
  CircleIcon,
  FileIcon,
  GitHubLogoIcon,
  GlobeIcon,
  RocketIcon,
} from "@radix-ui/react-icons"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Moon } from "@/components/moon"

import { docsNavConfig } from "@/config/nav/docs"
import { siteConfig } from "@/config/site"

import { cn } from "@/lib/utils"

export const DocsHeader = () => {
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
    <header className="sticky top-0 z-50 w-full border-b backdrop-blur-sm">
      <div className="mx-auto flex h-16 items-center px-8">
        <nav className="mr-8 hidden items-center space-x-4 md:flex lg:space-x-6">
          <Link href={"/"} className="mr-6 flex items-center space-x-2">
            <Moon className="h-5 w-5" />
            <span className="font-bold leading-tight">Phase Bot</span>
          </Link>
          {docsNavConfig.mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href!}
              className={cn(
                "hover:text-primary text-sm font-medium transition-colors",
                pathname !== item.href && "text-muted-foreground",
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Button
              variant="outline"
              className={cn(
                "bg-background text-muted-foreground relative h-8 w-full justify-start rounded-[0.5rem] text-sm font-normal shadow-none sm:pr-12 md:w-64",
              )}
              onClick={() => setOpen(true)}
            >
              <span className="flex items-center gap-2">
                <RocketIcon className="h-3.5 w-3.5" />
                Wanna explore?
              </span>
              <kbd className="bg-muted pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>
            <CommandDialog open={open} onOpenChange={setOpen}>
              <CommandInput placeholder="Where do you want to go?" />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Popular Links">
                  <CommandItem
                    value={"Homepage"}
                    onSelect={() => {
                      runCommand(() => router.push("/"))
                    }}
                  >
                    <FileIcon className="mr-2 h-4 w-4" />
                    Homepage
                  </CommandItem>
                  {docsNavConfig.mainNav
                    .filter((navitem) => !navitem.external)
                    .map((navItem) => (
                      <CommandItem
                        key={navItem.href}
                        value={navItem.title}
                        onSelect={() => {
                          runCommand(() => router.push(navItem.href as string))
                        }}
                      >
                        <FileIcon className="mr-2 h-4 w-4" />
                        {navItem.title}
                      </CommandItem>
                    ))}
                  {docsNavConfig.mainNav
                    .filter((navitem) => navitem.external)
                    .map((navItem) => (
                      <CommandItem
                        key={navItem.href}
                        value={navItem.title}
                        onSelect={() => {
                          runCommand(() => router.push(navItem.href as string))
                        }}
                      >
                        <GlobeIcon className="mr-2 h-4 w-4" />
                        {navItem.title}
                      </CommandItem>
                    ))}
                </CommandGroup>
                <CommandSeparator className="mt-1 mb-2" />
                {docsNavConfig.sidebarNav.map((group) => (
                  <CommandGroup key={group.title} heading={group.title}>
                    {group.items.map((navItem) => (
                      <CommandItem
                        key={navItem.href}
                        value={navItem.title}
                        onSelect={() => {
                          runCommand(() => router.push(navItem.href as string))
                        }}
                      >
                        <div className="mr-2 flex h-4 w-4 items-center justify-center">
                          <CircleIcon className="h-3 w-3" />
                        </div>
                        {navItem.title}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                ))}
              </CommandList>
            </CommandDialog>
          </div>
          <nav className="flex items-center">
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={cn(buttonVariants({ variant: "ghost" }), "w-9 px-0")}
              >
                <GitHubLogoIcon className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </div>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
