import { DashboardNavigation } from "~/components/dashboard/navigation"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex h-screen w-screen flex-row">
      <DashboardNavigation />
      <div className="h-full w-full overflow-auto px-6 py-4 sm:px-12 sm:py-8">
        {children}
      </div>
    </main>
  )
}
