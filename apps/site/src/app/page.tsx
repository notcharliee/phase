"use client"

import Link from "next/link"
import { useEffect } from "react"

import { ArrowRightIcon } from "@radix-ui/react-icons"
import { toast } from "sonner"

import { Header } from "~/components/header"
import {
  PageActions,
  PageDescription,
  PageHeading,
} from "~/components/page-heading"
import { buttonVariants } from "~/components/ui/button"
import { OrbitingDots } from "~/components/orbiting-dots"

import { siteConfig } from "~/config/site"

export default function HomePage({
  searchParams,
}: {
  searchParams: { signedOut: string | undefined }
}) {
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchParams.signedOut === "true") {
        toast.info("You have been signed out.")
      }
    }, 0)

    return () => clearTimeout(timeout)
  }, [searchParams])

  return (
    <main className="flex min-h-screen w-full flex-col">
      <Header />
      <div className="mx-auto my-auto grid h-full max-w-7xl place-items-center gap-8 p-6 sm:gap-0 sm:px-8 md:px-12">
      <OrbitingDots />
        <section className="flex max-w-[980px] flex-col items-center gap-4 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-20">
          <Link
            href="/docs/changelog"
            className="bg-muted inline-flex items-center rounded-lg px-3 py-1 text-sm font-medium"
          >
            <span className="mr-4">🎉</span>
            <span className="inline">Check out the v3 changelog.</span>
            <ArrowRightIcon className="ml-2 h-4 w-4" />
          </Link>
          <PageHeading>The all-in-one Discord bot</PageHeading>
          <PageDescription>{siteConfig.description}</PageDescription>
          <PageActions>
            <Link
              href="/redirect/invite"
              className={buttonVariants({ size: "xl" })}
            >
              Invite the bot
            </Link>
            <Link
              href="/docs"
              className={buttonVariants({ variant: "outline", size: "xl" })}
            >
              Learn More
            </Link>
          </PageActions>
        </section>
      </div>
      <footer className="sm:border-t sm:backdrop-blur-sm">
        <div className="container flex items-center py-6 sm:h-16 sm:py-0">
          <p className="text-muted-foreground w-full text-balance text-center text-sm leading-loose sm:text-left">
            Built by{" "}
            <Link
              href={"/redirect/developer"}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              mikaela
            </Link>
            . The source code is available on{" "}
            <Link
              href={"/redirect/github"}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              GitHub
            </Link>
            .
          </p>
        </div>
      </footer>
    </main>
  )
}
