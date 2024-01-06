"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"

import {
  HamburgerMenuIcon,
} from "@radix-ui/react-icons"

import {
  DetailedHTMLProps,
  HTMLAttributes,
} from "react"

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"


export const MobileNaviagtion = () => {
  const pathname = usePathname() 
  .replace("/docs", "Docs")
  .replaceAll("-", " ")
  .replace(/\b\w/g, match => match.toUpperCase())
  .split("/")

  if (pathname.length == 1) pathname.push("Introduction")
  
  return (
    <div className="mb-4 flex items-center space-x-1 text-muted-foreground text-sm">
      <Sheet>
        <SheetTrigger>
          <HamburgerMenuIcon className="mr-2 h-4 w-4 md:hidden block" />
        </SheetTrigger>
        <SheetContent side={"left"}>
          <SidebarLinks className="flex flex-col gap-4" />
        </SheetContent>
      </Sheet>
      {pathname.map((part, index) => (
        <div className="flex items-center space-x-1">
          <span className={index+1 == pathname.length ? "font-medium text-foreground" : ""}>{part}</span>
          {index+1 != pathname.length ? (
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
              <path d="M6.1584 3.13508C6.35985 2.94621 6.67627 2.95642 6.86514 3.15788L10.6151 7.15788C10.7954 7.3502 10.7954 7.64949 10.6151 7.84182L6.86514 11.8418C6.67627 12.0433 6.35985 12.0535 6.1584 11.8646C5.95694 11.6757 5.94673 11.3593 6.1356 11.1579L9.565 7.49985L6.1356 3.84182C5.94673 3.64036 5.95694 3.32394 6.1584 3.13508Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
            </svg>
          ) : null}
        </div>
      ))}
    </div>
  )
}


