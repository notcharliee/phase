import { HamburgerMenuIcon } from "@radix-ui/react-icons"

import { DocsHeader } from "@/components/docs-header"
import { PathParts } from "@/app/docs/components/path-parts"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DocsSidebarNav } from "@/app/docs/components/sidebar-nav"

import { docsNavConfig } from "@/config/nav/docs"

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="flex min-h-screen w-full flex-col">
      <DocsHeader />
      <div className="mx-auto flex min-h-[calc(100dvh-4rem-1px)] w-full max-w-[1400px] gap-12 px-8">
        <aside className="sticky top-16 hidden h-[calc(100dvh-4rem-1px)] w-64 py-8 pr-6 md:block">
          <DocsSidebarNav items={docsNavConfig.sidebarNav} />
        </aside>
        <div className="w-full py-8">
          <div className="text-muted-foreground mb-4 flex items-center space-x-1 text-sm">
            <Sheet>
              <SheetTrigger>
                <HamburgerMenuIcon className="mr-2 block h-4 w-4 md:hidden" />
              </SheetTrigger>
              <SheetContent side={"left"}>
                <DocsSidebarNav items={docsNavConfig.sidebarNav} />
              </SheetContent>
            </Sheet>
            <PathParts />
          </div>
          {children}
        </div>
      </div>
    </main>
  )
}
