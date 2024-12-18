import { Button } from "@repo/ui/button"
import { LucideIcon } from "@repo/ui/lucide-icon"
import { Header } from "~/components/header"
import { Link } from "~/components/link"
import { OrbitingDots } from "~/components/orbiting-dots"

import { siteConfig } from "~/config/site"

export default function Home() {
  return (
    <main className="grid min-h-screen grid-rows-[4rem_auto_4rem]">
      <div className="fixed left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2">
        <OrbitingDots size={"screen"} />
      </div>
      <Header />
      <div className="container grid h-full place-items-center">
        <section className="flex max-w-[980px] flex-col items-center md:py-12 md:pb-8 lg:py-24 lg:pb-20">
          <div className="hidden md:mb-6 md:block">
            <Link
              href="/docs/changelog"
              variant={"no-underline"}
              className="bg-secondary/50 hover:bg-secondary hover:paused inline-flex animate-bounce items-center gap-3 rounded border px-3 py-1 font-mono text-sm font-medium shadow transition-colors"
            >
              <LucideIcon name="party-popper" />
              <span>Check out the latest updates!</span>
              <LucideIcon name="arrow-right" />
            </Link>
          </div>
          <div className="mb-12 space-y-4">
            <h1 className="text-balance text-center text-5xl font-bold leading-none tracking-tighter md:text-6xl lg:leading-[1.1]">
              The all-in-one Discord bot
            </h1>
            <p className="text-muted-foreground max-w-[750px] text-pretty text-center text-lg sm:text-xl md:text-balance">
              {siteConfig.description}
            </p>
          </div>
          <div className="flex w-full flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              variant={"glow"}
              size={"xl"}
              className="w-4/5 sm:w-auto"
              asChild
            >
              <Link href="/redirect/invite" variant={"no-underline"} external>
                Invite the bot
              </Link>
            </Button>
            <Button
              variant={"outline"}
              size={"xl"}
              className="w-4/5 sm:w-auto"
              asChild
            >
              <Link href="/docs" variant={"no-underline"}>
                Learn More
              </Link>
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
              label="Developer profile"
              variant={"hover"}
              external
            >
              mikaela
            </Link>
            . Source code is available on{" "}
            <Link
              href={"/redirect/github"}
              label="Project repository"
              variant={"hover"}
              external
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
