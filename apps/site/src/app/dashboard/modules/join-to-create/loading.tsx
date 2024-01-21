import { type Metadata } from "next"

import { JoinToCreateFormFallback } from "./form"


export const metadata: Metadata = {
  title: "Join to Create - Phase Bot",
  description: "Dynamically creates a new, temporary voice channel and deletes it when all members leave.",
}


export default () => {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">{metadata.title?.toString().replace(" - Phase Bot", "")}</h1>
        <p className="text-muted-foreground">{metadata.description}</p>
      </div>
      <JoinToCreateFormFallback />
    </div>
  )
}
