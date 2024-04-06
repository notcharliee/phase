import "@/styles/login.css"

import Link from "next/link"

import { CrossCircledIcon } from "@radix-ui/react-icons"

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
    return <Error reason="Invalid search params" />
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
          <span className="text-foreground mx-[0.5ch] h-5 rounded border px-1 font-mono text-xs">
            /dashboard login
          </span>
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

const Error = ({ reason }: { reason: string }) => (
  <Card className="animate-in fade-in-5 *:animate-in *:fade-in-20 *:fill-mode-backwards slide-in-from-bottom-10 flex h-[16rem] w-full max-w-xs flex-col items-center justify-center py-2 shadow-lg duration-500 *:duration-500">
    <CrossCircledIcon className="h-16 w-16" />
    <CardTitle className="mt-4 text-lg font-medium">{reason}</CardTitle>
  </Card>
)
