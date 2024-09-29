import { OrbitingDots } from "~/components/orbiting-dots"

import type { LayoutProps } from "~/types/props"

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <OrbitingDots />
      <div className="mx-auto flex w-full max-w-lg flex-col items-center justify-center space-y-6 md:max-w-xl md:space-y-8">
        {children}
      </div>
    </div>
  )
}
