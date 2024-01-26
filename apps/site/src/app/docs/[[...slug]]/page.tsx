import { type Metadata } from "next"
import { notFound } from "next/navigation"

import { allDocs } from "contentlayer/generated"

import Balancer from "react-wrap-balancer"

import { Mdx } from "@/components/mdx-components"
import { DocsPager } from "@/components/pager"

import { absoluteURL } from "@/lib/utils"


async function getDocFromParams({ params }: { params: { slug: string[] } }) {
  const slug = params.slug?.join("/") || ""
  const doc = allDocs.find((doc) => doc.slugAsParams === slug)

  if (!doc) return null
  return doc
}


export async function generateMetadata({ params }: { params: { slug: string[] } }): Promise<Metadata> {
  const doc = await getDocFromParams({ params })
  if (!doc) return {}

  return {
    title: doc.title + " - Phase Docs",
    description: doc.description,
    openGraph: {
      title: doc.title + " - Phase Docs",
      description: doc.description,
      type: "article",
      url: absoluteURL(doc.slug),
    },
    twitter: {
      title: doc.title + " - Phase Docs",
      description: doc.description,
    },
  }
}


export default async ({ params }: { params: { slug: string[] } }) => {
  const doc = await getDocFromParams({ params })
  if (!doc) notFound()

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">{doc.title}</h1>
        <p className="text-lg text-muted-foreground">
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
