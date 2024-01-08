"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"

import commands from "@/lib/commands"
import modules from "@/lib/modules"

import {
  DetailedHTMLProps,
  HTMLAttributes,
} from "react"

import {
  HamburgerMenuIcon,
} from "@radix-ui/react-icons"

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"


export default ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()

  const pathnameParts = pathname
  .replace("/docs", "Docs")
  .replaceAll("-", " ")
  .replace(/\b\w/g, match => match.toUpperCase())
  .split("/")

  if (pathnameParts.length == 1) pathnameParts.push("Introduction")

  return (
    <div className="w-full max-w-[1400px] min-h-screen mx-auto flex gap-12 px-8">
      <aside className="w-64 h-screen sticky top-0 hidden md:block">
        <SidebarLinks className="py-6 lg:py-8 pr-6 h-full flex flex-col gap-4 overflow-auto scrollbar-float" pathname={pathname} />
      </aside>
      <main className="py-8 w-full">
        <div className="mb-4 flex items-center space-x-1 text-muted-foreground text-sm">
          <Sheet>
            <SheetTrigger>
              <HamburgerMenuIcon className="mr-2 h-4 w-4 md:hidden block" />
            </SheetTrigger>
            <SheetContent side={"left"}>
              <SidebarLinks className="flex flex-col gap-4" pathname={pathname} />
            </SheetContent>
          </Sheet>
          {pathnameParts.map((part, index) => (
            <div className="flex items-center space-x-1" key={index}>
              <span className={index+1 == pathnameParts.length ? "font-medium text-foreground" : ""}>{part}</span>
              {index+1 != pathnameParts.length ? (
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                  <path d="M6.1584 3.13508C6.35985 2.94621 6.67627 2.95642 6.86514 3.15788L10.6151 7.15788C10.7954 7.3502 10.7954 7.64949 10.6151 7.84182L6.86514 11.8418C6.67627 12.0433 6.35985 12.0535 6.1584 11.8646C5.95694 11.6757 5.94673 11.3593 6.1356 11.1579L9.565 7.49985L6.1356 3.84182C5.94673 3.64036 5.95694 3.32394 6.1584 3.13508Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
                </svg>
              ) : null}
            </div>
          ))}
        </div>
        {children}
      </main>
    </div>
  )
}


const SidebarLinks = (props: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & { pathname: string }) => (
  <div {...props}>
    <div>
      <h4 className="mb-1 py-1 font-semibold">Getting Started</h4>
      <div className="flex flex-col text-sm text-muted-foreground children:py-1 hover:children:underline">
        <Link
          href={"/docs"}
          className={props.pathname == "/docs" ? "text-foreground" : ""}
          children={"Introduction"}
        />
      </div>
    </div>
    <div>
      <h4 className="mb-1 py-1 font-semibold">Modules</h4>
      <div className="flex flex-col text-sm text-muted-foreground children:py-1 hover:children:underline">
        {modules.map((module, index) => (
          <Link
            href={module.docs_url}
            key={index}
            className={module.docs_url.endsWith(props.pathname) ? "text-foreground" : ""}
            children={module.name}
          />
        ))}
      </div>
    </div>
    <div>
      <h4 className="mb-1 py-1 font-semibold">Commands</h4>
      <div className="flex flex-col text-sm text-muted-foreground children:py-1 hover:children:underline">
        {commands.map((command, index) => (
          <Link
            href={`/docs/commands/${command.name.replaceAll(" ", "-")}`}
            key={index}
            className={props.pathname == `/docs/commands/${command.name.replaceAll(" ", "-")}` ? "text-foreground" : ""}
            children={"/"+command.name}
          />
        ))}
      </div>
    </div>
  </div>
)
