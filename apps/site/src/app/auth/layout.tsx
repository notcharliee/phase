import { OrbitingDots } from "~/components/orbiting-dots"

import type { LayoutProps } from "~/types/props"

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="fixed left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2">
        <OrbitingDots size={"screen"} />
      </div>
      <div className="mx-auto flex w-full max-w-lg flex-col items-center justify-center space-y-6 md:max-w-xl md:space-y-8">
        {children}
      </div>
    </div>
  )
}
