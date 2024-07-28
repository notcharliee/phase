import { OrbitingDots } from "~/components/orbiting-dots"

export default function LogoutPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <OrbitingDots />
      <div className="mx-auto flex w-full max-w-lg flex-col items-center justify-center space-y-6 md:max-w-xl md:space-y-8">
        <div className="text-balance text-center">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Farewell, we'll miss you!
          </h1>
          <p className="text-muted-foreground mt-2 md:text-lg">
            You've successfully been logged out of the dashboard and your
            session has been deleted.
          </p>
        </div>
        <span className="text-muted-foreground/75 text-xs sm:text-sm">
          You may now close this tab.
        </span>
      </div>
    </div>
  )
}
