import { Metadata } from "next"
import Link from "next/link"

import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@radix-ui/react-icons"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

import { Button } from "@/components/ui/button"

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"


export const metadata: Metadata = {
  title: "Introduction - Phase Bot",
  description: "Welcome to the Phase documentation!"
}

export default () => (
  <div>
    <div className="space-y-2">
      <h1 className="text-4xl font-bold tracking-tight">{metadata.title?.toString().replace(" - Phase Bot", "")}</h1>
      <p className="text-lg text-muted-foreground">{metadata.description}</p>
    </div>
    <div className="pb-12 pt-8">
      <div className="space-y-4 leading-7">
        <p>
          Phase is a free to use, open source Discord bot built by{" "}
          <HoverCard>
            <HoverCardTrigger asChild>
              <Link href={"https://github.com/notcharliee"} className="font-semibold hover:underline">@notcharliee</Link>
            </HoverCardTrigger>
            <HoverCardContent>
              <div className="flex justify-between space-x-4">
                <Avatar>
                  <AvatarImage src="https://github.com/notcharliee.png" />
                  <AvatarFallback>NC</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">@notcharliee</h4>
                  <p className="text-sm">
                    non-binary monster addict that codes things
                  </p>
                  <div className="flex items-center pt-2">
                    <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />{" "}
                    <span className="text-xs text-muted-foreground">
                      Joined February 2022
                    </span>
                  </div>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
          . It aims to be the all-in-one solution for as many servers as possible, with a large variety of different modules and commands.
        </p>
        <p>
          Whether you're seeking to enhance a small server shared with friends or overseeing a bustling community, Phase is your solution for effectively managing, moderating, and improving your Discord experience.
        </p>
      </div>
      <div className="mt-12 space-y-4">
        <h2 className="mt-12 text-2xl font-semibold tracking-tight">Why should you use Phase?</h2>
        <p className="leading-7">
          While popular bots like MEE6 or Dyno have their strengths, they lack transparency, tend to lock their best features behind <strong>ridiculously</strong> priced paywalls, and rarely add user-requested features. That's why I made Phase!
        </p>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>We're fully open source</AccordionTrigger>
            <AccordionContent>
              You get to see all the wonderful spaghetti code that goes into making everything work. You can even contribute as well!
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>It's free to use (no paywalls)</AccordionTrigger>
            <AccordionContent>
              While donations are greatly appreciated to support me and fund hosting stuff, they're entirely optional.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>We always listen to feedback</AccordionTrigger>
            <AccordionContent>
              If you have something to say, let us know - feature requests, bug reports, and all kinds of feedback are super helpful!
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
    <div className="flex items-center justify-between">
      <Link href={"/"}>
        <Button variant={"outline"}><ChevronLeftIcon className="mr-2 h-4 w-4" /> Back to Home</Button>
      </Link>
      <Link href={"/docs/modules"}>
        <Button variant={"outline"}>Modules <ChevronRightIcon className="ml-2 h-4 w-4" /></Button>
      </Link>
    </div>
  </div>
)