export const SidebarLinks = (props: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => {
  const pathname = usePathname()
  const color = (href: string) => pathname == href ? "rgb(248 248 248 / var(--tw-text-opacity))" : undefined

  return (
    <div {...props}>
      <div>
        <h4 className="mb-1 py-1 font-semibold">Getting Started</h4>
        <div className="flex flex-col text-sm text-muted-foreground children:py-1 hover:children:underline">
          <Link href={"/docs"} style={{ color: color("/docs") }}>Introduction</Link>
        </div>
      </div>
      <div>
        <h4 className="mb-1 py-1 font-semibold">Modules</h4>
        <div className="flex flex-col text-sm text-muted-foreground children:py-1 hover:children:underline">
          <Link href={"/docs/modules/audit-logs"} style={{ color: color("/docs/modules/audit-logs") }}>Audit Logs</Link>
          <Link href={"/docs/modules/auto-partner"} style={{ color: color("/docs/modules/auto-partner") }}>Auto Partners</Link>
          <Link href={"/docs/modules/auto-roles"} style={{ color: color("/docs/modules/auto-roles") }}>Auto Roles</Link>
          <Link href={"/docs/modules/join-to-create"} style={{ color: color("/docs/modules/join-to-create") }}>Join to Create</Link>
          <Link href={"/docs/modules/levels"} style={{ color: color("/docs/modules/levels") }}>Levels</Link>
          <Link href={"/docs/modules/reaction-roles"} style={{ color: color("/docs/modules/reaction-roles") }}>Reaction Roles</Link>
          <Link href={"/docs/modules/tickets"} style={{ color: color("/docs/modules/tickets") }}>Tickets</Link>
        </div>
      </div>
      <div>
        <h4 className="mb-1 py-1 font-semibold">Commands</h4>
        <div className="flex flex-col text-sm text-muted-foreground children:py-1 hover:children:underline">
          <Link href="/docs/commands/cat" style={{ color: color("/docs/commands/cat") }}>/cat</Link>
          <Link href="/docs/commands/catfact" style={{ color: color("/docs/commands/catfact") }}>/catfact</Link>
          <Link href="/docs/commands/coinflip" style={{ color: color("/docs/commands/coinflip") }}>/coinflip</Link>
          <Link href="/docs/commands/compliment" style={{ color: color("/docs/commands/compliment") }}>/compliment</Link>
          <Link href="/docs/commands/dadjoke" style={{ color: color("/docs/commands/dadjoke") }}>/dadjoke</Link>
          <Link href="/docs/commands/dog" style={{ color: color("/docs/commands/dog") }}>/dog</Link>
          <Link href="/docs/commands/duck" style={{ color: color("/docs/commands/duck") }}>/duck</Link>
          <Link href="/docs/commands/rps" style={{ color: color("/docs/commands/rps") }}>/rps</Link>
          <Link href="/docs/commands/tictactoe" style={{ color: color("/docs/commands/tictactoe") }}>/tictactoe</Link>
          <Link href="/docs/commands/avatar" style={{ color: color("/docs/commands/avatar") }}>/avatar</Link>
          <Link href="/docs/commands/github" style={{ color: color("/docs/commands/github") }}>/github</Link>
          <Link href="/docs/commands/membercount" style={{ color: color("/docs/commands/membercount") }}>/membercount</Link>
          <Link href="/docs/commands/ping" style={{ color: color("/docs/commands/ping") }}>/ping</Link>
          <Link href="/docs/commands/whois" style={{ color: color("/docs/commands/whois") }}>/whois</Link>
          <Link href="/docs/commands/youtube" style={{ color: color("/docs/commands/youtube") }}>/youtube</Link>
          <Link href="/docs/commands/coffee" style={{ color: color("/docs/commands/coffee") }}>/coffee</Link>
          <Link href="/docs/commands/help" style={{ color: color("/docs/commands/help") }}>/help</Link>
          <Link href="/docs/commands/announce" style={{ color: color("/docs/commands/announce") }}>/announce</Link>
          <Link href="/docs/commands/lock" style={{ color: color("/docs/commands/lock") }}>/lock</Link>
          <Link href="/docs/commands/nuke" style={{ color: color("/docs/commands/nuke") }}>/nuke</Link>
          <Link href="/docs/commands/purge" style={{ color: color("/docs/commands/purge") }}>/purge</Link>
          <Link href="/docs/commands/afk" style={{ color: color("/docs/commands/afk") }}>/afk</Link>
          <Link href="/docs/commands/giveaway-create" style={{ color: color("/docs/commands/giveaway-create") }}>/giveaway create</Link>
          <Link href="/docs/commands/giveaway-delete" style={{ color: color("/docs/commands/giveaway-delete") }}>/giveaway delete</Link>
          <Link href="/docs/commands/giveaway-reroll" style={{ color: color("/docs/commands/giveaway-reroll") }}>/giveaway reroll</Link>
          <Link href="/docs/commands/level-rank" style={{ color: color("/docs/commands/level-rank") }}>/level rank</Link>
          <Link href="/docs/commands/level-leaderboard" style={{ color: color("/docs/commands/level-leaderboard") }}>/level leaderboard</Link>
          <Link href="/docs/commands/level-set" style={{ color: color("/docs/commands/level-set") }}>/level set</Link>
          <Link href="/docs/commands/partner-add" style={{ color: color("/docs/commands/partner-add") }}>/partner add</Link>
          <Link href="/docs/commands/partner-advert" style={{ color: color("/docs/commands/partner-advert") }}>/partner advert</Link>
          <Link href="/docs/commands/partner-channel" style={{ color: color("/docs/commands/partner-channel") }}>/partner channel</Link>
          <Link href="/docs/commands/partner-invite" style={{ color: color("/docs/commands/partner-invite") }}>/partner invite</Link>
          <Link href="/docs/commands/partner-list" style={{ color: color("/docs/commands/partner-list") }}>/partner list</Link>
          <Link href="/docs/commands/partner-remove" style={{ color: color("/docs/commands/partner-remove") }}>/partner remove</Link>
          <Link href="/docs/commands/tag-add" style={{ color: color("/docs/commands/tag-add") }}>/tag add</Link>
          <Link href="/docs/commands/tag-edit" style={{ color: color("/docs/commands/tag-edit") }}>/tag edit</Link>
          <Link href="/docs/commands/tag-get" style={{ color: color("/docs/commands/tag-get") }}>/tag get</Link>
          <Link href="/docs/commands/tag-list" style={{ color: color("/docs/commands/tag-list") }}>/tag list</Link>
          <Link href="/docs/commands/tag-remove" style={{ color: color("/docs/commands/tag-remove") }}>/tag remove</Link>
          <Link href="/docs/commands/echo" style={{ color: color("/docs/commands/echo") }}>/echo</Link>
          <Link href="/docs/commands/embed" style={{ color: color("/docs/commands/embed") }}>/embed</Link>
          <Link href="/docs/commands/poll" style={{ color: color("/docs/commands/poll") }}>/poll</Link>
        </div>
      </div>
    </div>
  )
}