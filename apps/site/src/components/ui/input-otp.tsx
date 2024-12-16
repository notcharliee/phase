"use client"

import * as React from "react"

import { LucideIcon } from "@repo/ui/lucide-icon"
import { OTPInput, OTPInputContext } from "input-otp"

import { cn } from "~/lib/utils"

export type InputOTPProps = React.ComponentPropsWithRef<typeof OTPInput>

export function InputOTP({
  className,
  containerClassName,
  ...props
}: InputOTPProps) {
  return (
    <OTPInput
      containerClassName={cn(
        "flex items-center gap-2 has-[:disabled]:opacity-50",
        containerClassName,
      )}
      className={cn("disabled:cursor-not-allowed", className)}
      {...props}
    />
  )
}

export interface InputOTPGroupProps
  extends React.ComponentPropsWithRef<"div"> {}

export function InputOTPGroup({ className, ...props }: InputOTPGroupProps) {
  return <div className={cn("flex items-center", className)} {...props} />
}

export interface InputOTPSlotProps extends React.ComponentPropsWithRef<"div"> {
  index: number
}

export function InputOTPSlot({
  index,
  className,
  ...props
}: InputOTPSlotProps) {
  const inputOTPContext = React.useContext(OTPInputContext)
  const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index]!

  return (
    <div
      className={cn(
        "border-input relative flex h-10 w-10 items-center justify-center border-y border-r text-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md",
        isActive && "ring-ring ring-offset-background z-10 ring-2",
        className,
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="animate-caret-blink bg-foreground h-4 w-px duration-1000" />
        </div>
      )}
    </div>
  )
}

export interface InputOTPSeparatorProps
  extends React.ComponentPropsWithRef<"div"> {}

export function InputOTPSeparator({ ...props }: InputOTPSeparatorProps) {
  return (
    <div role="separator" {...props}>
      <LucideIcon name="dot" />
    </div>
  )
}
