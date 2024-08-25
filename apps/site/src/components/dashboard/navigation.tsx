"use client"

import NextLink from "next/link"
import { usePathname } from "next/navigation"

import { DashboardIcon, MixerHorizontalIcon } from "@radix-ui/react-icons"
import { useMediaQuery } from "@uidotdev/usehooks"

import { Link } from "~/components/ui/link"

import { cn } from "~/lib/utils"

import { Label } from "../ui/label"

export function DashboardNavigation() {
  const isMobile = useMediaQuery("not all and (min-width: 640px)")

  return isMobile ? (
    <nav className="bg-background text-muted-foreground before:from-background relative flex w-screen justify-evenly border-t py-5 before:absolute before:top-[-25px] before:h-6 before:w-full before:bg-gradient-to-t before:to-transparent">
      <NavigationItem
        label={"Modules"}
        href={"/dashboard/modules"}
        icon={DashboardIcon}
        mobile
      />
      <NavigationItem
        label={"Commands"}
        href={"/dashboard/commands"}
        icon={CommandsIcon}
        mobile
      />
      <NavigationItem
        label={"Settings"}
        href={"/dashboard/settings"}
        icon={MixerHorizontalIcon}
        mobile
      />
    </nav>
  ) : (
    <nav className="flex h-screen min-w-[20rem] flex-col justify-between border-r p-12">
      <div className="space-y-12">
        <h3 className="text-4xl font-bold leading-none tracking-tighter">
          Phase
        </h3>
        <div className="space-y-1.5">
          <NavigationItem
            label={"Modules"}
            href={"/dashboard/modules"}
            icon={DashboardIcon}
          />
          <NavigationItem
            label={"Commands"}
            href={"/dashboard/commands"}
            icon={CommandsIcon}
          />
          <NavigationItem
            label={"Settings"}
            href={"/dashboard/settings"}
            icon={MixerHorizontalIcon}
          />
        </div>
        <div className="flex flex-col">
          <Label className="mb-1.5 text-base uppercase">Resources</Label>
          <NavigationItem label={"Support"} href={"/redirect/discord"} />
          <NavigationItem label={"Documentation"} href={"/docs"} />
        </div>
        <div className="flex flex-col">
          <Label className="mb-1.5 text-base uppercase">Other Links</Label>
          <NavigationItem label={"Feedback"} href={"/redirect/discord"} />
          <NavigationItem label={"Report a Bug"} href={"/contact/bug-report"} />
          <NavigationItem label={"Donate"} href={"/redirect/donate"} />
        </div>
      </div>
      <div className="text-muted-foreground before:bg-foreground relative flex flex-col font-mono text-sm saturate-0 before:absolute before:-left-4 before:h-full before:w-1 before:rounded-l-sm">
        <span>
          Made with ❤ by <Link href={"/redirect/developer"}>mikaela.</Link>
        </span>
        <span>
          Source code is on <Link href={"/redirect/github"}>GitHub.</Link>
        </span>
      </div>
    </nav>
  )
}

interface NavigationItemProps {
  href: string
  label: string
  icon?: typeof DashboardIcon | typeof CommandsIcon
  mobile?: boolean
}

function NavigationItem(props: NavigationItemProps) {
  const pathname = usePathname()

  return props.icon ? (
    <NextLink
      href={props.href}
      aria-selected={pathname === props.href}
      className={cn(
        "relative flex before:absolute before:opacity-0 aria-selected:before:opacity-100",
        props.mobile
          ? "aria-selected:text-foreground justify-center before:-bottom-3 before:z-10 before:h-1 before:w-3.5 before:rounded-sm"
          : "before:bg-primary aria-selected:text-primary-foreground w-full items-center gap-2.5 py-2.5 before:-left-5 before:h-full before:w-[calc(100%+2.5rem)] before:rounded-full",
      )}
    >
      {props.mobile ? (
        <>
          <props.icon className="size-7 duration-200" />
          <span className="sr-only">{props.label}</span>
        </>
      ) : (
        <>
          <props.icon className="z-10 size-6" />
          <span className="relative z-10 text-lg font-medium leading-none">
            {props.label}
          </span>
        </>
      )}
    </NextLink>
  ) : !props.mobile ? (
    <NextLink
      href={props.href}
      className="text-muted-foreground hover:text-foreground"
    >
      {props.label}
    </NextLink>
  ) : null
}

const CommandsIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="30"
    height="30"
    viewBox="0 0 30 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M25 4H5C4.44772 4 4 4.44772 4 5V25C4 25.5522 4.44772 26 5 26H25C25.5522 26 26 25.5522 26 25V5C26 4.44772 25.5522 4 25 4ZM5 2C3.34314 2 2 3.34314 2 5V25C2 26.6568 3.34314 28 5 28H25C26.6568 28 28 26.6568 28 25V5C28 3.34314 26.6568 2 25 2H5Z"
      fill="currentColor"
    />
    <path
      d="M16.3265 8.5L10.9695 21.5H13.6734L19.0305 8.5H16.3265Z"
      fill="currentColor"
    />
  </svg>
)
