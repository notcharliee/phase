import Link from "next/link"

import { ExitIcon } from "@radix-ui/react-icons"

import { buttonVariants } from "@/components/ui/button"

import { cn } from "@/lib/utils"

import { DashboardSidebarNav } from "./components/sidebar-nav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="bg-primary-foreground absolute top-0 flex h-screen w-screen overflow-hidden">
      <aside className="hidden h-screen min-w-[20rem] flex-col justify-between border-r bg-neutral-950 p-8 shadow-xl md:flex">
        <DashboardSidebarNav />
        <Link
          prefetch={false}
          href={"/dashboard/signout"}
          className={cn(
            buttonVariants({ variant: "outline", size: "xl" }),
            "bg-background gap-2.5 shadow-lg",
          )}
        >
          <ExitIcon className="h-4 w-4" />
          Sign Out
        </Link>
      </aside>
      <div className="min-h-screen w-full overflow-auto">{children}</div>
    </main>
  )
}
