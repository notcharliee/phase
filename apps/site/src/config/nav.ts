interface Page {
  label: string
  href: string
  category?: string
  external?: boolean
}

export const mainPages: Page[] = [
  { label: "Home", href: "/" },
  { label: "Docs", href: "/docs" },
  { label: "Invite", href: "/redirect/invite", external: true },
  { label: "Discord", href: "/redirect/discord", external: true },
]

export const docsPages: Page[] = [
  { label: "Introduction", href: "/docs", category: "Getting Started" },
  { label: "Changelog", href: "/docs/changelog", category: "Getting Started" },
  { label: "Terms", href: "/docs/terms", category: "Getting Started" },
  { label: "Privacy", href: "/docs/privacy", category: "Getting Started" },
  { label: "Counters", href: "/docs/modules/counters", category: "Modules" },
]

export const splitPagesByCategory = (pages: Page[]): Record<string, Page[]> => {
  return pages.reduce(
    (acc, page) => {
      const category = page.category ?? "Misc"
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(page)
      return acc
    },
    {} as Record<string, Page[]>,
  )
}
