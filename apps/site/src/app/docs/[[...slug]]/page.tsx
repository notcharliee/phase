import { type Metadata } from "next"
import { notFound } from "next/navigation"

import { allDocs } from "contentlayer/generated"
import Balancer from "react-wrap-balancer"

import { Mdx } from "@/components/mdx-components"
import { DocsPager } from "@/components/pager"

import { siteConfig } from "@/config/site"

import { absoluteURL } from "@/lib/utils"

async function getDocFromParams({ params }: { params: { slug: string[] } }) {
  const slug = params.slug?.join("/") || ""
  const doc = allDocs.find((doc) => doc.slugAsParams === slug)

  if (!doc) return null
  return doc
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string[] }
}): Promise<Metadata> {
  const doc = await getDocFromParams({ params })
  if (!doc) return {}

  let ogImage: string | URL = new URL("/api/image/docs.png", siteConfig.url)

  ogImage.searchParams.append("title", doc.title)
  ogImage.searchParams.append("description", doc.description)

  ogImage = ogImage.toString()

  return {
    title: doc.title,
    description: doc.description,
    openGraph: {
      title: doc.title,
      description: doc.description,
      type: "article",
      url: absoluteURL(doc.slug),
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: doc.title,
      description: doc.description,
      images: [ogImage],
      creator: "@" + siteConfig.creator,
    },
  }
}

export default async function DocsPage({
  params,
}: {
  params: { slug: string[] }
}) {
  const doc = await getDocFromParams({ params })
  if (!doc) notFound()

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">{doc.title}</h1>
        <p className="text-muted-foreground text-lg">
          <Balancer>{doc.description}</Balancer>
        </p>
      </div>
      <div className="pb-12">
        <Mdx code={doc.body.code} />
      </div>
      <DocsPager doc={doc} />
    </div>
  )
}
