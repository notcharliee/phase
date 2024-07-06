import { Breadcrumbs } from "~/components/docs/breadcrumbs"
import { Pager } from "~/components/docs/pager"
import { Sidebar } from "~/components/docs/sidebar"
import { Header } from "~/components/header"

export default function DocsLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className="flex min-h-screen w-full flex-col">
      <Header />
      <div className="container flex h-full gap-12">
        <aside className="sticky top-16 h-[calc(100vh-4rem-1px)] w-64 py-8 pr-6 max-md:hidden">
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
