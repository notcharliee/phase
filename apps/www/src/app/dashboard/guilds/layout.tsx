import { ClientOnly } from "~/components/dashboard/client-only"
import { DashboardNavigation } from "~/components/dashboard/navigation"

import type { LayoutProps } from "~/types/props"

export default function Layout({ children }: LayoutProps) {
  return (
    <main className="flex h-screen w-screen flex-col-reverse sm:flex-row">
      <ClientOnly>
        <DashboardNavigation />
      </ClientOnly>
      <div className="relative h-full w-full overflow-auto p-6 sm:p-12">
        {children}
      </div>
    </main>
  )
}
