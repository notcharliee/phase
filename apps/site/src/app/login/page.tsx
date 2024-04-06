import "@/styles/login.css"

import Link from "next/link"

import { Moon } from "@/components/moon"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { OTPForm } from "./form"

export default function LoginPage({
  searchParams,
}: {
  searchParams: { userId: string | undefined; guildId: string | undefined }
}) {
  if (!searchParams.userId || !searchParams.guildId) {
    return (
      <Card className="animate-in fade-in-5 *:animate-in *:fade-in-20 *:fill-mode-backwards slide-in-from-bottom-10 flex w-full max-w-xs flex-col justify-center py-2 shadow-lg duration-500 *:duration-500">
        <CardHeader className="flex-row items-center justify-center gap-3">
          <Moon className="h-9 w-9" />
          <CardTitle className="text-3xl font-extrabold leading-tight">
            Phase
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-3">
          <CardDescription className="text-balance text-center">
            This login page is missing the required search params to properly
            authenticate you.
            <br />
            <br />
            To access the dashboard, you need to run the
            <code className="text-foreground bg-muted relative mx-[0.5ch] rounded px-[0.3rem] py-[0.2rem] font-mono text-xs">
              /dashboard login
            </code>
            command, then click the button in the response embed.
            <br />
            <br />
            The button will redirect you to this page, with the correct search
            params.
          </CardDescription>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="animate-in fade-in-5 *:animate-in *:fade-in-20 *:fill-mode-backwards slide-in-from-bottom-10 flex h-[24rem] w-full max-w-xs flex-col justify-center py-2 shadow-lg duration-500 *:duration-500">
      <CardHeader className="flex-row items-center justify-center gap-3">
        <Moon className="h-9 w-9" />
        <CardTitle className="text-3xl font-extrabold leading-tight">
          Phase
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <CardDescription className="mb-6 text-balance text-center">
          To access the dashboard, you need to run the
          <code className="text-foreground bg-muted relative mx-[0.5ch] rounded px-[0.3rem] py-[0.2rem] font-mono text-xs">
            /dashboard login
          </code>
          command, then enter the 6 digit code in the box below.
        </CardDescription>
        <OTPForm userId={searchParams.userId} guildId={searchParams.guildId} />
        <div className="mt-3 flex gap-[0.5ch] text-xs">
          <span className="text-muted-foreground">
            Don&rsquo;t have the bot?
          </span>
          <Link
            href={"/redirect/invite"}
            className="font-medium underline underline-offset-2"
          >
            Add it now!
          </Link>
        </div>
      </CardContent>
      <CardFooter className="text-muted-foreground flex-col gap-2">
        <div className="text-balance text-center text-xs">
          To learn more about how we use your data, please read our{" "}
          <Link
            href={"/privacy"}
            className="text-foreground font-medium underline underline-offset-2"
          >
            Privacy Policy
          </Link>
          .
        </div>
      </CardFooter>
    </Card>
  )
}
