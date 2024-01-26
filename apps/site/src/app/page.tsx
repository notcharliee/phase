import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Moon } from "@/components/moon"
import { Stars } from "@/components/stars"


export default () => (
  <main className="min-h-dvh grid text-light-900">
    <Stars className="place-self-center fixed overflow-hidden scale-50 rotate-90 sm:scale-[.6] sm:rotate-0 md:scale-75" />
    <div className="relative z-10 place-self-center w-full flex flex-col items-center">
      <div className="relative flex justify-center items-center w-full">
        <h1 className="animate-[scale-up_1s_ease-out_forwards] shadow-foreground/30 text-shadow-glow text-6xl sm:text-7xl md:text-8xl max-w-[500px] sm:max-w-[600px] md:max-w-[700px] font-black tracking-tighter text-center absolute z-20">The all in one Discord Bot</h1>
        <Moon className="w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 animate-[moon-rotate_1s_ease-out_forwards]" />
      </div>
      <div className="animate-[scale-up_1s_ease-out_forwards] opacity-0 animation-delay-500 flex flex-col sm:flex-row gap-6 shadow-foreground/30 mt-20">
        <Link href={"/dashboard"}>
          <Button variant={"default"} className="shadow-glow" size={"xl"}>
            Get Started
          </Button>
        </Link>
        <Link href={"/docs"}>
          <Button variant={"outline"} size={"xl"}>
            Learn More
          </Button>
        </Link>
      </div>
    </div>
  </main>
)
