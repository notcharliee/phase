import { type Metadata } from "next"
import Link from "next/link"

import { type GuildModules } from "@repo/schemas"

import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { modulesConfig } from "@/config/modules"

import { cn } from "@/lib/utils"

import { getAuthCredentials, getUser } from "../_cache/user"
import { DashboardHeader } from "../components/header"
import { ModuleSwitch } from "./switch"

export const metadata = {
  title: "Modules",
} satisfies Metadata

export default async function Page() {
  const { user, guild } = await getUser(...getAuthCredentials())

  return (
    <div className="px-8 py-10 sm:px-12 sm:py-8">
      <DashboardHeader
        name={user.global_name}
        avatar={user.avatar_url}
        title={metadata.title}
      />
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
        {modulesConfig.map((module, index) => {
          const guildModuleKey = module.name
            .replace(/\b\w/g, (c) => c.toUpperCase())
            .replaceAll(" ", "") as keyof GuildModules

          const guildModule = guild.modules?.[guildModuleKey]

          return (
            <Card
              key={module.name}
              className="animate-in slide-in-from-top-2 fade-in flex flex-col duration-700"
              style={{
                animationDelay: `${150 * Math.floor(index / 3)}ms`,
                animationFillMode: "backwards",
              }}
            >
              <CardHeader className="flex-row justify-between space-y-0">
                <CardTitle>{module.name}</CardTitle>
                <ModuleSwitch
                  moduleKey={guildModuleKey}
                  moduleData={guildModule}
                />
              </CardHeader>
              <CardContent>
                <CardDescription>{module.description}</CardDescription>
              </CardContent>
              <CardFooter className="h-full">
                <Link
                  className={cn(
                    buttonVariants({ variant: "secondary" }),
                    "mt-auto w-full",
                  )}
                  href={`/dashboard/modules${module.path}`}
                >
                  {guildModule ? "Edit module" : "Setup module"}
                </Link>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
