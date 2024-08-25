import { DashboardNavigation } from "~/components/dashboard/navigation"

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="flex h-screen w-screen flex-col-reverse sm:flex-row">
      <DashboardNavigation />
      <div className="h-full w-full overflow-auto p-6 sm:p-12">{children}</div>
    </main>
  )
}
