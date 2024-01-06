import {
  MobileNaviagtion,
  SidebarLinks,
} from "@/components/docs"

export default ({ children }: { children: React.ReactNode }) => (
  <div className="w-full max-w-[1400px] min-h-screen mx-auto flex gap-12 px-8">
    <aside className="w-64 h-screen sticky hidden md:block">
      <SidebarLinks className="py-6 lg:py-8 pr-6 h-full flex flex-col gap-4 overflow-auto scrollbar-float" />
    </aside>
    <main className="py-8 w-full">
      <MobileNaviagtion />
      {children}
    </main>
  </div>
)
