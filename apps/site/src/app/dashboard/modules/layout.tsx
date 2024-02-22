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
        <aside className="hidden md:block w-xs xl:w-sm">
          <SidebarNav items={dashboardNavConfig.sidebarNav[0]!.items} />
        </aside>
        <Card className="flex-1">
          <ModuelHeader />
          <CardContent className="w-full">
            {children}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
