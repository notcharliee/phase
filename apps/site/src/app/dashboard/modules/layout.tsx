import { SidebarNav } from "../components/sidebar-nav"

import { dashboardConfig } from "@/config/dashboard"


const sidebarNavItems = dashboardConfig.sidebarNav[0]!.items


export default ({ children }: { children: React.ReactNode }) => (
  <div className="p-8 py-6">
    <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
      <aside className="hidden md:block w-[40%] lg:w-[30%] xl:w-[20%]">
        <SidebarNav items={sidebarNavItems} />
      </aside>
      <div className="flex-1 grid lg:max-w-2xl xl:max-w-4xl">{children}</div>
    </div>
  </div>
)