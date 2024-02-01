import Image from "next/image"
import Link from "next/link"

import DashboardDemo from "@/../public/dashboard-demo.png"

import { Announcement } from "@/components/announcement"
import { buttonVariants } from "@/components/ui/button"
import {
  PageHeading,
  PageSubheading,
  PageDescription,
  PageActions,
} from "@/components/page-heading"

import { siteConfig } from "@/config/site"


export default () => (
  <div className="my-auto min-h-[calc(100vh-4rem-1px)] max-w-7xl mx-auto grid place-items-center gap-8 sm:gap-0 p-6 sm:px-8 md:px-12">
    <section className="flex max-w-[980px] flex-col items-center gap-2 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-20">
      <Announcement />
      <PageHeading>The all-in-one Discord bot</PageHeading>
      <PageDescription>{siteConfig.description}</PageDescription>
      <PageActions>
        <Link href="/dashboard" className={buttonVariants({ size: "xl" })}>
          Get Started
        </Link>
        <Link href="/docs" className={buttonVariants({ variant: "outline", size: "xl" })}>
          Learn More
        </Link>
      </PageActions>
    </section>
    <section className="mx-auto flex flex-col lg:flex-row items-center gap-8 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-20">
      <Image
        alt="Dashboard Demo"
        className="px-8 lg:w-1/2 xl:w-2/3"
        placeholder="blur"
        priority
        src={DashboardDemo}
      />
      <div className="flex flex-col gap-2 items-center">
        <PageSubheading className="lg:text-start">
          All the tools you need, all in one place.
        </PageSubheading>
        <PageDescription className="lg:text-start mb-4">
          Through the dashboard, you can easily customise every aspect of the bot to meet all of your server's needs. Sign in once, and you're done – no need to do it again.
        </PageDescription>
        <PageDescription className="lg:text-start">
          Does the bot not have something that you need? <Link className="text-foreground font-medium underline underline-offset-4" href={"/redirect/discord"}>Join our Discord</Link> and let us know! We'll get it added in no time.
        </PageDescription>
      </div>
    </section>
    <p className="w-full text-center leading-loose text-muted-foreground md:text-left">
      Built by <Link href={"https://charliee.dev"} target="_blank" rel="noreferrer" className="font-medium underline underline-offset-4">notcharliee</Link>. The source code is available on <Link href={"/redirect/github"} target="_blank" rel="noreferrer" className="font-medium underline underline-offset-4">GitHub</Link>.
    </p>
  </div>
)
