import { Separator } from "@/components/ui/separator"
import { CommandFormFallback } from "./form"


export default () => (
  <div className="space-y-6">
    <div>
      <h3 className="text-lg font-medium">Loading...</h3>
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
    <Separator />
    <CommandFormFallback />
  </div>
)