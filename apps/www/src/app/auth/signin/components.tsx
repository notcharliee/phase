"use client"

import Link from "next/link"
import React from "react"

import { SiDiscord as DiscordLogoIcon } from "@icons-pack/react-simple-icons"
import { Button } from "@repo/ui/button"
import { Label } from "@repo/ui/label"
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "~/components/auth/input-otp"
import { OrSeparator } from "~/components/or-separator"

import { cn } from "~/lib/utils"

import { signInWithDiscord, signInWithOTP } from "~/app/auth/actions"

export function SignInMethods() {
  const [isOAuthLoading, setIsOAuthLoading] = React.useState(false)

  return (
    <div className="space-y-4">
      <OtpLogin onLoadingChange={setIsOAuthLoading} />
      <OrSeparator />
      <OAuthButton disabled={isOAuthLoading} />
    </div>
  )
}

enum OTPState {
  Idle = "idle",
  Loading = "loading",
  Success = "success",
  Error = "error",
}

function OtpLogin(props: { onLoadingChange: (value: boolean) => void }) {
  const [value, setValue] = React.useState("")
  const [state, setState] = React.useState(OTPState.Idle)

  const onValueChange = (value: string) => {
    setValue(value)

    if (value.length !== 6 && state !== OTPState.Idle) {
      setState(OTPState.Idle)
    }
  }

  const onClick = () => {
    setState(OTPState.Loading)
    props.onLoadingChange(true)

    signInWithOTP(value)
      .then(() => setState(OTPState.Success))
      .catch(() => {
        setState(OTPState.Error)
        props.onLoadingChange(false)
      })
  }

  return (
    <div className="inline-flex flex-col items-center">
      <Label htmlFor="otp" className="sr-only">
        One-Time Code
      </Label>
      <InputOTP
        id="otp"
        inputMode="text"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        maxLength={6}
        value={value}
        pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
        disabled={state === OTPState.Loading || state === OTPState.Success}
        containerClassName="has-[:disabled]:opacity-100"
        onChange={onValueChange}
      >
        <InputOTPGroup
          className={cn(
            "*:h-12 *:w-12 md:*:h-14 md:*:w-14",
            state === OTPState.Loading && "animate-pulse duration-1000",
            state === OTPState.Success && "*:border-green-300 *:text-green-300",
            state === OTPState.Error &&
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
      {state === OTPState.Success ? (
        <Button size={"lg"} className="mt-4 w-full" asChild>
          <Link href={"/dashboard/guilds"}>Enter the dashboard</Link>
        </Button>
      ) : (
        <Button
          size={"lg"}
          className="mt-4 w-full"
          disabled={
            value.length !== 6 ||
            state === OTPState.Loading ||
            state === OTPState.Error
          }
          onClick={onClick}
        >
          {state === OTPState.Loading
            ? "One moment..."
            : "Sign in with One-Time Code"}
        </Button>
      )}
    </div>
  )
}

function OAuthButton(props: { disabled: boolean }) {
  return (
    <Button
      type="submit"
      size="lg"
      variant="outline"
      className="w-full gap-2"
      disabled={props.disabled}
      onClick={() => signInWithDiscord()}
    >
      <DiscordLogoIcon className="h-5 w-5" />
      <span>Sign in with Discord</span>
    </Button>
  )
}
