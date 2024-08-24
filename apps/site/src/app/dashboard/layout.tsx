import { DashboardNavigation } from "~/components/dashboard/navigation"

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="flex h-screen w-screen flex-row">
      <DashboardNavigation />
      <div className="h-[calc(100%-4.5rem)] w-full overflow-auto p-6 sm:h-full sm:p-12">
        {children}
      </div>
    </main>
  )
}
