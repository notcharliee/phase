import { Moon } from "@/components/moon"

export default function Loading() {
  return (
    <main className="grid h-full w-full place-items-center overflow-hidden">
      <div className="absolute h-[12.5rem] w-[12.5rem] animate-[ping_1s_linear_infinite] rounded-full bg-[rgb(12,12,12)]/[12.5]"></div>
      <div className="absolute z-10 flex h-[20rem] w-[20rem] flex-col items-center justify-center gap-5 rounded-full bg-[rgb(12,12,12)]/50 ring-[2rem] ring-[rgb(12,12,12)]/25">
        <Moon className="h-[10rem] w-[10rem] animate-spin" />
        <span className="text-3xl font-bold">Loading ...</span>
      </div>
    </main>
  )
}
