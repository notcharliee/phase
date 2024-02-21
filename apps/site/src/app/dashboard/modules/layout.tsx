import { dashboardNavConfig } from "@/config/nav/dashboard"

import { SidebarNav } from "@/app/dashboard/components/sidebar-nav"

export default function ModulesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="p-8 py-6">
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="hidden w-[40%] md:block lg:w-[30%] xl:w-[20%]">
          <SidebarNav items={dashboardNavConfig.sidebarNav[0]!.items} />
        </aside>
        <div className="grid flex-1 lg:max-w-2xl xl:max-w-4xl">{children}</div>
      </div>
    </div>
  )
}
