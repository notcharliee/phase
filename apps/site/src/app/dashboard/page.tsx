import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Stars } from "@/components/stars"


export default () => (
  <>
    <div className="relative z-10 flex flex-col items-center place-self-center animate-in fade-in-0 duration-1000 slide-in-from-bottom-10">
      <h2 className="text-6xl font-bold tracking-tight">Hello there!</h2>
      <p className="text-muted-foreground font-medium text-3xl">Welcome to the dashboard.</p>
      <div className="space-x-3 mt-8">
        <Link href={"/dashboard/modules"}>
          <Button variant={"default"} className="w-40" size={"lg"}>Modules</Button>
        </Link>
        <Link href={"/dashboard/commands"}>
          <Button className="w-40" size={"lg"}>Commands</Button>
        </Link>
      </div>
    </div>
    <Stars className="place-self-center fixed rotate-90 sm:scale-[.6] sm:rotate-0 animate-in fade-in-0 duration-1000" /> 
  </>
)