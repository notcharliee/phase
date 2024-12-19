import { type Metadata } from "next"

import { Moon } from "@repo/ui/moon"
import { Header } from "~/components/header"

export const metadata: Metadata = {
  title: "Not Found - Phase Bot",
  description:
    "We couldn't find what you're looking for, so have this cool 404 page instead.",
}

export default function NotFound() {
  return (
    <main className="flex min-h-screen w-full flex-col">
      <Header />
      <div className="grid h-[calc(100vh-4rem-1px)]">
        <div className="absolute animate-[text-fade-in_1s_2s_forwards] place-self-center text-center opacity-0">
          <h1 className="text-[9rem] font-black leading-none tracking-tighter">
            404
          </h1>
          <p className="text-5xl font-extrabold tracking-tighter">Not Found</p>
        </div>
        <Moon className="h-72 w-72 animate-[moon-shrink_ease-in_1s_forwards] place-self-center sm:h-80 sm:w-80 md:h-96 md:w-96" />
        <svg
          className="absolute h-0 w-0 animate-[moon-twinkle_1s_1s_forwards] place-self-center"
          width="112"
          height="113"
          viewBox="0 0 112 113"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M70.856 0.283691L70.3465 7.2993C69.0346 25.3657 86.6194 38.945 103.884 33.1978L110.589 30.966L104.758 34.9439C89.7434 45.1876 90.0366 67.3329 105.317 77.1796L111.251 81.0032L104.49 78.948C87.079 73.6552 69.8598 87.6907 71.6496 105.716L72.3446 112.716L69.7442 106.175C63.0476 89.3319 41.2825 84.6885 28.2336 97.3196L23.1664 102.225L26.6849 96.1236C35.7455 80.4127 25.8239 60.5871 7.76248 58.3121L0.748779 57.4286L7.73665 56.3617C25.7316 53.6141 35.1248 33.5352 25.6514 18.0672L21.9726 12.0606L27.1679 16.8311C40.5467 29.1159 62.1813 23.9036 68.4296 6.89035L70.856 0.283691Z"
            fill="#F8F8F8"
          />
        </svg>
      </div>
    </main>
  )
}
