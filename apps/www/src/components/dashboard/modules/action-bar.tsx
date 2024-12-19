"use client"

import { useRef } from "react"

import { useFormContext } from "react-hook-form"

import { Button } from "@repo/ui/button"
import { Spinner } from "@repo/ui/spinner"

import { useElementSize } from "~/hooks/use-element-size"

import { cn } from "~/lib/utils"

import type { ModulesFormValuesInput } from "~/types/dashboard"

interface ActionBarProps {
  dirtyKeys: string[]
  invalidKeys: string[]
}

export function ActionBar(props: ActionBarProps) {
  const form = useFormContext<ModulesFormValuesInput>()

  const isDirty = !!props.dirtyKeys.length
  const isInvalid = !!props.invalidKeys.length
  const isSubmitting = form.formState.isSubmitting

  const actionBarRef = useRef<HTMLDivElement>(null)
  const [actionBarWidth, actionBarHeight] = useElementSize(actionBarRef)

  const actionBarParentStyles: React.CSSProperties = {
    "--actionbar-height": `${actionBarHeight}px`,
    "--actionbar-width": `${actionBarWidth}px`,
  }

  return (
    <div
      aria-hidden={!isDirty}
      style={actionBarParentStyles}
      className="group sticky top-0 z-10 mb-8 h-[--actionbar-height] transition-all duration-500 aria-hidden:pointer-events-none aria-hidden:mb-0 aria-hidden:h-0 md:fixed md:bottom-6 md:left-[calc((50%-(var(--actionbar-width)/2))+10rem)] md:top-auto md:mb-0 md:w-[--actionbar-width]"
    >
      <div
        ref={actionBarRef}
        className="bg-background/50 border-border fill-mode-backwards group-aria-hidden:fill-mode-forwards animate-in fade-in-0 group-aria-hidden:animate-out group-aria-hidden:fade-out-0 md:slide-in-from-bottom-6 absolute top-0 flex w-full items-center justify-between gap-4 rounded-md border p-4 backdrop-blur-sm transition-all delay-200 duration-500 group-aria-hidden:delay-0 sm:flex-col sm:items-start md:w-max md:flex-row md:items-center md:delay-0"
      >
        <div className="text-sm">
          <div className="font-semibold">You have unsaved changes!</div>
          <div className="text-muted-foreground hidden sm:block">
            {isInvalid
              ? "Fix any errors before saving"
              : `${props.dirtyKeys.length} unsaved changes.`}
          </div>
        </div>
        <div className="flex gap-1.5 sm:flex-row-reverse md:flex-row">
          <Button
            disabled={isSubmitting}
            type="reset"
            variant={"ghost"}
            onClick={() => form.reset()}
          >
            Reset
          </Button>
          <Button
            disabled={isInvalid || isSubmitting}
            type="submit"
            className="relative"
          >
            <span
              className={cn(
                "animate-in fade-in-0 sm:hidden",
                isSubmitting && "animate-out fade-out-0 fill-mode-forwards",
              )}
            >
              Save
            </span>
            <span
              className={cn(
                "animate-in fade-in-0 hidden sm:inline",
                isSubmitting && "animate-out fade-out-0 fill-mode-forwards",
              )}
            >
              Save changes
            </span>
            {isSubmitting && (
              <Spinner className="animate-in fade-in-0 absolute h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
