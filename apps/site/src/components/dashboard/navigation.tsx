"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { DashboardIcon, GearIcon } from "@radix-ui/react-icons"

export const DashboardNavigation = () => {
  const pathname = usePathname().replace("/dashboard/", "")

  return (
    <>
      <nav className="hidden h-screen min-w-[20rem] flex-col justify-between border-r p-12 sm:flex">
        <div className="flex flex-col gap-16">
          <h3 className="text-4xl font-semibold leading-none">Phase</h3>
          <div className="flex flex-col gap-6">
            <Link
              href={"/dashboard/modules"}
              className="aria-selected:text-muted-background before:bg-foreground flex w-full items-center gap-2.5 before:absolute before:-ml-5  before:h-[2.75rem] before:w-[16.5rem] before:rounded-2xl before:opacity-0 aria-selected:before:opacity-100"
              aria-selected={pathname === "modules"}
            >
              <DashboardIcon className="z-10 size-6" />
              <span className="z-10 text-lg font-medium leading-none">
                Modules
              </span>
            </Link>
            <Link
              href={"/dashboard/commands"}
              className="aria-selected:text-muted-background before:bg-foreground flex w-full items-center gap-2.5 before:absolute before:-ml-5  before:h-[2.75rem] before:w-[16.5rem] before:rounded-2xl before:opacity-0 aria-selected:before:opacity-100"
              aria-selected={pathname === "commands"}
            >
              <CommandsIcon className="z-10 size-6" />
              <span className="z-10 text-lg font-medium leading-none">
                Commands
              </span>
            </Link>
            <Link
              href={"/dashboard/settings"}
              className="aria-selected:text-muted-background before:bg-foreground flex w-full items-center gap-2.5 before:absolute before:-ml-5  before:h-[2.75rem] before:w-[16.5rem] before:rounded-2xl before:opacity-0 aria-selected:before:opacity-100"
              aria-selected={pathname === "settings"}
            >
              <GearIcon className="z-10 size-6" />
              <span className="z-10 text-lg font-medium leading-none">
                Settings
              </span>
            </Link>
          </div>
          <div className="flex flex-col">
            <h4 className="mb-1.5 font-medium uppercase">Resources</h4>
            <Link
              href={"/redirect/discord"}
              className="text-muted-foreground hover:text-foreground"
            >
              Support
            </Link>
            <Link
              href={"/docs"}
              className="text-muted-foreground hover:text-foreground duration-200"
            >
              Documentation
            </Link>
          </div>
          <div className="flex flex-col">
            <h4 className="mb-1.5 font-medium uppercase">Other Links</h4>
            <Link
              href={"/redirect/discord"}
              className="text-muted-foreground hover:text-foreground duration-200"
            >
              Feedback
            </Link>
            <Link
              href={"/redirect/discord"}
              className="text-muted-foreground hover:text-foreground duration-200"
            >
              Report a Bug
            </Link>
            <Link
              href={"/redirect/donate"}
              className="text-muted-foreground hover:text-foreground duration-200"
            >
              Donate
            </Link>
          </div>
        </div>
        <div className="text-muted-foreground before:bg-foreground relative flex flex-col font-mono text-sm saturate-0 before:absolute before:-left-4 before:h-full before:w-1 before:rounded-l-sm">
          <span>
            Made with ❤ by{" "}
            <Link
              href={"/redirect/developer"}
              className="underline underline-offset-2"
            >
              mikaela
            </Link>
            .
          </span>
          <span>
            Source code is on{" "}
            <Link
              href={"/redirect/github"}
              className="underline underline-offset-2"
            >
              GitHub
            </Link>
            .
          </span>
        </div>
      </nav>
      <nav className="bg-muted-background text-muted-foreground fixed bottom-0 z-50 flex w-screen justify-evenly rounded-t-[2rem] py-6 sm:hidden">
        <Link
          href={"/dashboard/modules"}
          className="before:bg-foreground aria-selected:text-foreground relative flex justify-center before:absolute before:-bottom-3.5 before:z-10 before:h-1 before:w-3.5 before:rounded-sm before:opacity-0 aria-selected:before:opacity-100"
          aria-selected={pathname === "modules"}
        >
          <DashboardIcon className="size-7 duration-200" />
        </Link>
        <Link
          href={"/dashboard/commands"}
          className="before:bg-foreground aria-selected:text-foreground relative flex justify-center before:absolute before:-bottom-3.5 before:z-10 before:h-1 before:w-3.5 before:rounded-sm before:opacity-0 aria-selected:before:opacity-100"
          aria-selected={pathname === "commands"}
        >
          <CommandsIcon className="size-7 duration-200" />
        </Link>
        <Link
          href={"/dashboard/settings"}
          className="before:bg-foreground aria-selected:text-foreground relative flex justify-center before:absolute before:-bottom-3.5 before:z-10 before:h-1 before:w-3.5 before:rounded-sm before:opacity-0 aria-selected:before:opacity-100"
          aria-selected={pathname === "settings"}
        >
          <GearIcon className="size-7 duration-200" />
        </Link>
      </nav>
    </>
  )
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
