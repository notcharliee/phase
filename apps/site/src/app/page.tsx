import Link from "next/link"

import { ArrowRightIcon } from "@radix-ui/react-icons"

import { Header } from "~/components/header"
import { OrbitingDots } from "~/components/orbiting-dots"
import { Button } from "~/components/ui/button"

import { siteConfig } from "~/config/site"

export default function HomePage() {
  return (
    <main className="grid min-h-screen grid-rows-[4rem_auto_4rem]">
      <OrbitingDots />
      <Header />
      <div className="container grid h-full place-items-center">
        <section className="flex max-w-[980px] flex-col items-center gap-4 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-20">
          <Link
            href="/docs/changelog"
            className="bg-muted inline-flex items-center rounded-lg px-3 py-1 text-sm font-medium"
          >
            <span className="mr-4">🎉</span>
            <span className="inline">Check out the v3.12 changelog.</span>
            <ArrowRightIcon className="ml-2 h-4 w-4" />
          </Link>
          <h1 className="text-center text-4xl font-bold leading-none tracking-tighter md:text-6xl lg:leading-[1.1]">
            The all-in-one Discord bot
          </h1>
          <p className="text-muted-foreground max-w-[750px] text-center text-lg sm:text-xl">
            {siteConfig.description}
          </p>
          <div className="flex w-full items-center justify-center space-x-4 py-4 md:pb-10">
            <Button variant={"glow"} size={"xl"} asChild>
              <Link href="/redirect/invite">Invite the bot</Link>
            </Button>
            <Button variant={"outline"} size={"xl"} asChild>
              <Link href="/docs">Learn More</Link>
            </Button>
          </div>
        </section>
      </div>
      <footer className="h-16 sm:border-t sm:backdrop-blur-sm">
        <div className="container flex h-full items-center py-6 sm:py-0">
          <p className="text-muted-foreground w-full text-balance text-center text-xs leading-loose sm:text-left sm:text-sm">
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
