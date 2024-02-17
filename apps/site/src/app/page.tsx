import Image from "next/image"
import Link from "next/link"

import DashboardDemo from "@/../public/dashboard-demo.png"

import { Announcement } from "@/components/announcement"
import { DocsHeader } from "@/components/docs-header"
import { buttonVariants } from "@/components/ui/button"
import {
  PageHeading,
  PageSubheading,
  PageDescription,
  PageActions,
} from "@/components/page-heading"

import { siteConfig } from "@/config/site"

export default function HomePage() {
  return (
    <main className="flex min-h-screen w-full flex-col">
      <DocsHeader />
      <div className="mx-auto my-auto grid min-h-[calc(100vh-4rem-1px)] max-w-7xl place-items-center gap-8 p-6 sm:gap-0 sm:px-8 md:px-12">
        <section className="flex max-w-[980px] flex-col items-center gap-2 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-20">
          <Announcement />
          <PageHeading>The all-in-one Discord bot</PageHeading>
          <PageDescription>{siteConfig.description}</PageDescription>
          <PageActions>
            <Link href="/dashboard" className={buttonVariants({ size: "xl" })}>
              Get Started
            </Link>
            <Link
              href="/docs"
              className={buttonVariants({ variant: "outline", size: "xl" })}
            >
              Learn More
            </Link>
          </PageActions>
        </section>
        <section className="mx-auto flex flex-col items-center gap-8 py-8 md:py-12 md:pb-8 lg:flex-row lg:py-24 lg:pb-20">
          <Image
            alt="Dashboard Demo"
            className="sm:px-8 lg:w-1/2 xl:w-2/3"
            placeholder="blur"
            priority
            src={DashboardDemo}
          />
          <div className="flex w-full max-w-[450px] flex-col items-center gap-2 sm:w-auto sm:max-w-none sm:pb-10 lg:pb-0">
            <PageSubheading className="text-start sm:text-center lg:text-start">
              All the tools you need, all in one place.
            </PageSubheading>
            <PageDescription className="text-start sm:text-center sm:text-lg lg:text-start">
              Through the dashboard, you can easily customise every aspect of
              the bot to meet all of your server's needs. Sign in once, and
              you're done – no need to do it again.
              <span className="mb-4 block w-full"> </span>
              Is the bot missing something that you need?{" "}
              <Link
                className="font-medium underline underline-offset-4"
                href={"/redirect/discord"}
              >
                Join our Discord
              </Link>{" "}
              and let us know! We'll get it added in no time.
            </PageDescription>
          </div>
        </section>
        <p className="text-muted-foreground w-full text-center text-sm leading-loose sm:text-base md:text-left">
          Built by{" "}
          <Link
            href={"https://charliee.dev"}
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            notcharliee
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
    </main>
  )
}
