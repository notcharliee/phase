import { Separator } from "@/components/ui/separator"
import { SidebarNav } from "../components/sidebar-nav"

import { dashboardConfig } from "@/config/dashboard"


const sidebarNavItems = dashboardConfig.sidebarNav[1]!.items.map(item => ({ title: item.title, href: item.href! }))


export default ({ children }: { children: React.ReactNode }) => (
  <div>
    <div className="space-y-0.5">
      <h2 className="text-2xl font-bold tracking-tight">Command</h2>
      <p className="text-muted-foreground">
        Manage your server's command settings.
      </p>
    </div>
    <Separator className="my-6" />
    <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
      <aside className="lg:w-1/5">
        <SidebarNav items={sidebarNavItems} />
      </aside>
      <div className="flex-1 lg:max-w-2xl xl:max-w-4xl">{children}</div>
    </div>
  </div>
)