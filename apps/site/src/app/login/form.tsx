"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

import { REGEXP_ONLY_DIGITS } from "input-otp"

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

import { cn } from "@/lib/utils"

import { validateOTP } from "./actions"

export const OTPForm = ({
  userId,
  guildId,
}: {
  userId: string
  guildId: string
}) => {
  const [otpState, setOtpState] = useState<
    "incomplete" | "valid" | "invalid" | "loading"
  >("incomplete")

  const router = useRouter()

  const onChange = async (newValue: string) => {
    if (newValue.length < 6) {
      setOtpState("incomplete")
      return
    }

    setOtpState("loading")

    const isValid = !!(await validateOTP(userId, guildId, newValue))

    if (isValid) {
      setOtpState("valid")
      router.push("/dashboard")
    } else {
      setOtpState("invalid")
    }
  }

  return (
    <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS} onChange={onChange}>
      <InputOTPGroup
        className={cn(
          otpState === "loading" && "animate-pulse duration-500",
          otpState === "invalid" &&
            "animate-jiggle *:text-destructive *:border-destructive",
          otpState === "valid" && "*:border-green-300 *:text-green-300",
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
  )
}
