import { ExclamationTriangleIcon } from "@radix-ui/react-icons"

import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert"

export function BetaAlert() {
  return (
    <Alert variant={"warning"}>
      <ExclamationTriangleIcon className="h-4 w-4" />
      <AlertTitle>Beta Module</AlertTitle>
      <AlertDescription>
        This module is still in beta and may not be fully functional yet. Use at
        your own risk.
      </AlertDescription>
    </Alert>
  )
}
