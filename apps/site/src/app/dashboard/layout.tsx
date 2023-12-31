import UserFallback from "@/app/dashboard/@user/loading"
import GuildsFallback from "@/app/dashboard/@guilds/loading"
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
}) => {
  return (
    <>
      <div className="pointer-events-none fixed h-full w-full overflow-hidden before:absolute before:-left-1/2 before:-top-1/2 before:h-[200%] before:w-[200%] before:animate-[noise_2s_steps(3)_both_infinite] before:bg-[auto_768px] before:bg-[url(/noise.png)]"/>
      <main className="flex flex-col gap-6 p-10 h-screen bg-dark-800">
        <div className="flex flex-col sm:flex-row gap-6 relative z-10">
          <Suspense fallback={ <UserFallback /> }>
            <div className="max-w-md w-full">{user}</div>
          </Suspense>
          <Suspense fallback={ <GuildsFallback /> }>
            <div className="w-full">{guilds}</div>
          </Suspense>
        </div>
        <div className="grow flex gap-6 relative z-10 flex-col md:flex-row">
          <div className="w-full">{modules}</div>
          <div className="max-w-md w-full h-full">{settings}</div>
        </div>
      </main>
    </>
  )
}
