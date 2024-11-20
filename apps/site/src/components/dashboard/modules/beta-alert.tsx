import { LucideIcon } from "~/components/icons/lucide"
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert"

export function BetaAlert() {
  return (
    <Alert variant={"warning"}>
      <LucideIcon name="triangle-alert" />
      <AlertTitle>Beta Module</AlertTitle>
      <AlertDescription>
        This module is still in beta and may not be fully functional yet. Use at
        your own risk.
      </AlertDescription>
    </Alert>
  )
}
