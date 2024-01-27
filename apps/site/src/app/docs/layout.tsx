import { HamburgerMenuIcon } from "@radix-ui/react-icons"

import { docsConfig } from "@/config/docs"

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

import { PathParts } from "./components/path-parts"
import { DocsSidebarNav } from "./components/sidebar-nav"


export default ({ children }: { children: React.ReactNode }) => (
  <div className="w-full max-w-[1400px] min-h-screen mx-auto flex gap-12 px-8">
    <aside className="w-64 h-screen py-6 lg:py-8 pr-6 sticky top-0 hidden md:block">
      <DocsSidebarNav items={docsConfig.sidebarNav} />
    </aside>
    <main className="py-8 w-full">
      <div className="mb-4 flex items-center space-x-1 text-muted-foreground text-sm">
        <Sheet>
          <SheetTrigger>
            <HamburgerMenuIcon className="mr-2 h-4 w-4 md:hidden block" />
          </SheetTrigger>
          <SheetContent side={"left"}>
            <DocsSidebarNav items={docsConfig.sidebarNav} />
          </SheetContent>
        </Sheet>
        <PathParts />
      </div>
      {children}
    </main>
  </div>
)