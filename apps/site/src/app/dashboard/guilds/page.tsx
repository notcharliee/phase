import NextLink from "next/link"
import { Suspense } from "react"

import { PlusIcon } from "@radix-ui/react-icons"

import { GuildCardGrid } from "~/components/dashboard/guilds/guild-card-grid"
import { GuildCardSearch } from "~/components/dashboard/guilds/guild-card-search"
import { Button } from "~/components/ui/button"

import { getGuilds } from "~/app/dashboard/guilds/actions"
import { auth } from "~/auth"

export default function GuildsPage() {
  return (
    <div className="[--column-count:1] lg:[--column-count:2] xl:[--column-count:3]">
      <div className="mb-8 grid w-full grid-cols-[repeat(var(--column-count),minmax(0,1fr))] gap-4">
        <h1 className="hidden text-3xl font-bold lg:block xl:col-span-2">
          Select a guild
        </h1>
        <div className="flex space-x-2">
          <GuildCardSearch />
          <Button className="gap-2" asChild>
            <NextLink href={"/redirect/invite"}>
              <span className="hidden sm:inline">Add Guild</span>
              <span className="inline sm:hidden">Add</span>
              <PlusIcon className="h-4 w-4" />
            </NextLink>
          </Button>
        </div>
      </div>
      <Suspense fallback={"Loading guilds..."}>
        {(async () => {
          const session = (await auth())!
          const guilds = await getGuilds(session.user.id)

          return <GuildCardGrid guilds={guilds} />
        })()}
      </Suspense>
    </div>
  )
}
