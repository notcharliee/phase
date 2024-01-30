"use client"

import Link from "next/link"

import { Announcement } from "@/components/announcement"
import { buttonVariants } from "@/components/ui/button"
import {
  PageHeading,
  PageDescription,
  PageActions,
} from "@/components/page-heading"

import { useMediaQuery } from "@/hooks/use-media-query"

import { siteConfig } from "@/config/site"


export default () => {
  const isMobile = useMediaQuery("(max-width: 640px)")

  return (
    <div className="my-auto min-h-[calc(100vh-4rem-1px)] grid place-items-center p-6">
      <section className="mx-auto flex max-w-[980px] flex-col items-center gap-2 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-20">
        <Announcement />
        <PageHeading>The all-in-one Discord bot</PageHeading>
        <PageDescription>{siteConfig.description}</PageDescription>
        <PageActions>
          <Link href="/dashboard" className={isMobile ? buttonVariants({ size: "lg" }) : buttonVariants({ size: "xl" })}>
            Get Started
          </Link>
          <Link href="/docs" className={isMobile ? buttonVariants({ variant: "outline", size: "lg" }) : buttonVariants({ variant: "outline", size: "xl" })}>
            Learn More
          </Link>
        </PageActions>
      </section>
    </div>
  )  
}