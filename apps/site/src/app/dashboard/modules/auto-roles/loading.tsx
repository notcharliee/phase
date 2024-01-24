import { metadata as pageMetadata } from "./page"
import { ModuleFormFallback } from "./form"


export const metadata = pageMetadata


export default () => {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">{metadata.title?.toString().replace(" - Phase Bot", "")}</h1>
        <p className="text-muted-foreground">{metadata.description}</p>
      </div>
      <ModuleFormFallback />
    </div>
  )
}
