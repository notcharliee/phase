"use client"

import { Fragment } from "react"

import { usePathname } from "next/navigation"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { DocsHeader } from "@/components/docs-header"
import { DocsSidebarNav } from "./components/sidebar-nav"

import { docsNavConfig } from "@/config/nav/docs"

import { cn } from "@/lib/utils"

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <main className="flex min-h-screen w-full flex-col">
      <DocsHeader />
      <div className="mx-auto flex min-h-[calc(100dvh-4rem-1px)] w-full max-w-[1400px] gap-12 px-8">
        <aside className="sticky top-16 hidden h-[calc(100dvh-4rem-1px)] w-64 py-8 pr-6 md:block">
          <DocsSidebarNav items={docsNavConfig.sidebarNav} />
        </aside>
        <div className="w-full py-8">
          <Breadcrumb className="mb-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              {pathname.split("/").map((part, index, parts) => {
                if (part === "") return null

                const partsLength = parts.length
                const href = parts.slice(0, index + 1).join("/")

                return (
                  <Fragment key={index}>
                    <BreadcrumbItem>
                      <BreadcrumbLink
                        href={href}
                        className={cn(
                          index + 1 === partsLength && "text-foreground",
                        )}
                      >
                        {part
                          .replaceAll("-", " ")
                          .replace(/\b\w/g, (match) => match.toUpperCase())}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    {index + 1 !== partsLength && <BreadcrumbSeparator />}
                  </Fragment>
                )
              })}
            </BreadcrumbList>
          </Breadcrumb>
          {children}
        </div>
      </div>
    </main>
  )
}
