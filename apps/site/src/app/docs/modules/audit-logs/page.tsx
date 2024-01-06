import { Metadata } from "next"
import Link from "next/link"

import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@radix-ui/react-icons"

import { Button } from "@/components/ui/button"


export const metadata: Metadata = {
  title: "Audit Logs - Phase Bot",
  description: "Provides a detailed log of all server activities and events to the channel of your choice."
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
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Totam incidunt optio rem quasi quibusdam. Esse dolorem id ipsa natus dignissimos officia, rem ea repellendus sit dolores ad nam possimus deserunt!
        </p>
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Totam incidunt optio rem quasi quibusdam. Esse dolorem id ipsa natus dignissimos officia, rem ea repellendus sit dolores ad nam possimus deserunt!
        </p>
      </div>
    </div>
    <div className="flex items-center justify-between">
      <Link href={"/docs"}>
        <Button variant={"outline"}><ChevronLeftIcon className="mr-2 h-4 w-4" /> Introduction</Button>
      </Link>
      <Link href={"/docs/modules/audit-logs"}>
        <Button variant={"outline"}>Auto Partners <ChevronRightIcon className="ml-2 h-4 w-4" /></Button>
      </Link>
    </div>
  </div>
)
