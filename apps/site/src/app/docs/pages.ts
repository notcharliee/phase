import { readdir } from "fs/promises"

import type { Metadata } from "next"

export interface Page {
  slug: string
  title: string
  description: string
}

export const getPages = async (): Promise<Page[]> => {
  // Retrieve slugs from page routes
  const slugs = (
    await readdir("./src/app/docs/(pages)", {
      withFileTypes: true,
    })
  ).filter((dirent) => dirent.isDirectory())

  // Retrieve metadata from MDX files
  const pages = await Promise.all(
    slugs.map(async ({ name }) => {
      const { metadata } = (await import(`./(posts)/${name}/page.mdx`)) as {
        metadata: Metadata
      }

      return { slug: name, ...metadata } as Page
    }),
  )

  return pages
}
