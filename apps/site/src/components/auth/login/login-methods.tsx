"use client"

import Link from "next/link"
import { useState } from "react"

import { DiscordLogoIcon } from "@radix-ui/react-icons"
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"

import { Button } from "~/components/ui/button"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "~/components/ui/input-otp"
import { Label } from "~/components/ui/label"

import { cn } from "~/lib/utils"

export interface LoginMethodsProps {
  onSubmit: (value: string) => Promise<void>
}

export function LoginMethods(props: LoginMethodsProps) {
  const [oauthDisabled, setOauthDisabled] = useState(false)

  return (
    <div className="space-y-4">
      <OtpLogin
        onLoading={() => setOauthDisabled(true)}
        onSuccess={() => setOauthDisabled(true)}
        onError={() => setOauthDisabled(false)}
        action={props.onSubmit}
      />
      <div className="flex items-center">
        <hr className="bg-accent h-px w-full" />
        <span className=" text-muted-foreground px-2 text-xs uppercase">
          Or
        </span>
        <hr className="bg-accent h-px w-full" />
      </div>
      <OauthLogin disabled={oauthDisabled} />
    </div>
  )
}

export interface OauthLoginProps {
  disabled: boolean
}

export function OauthLogin(props: OauthLoginProps) {
  return (
    <Button
      variant="outline"
      size={"lg"}
      className="w-full gap-2"
      disabled={props.disabled}
      asChild
    >
      <Link href={"/redirect/oauth"}>
        <DiscordLogoIcon className="h-5 w-5" />
        Sign in with Discord
      </Link>
    </Button>
  )
}

export interface OtpLoginProps {
  action: (value: string) => Promise<void>
  onLoading: () => void
  onSuccess: () => void
  onError: () => void
}

export function OtpLogin(props: OtpLoginProps) {
  const [value, setValue] = useState<string>()
  const [state, setState] = useState<"loading" | "success" | "error">()

  const onClick = async () => {
    // error if the value is not 6 digits
    if (value?.length !== 6) {
      setState("error")
      props.onError()
      return
    }

    try {
      // set the state to loading
      setState("loading")
      props.onLoading()
      // call the action with the value
      await props.action(value)
      // set the state to success
      setState("success")
      props.onSuccess()
    } catch {
      // set the state to error
      setState("error")
      props.onError()
    }
  }

  return (
    <div className="inline-flex flex-col items-center">
      <Label htmlFor="otp" className="sr-only">
        One-Time Code
      </Label>
      <InputOTP
        id="otp"
        maxLength={6}
        pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
        value={value}
        onChange={setValue}
        containerClassName="has-[:disabled]:opacity-100"
        disabled={state === "loading" || state === "success"}
      >
        <InputOTPGroup
          className={cn(
            "*:h-12 *:w-12 md:*:h-14 md:*:w-14",
            state === "loading" && "animate-pulse duration-1000",
            state === "success" && "*:border-green-300 *:text-green-300",
            state === "error" &&
              "animate-jiggle *:text-destructive *:border-destructive",
          )}
        >
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      {state === "success" ? (
        <Button size={"lg"} className="mt-4 w-full" asChild>
          <Link href={"/dashboard/modules"}>Enter the dashboard</Link>
        </Button>
      ) : state === "loading" ? (
        <Button size={"lg"} className="mt-4 w-full border" disabled>
          <Link href={"/dashboard/modules"}>One moment...</Link>
        </Button>
      ) : (
        <Button
          size={"lg"}
          className="mt-4 w-full"
          disabled={value?.length !== 6}
          onClick={onClick}
        >
          Sign in with One-Time Code
        </Button>
      )}
    </div>
  )
}
