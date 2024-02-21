import { Separator } from "@/components/ui/separator"

import { moduleData } from "./page"
import { ModuleForm } from "./form"

export default function ModuleLoading() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{moduleData.name}</h3>
        <p className="text-muted-foreground text-sm">
          {moduleData.description}
        </p>
      </div>
      <Separator />
      <ModuleForm fallback />
    </div>
  )
}
