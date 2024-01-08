import UserFallback from "@/app/dashboard/@user/loading"

import { Suspense } from "react"

export default ({
  user,
  guilds,
  modules,
  settings,
}: {
  user: React.ReactNode,
  guilds: React.ReactNode,
  modules: React.ReactNode,
  settings: React.ReactNode,
}) => (
  <main className="flex flex-col-reverse md:flex-row gap-4 p-10 h-screen">
    <div className="w-full h-full">{modules}</div>
    <div className="w-96 h-full flex flex-col gap-4">
      <div className="h-full">{settings}</div>
      <Suspense fallback={<UserFallback />}>
        <div className="w-full h-min">{user}</div>
      </Suspense>
    </div>
  </main>
)