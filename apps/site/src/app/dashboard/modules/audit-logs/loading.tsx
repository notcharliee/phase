import { Separator } from "@/components/ui/separator"

import { metadata as pageMetadata } from "./page"
import { ModuleFormFallback } from "./form"


export const metadata = pageMetadata


export default () => (
  <div className="space-y-6">
    <div>
      <h3 className="text-lg font-medium">{metadata.title?.toString().replace(" - Phase Bot", "")}</h3>
      <p className="text-sm text-muted-foreground">{metadata.description}</p>
    </div>
    <Separator />
    <ModuleFormFallback />
  </div>
)
