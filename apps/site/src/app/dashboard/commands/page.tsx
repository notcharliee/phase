import { Suspense } from "react"

import { Commands } from "../components/commands"


export default () => (
  <div className="h-full grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    <Suspense fallback={<Commands fallback />}>
      <Commands />
    </Suspense>
  </div>
)