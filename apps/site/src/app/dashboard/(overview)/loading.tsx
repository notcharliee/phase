import { Skeleton } from "@/components/ui/skeleton"

import { DashboardHeader } from "../components/header"

export default function Loading() {
  return (
    <div className="flex flex-col gap-2 px-8 py-10 sm:px-12 sm:py-8 lg:h-screen lg:gap-4">
      <DashboardHeader />
      <div className="grid gap-2 lg:grid-cols-3 lg:gap-4">
        <Skeleton className="h-[140px] rounded-xl" />
        <Skeleton className="h-[140px] rounded-xl" />
        <Skeleton className="h-[140px] rounded-xl" />
      </div>
      <div className="flex h-full flex-col gap-2 overflow-hidden lg:flex-row lg:gap-4">
        <Skeleton className="h-full w-full rounded-xl" />
        <div className="flex w-full flex-col gap-2 lg:flex-col-reverse lg:gap-4">
          <Skeleton className="h-[140px] rounded-xl" />
          <div className="grow overflow-hidden rounded-xl">
            <Skeleton className="h-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  )
}
