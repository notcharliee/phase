import { Codeblock } from "@repo/ui/codeblock"

import { SignInMethods } from "~/app/auth/signin/components"

export default function Page() {
  return (
    <>
      <div className="text-balance text-center">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          Welcome back!
        </h1>
        <p className="text-muted-foreground mt-2 md:text-lg">
          To access the dashboard, either run the{" "}
          <Codeblock className="md:text-sm" inline>
            /bot login
          </Codeblock>{" "}
          command, or click the button below to login with your Discord account.
        </p>
      </div>
      <SignInMethods />
    </>
  )
}
