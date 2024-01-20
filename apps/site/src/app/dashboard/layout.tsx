import { Suspense } from "react"

import { Settings } from "@/components/dashboard/settings"
import { SelectGuild, SelectGuildFallback } from "@/components/dashboard/modules"
import { User, UserFallback } from "@/components/dashboard/user"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"


export default ({ children }: { children: React.ReactNode }) => (
  <main className="flex flex-col-reverse md:flex-row gap-4 p-8 min-h-screen md:max-h-screen">
    <Card className="w-full grow md:grow-0 md:overflow-auto relative">
      <CardHeader className="border-b border-border flex flex-row items-center justify-between gap-4 space-y-0 py-4 md:sticky md:top-0 md:bg-card">
        <CardTitle className="text-lg">Modules</CardTitle>
        <Suspense fallback={<SelectGuildFallback />}>
          <SelectGuild />
        </Suspense>
      </CardHeader>
      <CardContent className="pt-6">
        {children}
      </CardContent>
    </Card>
    <div className="md:max-w-[20rem] lg:max-w-[24rem] w-full min-h-full flex flex-col-reverse md:flex-col gap-4 md:grow">
      <div className="h-full">
        <Settings />
      </div>
      <div className="h-min">
        <Suspense fallback={<UserFallback />}>
          <User />
        </Suspense>
      </div>
    </div>
  </main>
)