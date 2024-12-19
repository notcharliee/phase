import { Header } from "@repo/ui/header"
import { Breadcrumbs } from "~/components/docs/breadcrumbs"
import { Pager } from "~/components/docs/pager"
import { Sidebar } from "~/components/docs/sidebar"
import { Link } from "~/components/link"

import type { LayoutProps } from "~/types/props"

export default function DocsLayout({ children }: LayoutProps) {
  return (
    <main className="flex min-h-screen w-full flex-col">
      <Header link={Link} />
      <div className="container flex h-full gap-12">
        <aside className="h-screen-no-header sticky top-16 w-64 py-8 pr-6 max-md:hidden">
          <Sidebar />
        </aside>
        <div className="w-full py-8">
          <Breadcrumbs />
          <div className="mb-12">{children}</div>
          <Pager />
        </div>
      </div>
    </main>
  )
}
