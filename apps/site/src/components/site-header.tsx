"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"

import { GitHubLogoIcon } from "@radix-ui/react-icons"

import { MainNav } from "@/components/main-nav"
import { MobileNav } from "./mobile-nav"
import { Moon } from "@/components/moon"
import { buttonVariants } from "@/components/ui/button"

import { DocsSearch } from "./docs-search"

import { docsConfig } from "@/config/docs"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"


const ignoredPaths: string[] = [
  "/dashboard",
  "/demos",
]


export const SiteHeader = () => {
  const pathname = usePathname()

  return (
    <header className={cn("border-b w-full z-50 sticky top-0 backdrop-blur-sm", ignoredPaths.find(path => pathname.startsWith(path)) && "hidden")}>
      <div className="container flex h-16 max-w-screen-2xl items-center mx-auto px-4">
        <div className="mr-8 hidden md:flex">
          <Link href={"/"} className="mr-6 flex items-center space-x-2">
            <Moon className="h-5 w-5" />
            <span className="hidden font-bold leading-tight sm:inline-block">Phase Bot</span>
          </Link>
          <MainNav items={docsConfig.mainNav} />
        </div>
        <MobileNav pageNav={docsConfig.sidebarNav} />
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <DocsSearch />
          </div>
          <nav className="flex items-center">
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={cn(
                  buttonVariants({
                    variant: "ghost",
                  }),
                  "w-9 px-0"
                )}
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