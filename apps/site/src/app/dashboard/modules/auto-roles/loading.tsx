import { ModuleHeading } from "@/app/dashboard/components/module-heading"
import { ModuleForm } from "./form"

export default function ModuleLoading() {
  return (
    <ModuleHeading>
      <ModuleForm fallback />
    </ModuleHeading>
  )
}
