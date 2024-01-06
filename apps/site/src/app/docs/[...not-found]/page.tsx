import { Metadata } from "next"
import Link from "next/link"

import { ChevronLeftIcon } from "@radix-ui/react-icons"

import { Button } from "@/components/ui/button"


export const metadata: Metadata = {
  title: "Not Found - Phase Bot",
  description: "We couldn't find what you're looking for, so have this poem instead."
}

export default () => (
  <div>
    <div className="space-y-2">
      <h1 className="text-4xl font-bold tracking-tight">{metadata.title?.toString().replace(" - Phase Bot", "")}</h1>
      <p className="text-lg text-muted-foreground">{metadata.description}</p>
    </div>
    <div className="pb-12 pt-8">
      <div className="space-y-4">
        <p className="leading-7">
          In the digital realm where pathways weave,<br />
          A journey halts, a hiccup perceives.<br />
          A wanderer sought, a query in mind,<br />
          But alas, a 404, a page hard to find.<br />
        </p>
        <p className="leading-7">
          Lines of code in disarray,<br />
          as the browser weaves a web of dismay,<br />
          The 404 echoes, a silent cry,<br />
          in this void where no page lies.<br />
        </p>
        <p className="leading-7">
          Fear not, traveler of the online maze,<br />
          For errors come in transient waves.<br />
          So let the journey resume, the quest persist,<br />
          In the docs of Phase, where knowledge exists.<br />
        </p>
        <p className="text-muted-foreground font-semibold">- chat gpt probably</p>
      </div>
    </div>
    <div className="flex items-center justify-between">
      <Link href={"/docs"}>
        <Button variant={"outline"}><ChevronLeftIcon className="mr-2 h-4 w-4" /> Introduction</Button>
      </Link>
      <Link href={"/docs/modules/audit-logs"}>
        <Button variant={"default"}>Report a Bug</Button>
      </Link>
    </div>
  </div>
)
