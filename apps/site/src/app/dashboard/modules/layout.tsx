import { dashboardNavConfig } from "@/config/nav/dashboard"

import { Card, CardContent } from "@/components/ui/card"
import { ModuelHeader } from "@/app/dashboard/components/module-header"
import { SidebarNav } from "@/app/dashboard/components/sidebar-nav"

export default function ModulesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="p-8 py-6">
      <div className="md:flex md:gap-4">
        <aside className="w-xs xl:w-sm hidden md:block">
          <SidebarNav items={dashboardNavConfig.sidebarNav[0]!.items} />
        </aside>
        <Card className="flex-1 max-sm:rounded-none max-sm:border-0 max-sm:shadow-none">
          <ModuelHeader className="max-sm:px-0" />
          <CardContent className="w-full max-sm:p-0 max-sm:pb-6">
            {children}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
