import Link from "next/link"

import QuickNavigate from "@/components/QuickNavigate"

import axios from "axios"
import discord_api_types_v10 from "discord-api-types/v10"

// Exporting route group layout

export default async ({ children }: { children: React.ReactNode }) => {
  // const commandArray = await axios.get<discord_api_types_v10.RESTGetAPIApplicationCommandsResult>(process.env.BASE_URL + '/api/bot/commands')

  return (
    <div className="font-poppins flex min-h-dvh flex-col gap-3 bg-dark-900 p-6 text-light-800 md:flex-row">
      <div className="flex max-h-[calc(100vh-48px)] min-h-full flex-col gap-3">
        <div className="flex items-center justify-between rounded border border-dark-600 p-3">
          <Link href="/docs" className="text-xl font-bold">
            <span>phase</span>
            <span className="text-phase">docs</span>
          </Link>
          <QuickNavigate text="min"></QuickNavigate>
        </div>
        <nav className="scrollbar-float hidden h-full min-w-[280px] flex-col gap-6 overflow-y-auto rounded border border-dark-600 p-3 md:flex">
          <div className="flex flex-col gap-3">
            <div>
              <Link
                href="/docs"
                className="text-lg font-semibold decoration-phase underline-offset-4 duration-150 hover:underline"
              >
                Introduction
              </Link>
              <div className="mt-1.5 flex flex-col pl-1 text-sm leading-6 text-light-100">
                <Link
                  className="duration-150 hover:text-phase"
                  href="/docs#what-is-phase"
                >
                  What is Phase?
                </Link>
                <Link
                  className="duration-150 hover:text-phase"
                  href="/docs#why-should-i-use-phase"
                >
                  Why should I use Phase?
                </Link>
              </div>
            </div>
            <div>
              <Link
                href="/docs/modules"
                className="text-lg font-semibold decoration-phase underline-offset-4 duration-150 hover:underline"
              >
                Modules
              </Link>
              <div className="mt-1.5 flex flex-col pl-1 text-sm leading-6 text-light-100">
                <Link
                  className="duration-150 hover:text-phase"
                  href="/docs/modules#afks"
                >
                  AFKs
                </Link>
                <Link
                  className="duration-150 hover:text-phase"
                  href="/docs/modules#auditlogs"
                >
                  Audit Logs
                </Link>
                <Link
                  className="duration-150 hover:text-phase"
                  href="/docs/modules#autopartners"
                >
                  Auto Partners
                </Link>
                <Link
                  className="duration-150 hover:text-phase"
                  href="/docs/modules#autoroles"
                >
                  Auto Roles
                </Link>
                <Link
                  className="duration-150 hover:text-phase"
                  href="/docs/modules#giveaways"
                >
                  Giveaways
                </Link>
                <Link
                  className="duration-150 hover:text-phase"
                  href="/docs/modules#jointocreate"
                >
                  Join to Create
                </Link>
                <Link
                  className="duration-150 hover:text-phase"
                  href="/docs/modules#levels"
                >
                  Levels & XP
                </Link>
                <Link
                  className="duration-150 hover:text-phase"
                  href="/docs/modules#reactionroles"
                >
                  Reaction Roles
                </Link>
                <Link
                  className="duration-150 hover:text-phase"
                  href="/docs/modules#tickets"
                >
                  Tickets
                </Link>
              </div>
            </div>
            <div>
              <Link href="/docs/commands" className="font-semibold">
                Commands
              </Link>
              <div className="mt-1.5 flex flex-col pl-2 text-sm leading-6 text-light-100">
                {/* {commandArray.data.map((command, key) => {
                  return <Link key={key} href={`/docs/commands/${command.name}`}>/{command.name}</Link>
                })} */}
              </div>
            </div>
          </div>
        </nav>
      </div>
      <main className="scrollbar-float w-full flex-grow scroll-pt-6 overflow-y-auto scroll-smooth break-words rounded border border-dark-600 bg-grid p-6 md:max-h-[calc(100vh-48px)]">
        {children}
      </main>
    </div>
  )
}
