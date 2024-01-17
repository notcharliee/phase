import { Metadata } from "next"

import { Moon } from "@/components/moon"
import { Stars } from "@/components/stars"


export const metadata: Metadata = {
  title: "Not Found - Phase Bot",
  description: "We couldn't find what you're looking for, so have this cool 404 page instead."
}


export default () => (
  <main className="min-h-dvh grid text-light-900">
    <Stars className="place-self-center fixed -z-10 overflow-hidden scale-50 rotate-90 sm:scale-[.6] sm:rotate-0 md:scale-75" />
    <div className="place-self-center w-full flex flex-col justify-center items-center">
        <div className="absolute opacity-0 animate-[text-fade-in_1s_2s_forwards] text-center">
          <h1 className="shadow-foreground/30 text-shadow-glow text-[9rem] leading-none font-black tracking-tighter">404</h1>
          <p className="shadow-foreground/30 text-shadow-glow text-5xl font-extrabold tracking-tighter">Not Found</p>
        </div>
        <Moon className="animate-[moon-shrink_1s_forwards] w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96" />
        <Twinkle className="animate-[moon-twinkle_1s_0.9s_forwards] absolute w-0 h-0" />
    </div>
  </main>
)


const Twinkle: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} width="112" height="113" viewBox="0 0 112 113" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M70.856 0.283691L70.3465 7.2993C69.0346 25.3657 86.6194 38.945 103.884 33.1978L110.589 30.966L104.758 34.9439C89.7434 45.1876 90.0366 67.3329 105.317 77.1796L111.251 81.0032L104.49 78.948C87.079 73.6552 69.8598 87.6907 71.6496 105.716L72.3446 112.716L69.7442 106.175C63.0476 89.3319 41.2825 84.6885 28.2336 97.3196L23.1664 102.225L26.6849 96.1236C35.7455 80.4127 25.8239 60.5871 7.76248 58.3121L0.748779 57.4286L7.73665 56.3617C25.7316 53.6141 35.1248 33.5352 25.6514 18.0672L21.9726 12.0606L27.1679 16.8311C40.5467 29.1159 62.1813 23.9036 68.4296 6.89035L70.856 0.283691Z" fill="#F8F8F8"/>
  </svg>
)
