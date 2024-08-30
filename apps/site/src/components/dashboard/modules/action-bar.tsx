"use client"

import { useRef } from "react"

import { useFormContext } from "react-hook-form"

import { Button } from "~/components/ui/button"

import { useElementSize } from "~/hooks/use-element-size"

import { type ModulesFormValues } from "~/types/dashboard"

interface ActionBarProps {
  dirtyKeys: string[]
  invalidKeys: string[]
}

export function ActionBar(props: ActionBarProps) {
  const form = useFormContext<ModulesFormValues>()

  const isDirty = props.dirtyKeys.length
  const isInvalid = props.invalidKeys.length

  const actionBarRef = useRef<HTMLDivElement>(null)
  const [actionBarWidth, actionBarHeight] = useElementSize(actionBarRef)

  const actionBarParentStyles: React.CSSProperties = {
    "--actionbar-height": `${actionBarHeight}px`,
    "--actionbar-width": `${actionBarWidth}px`,
  }

  return (
    <div
      aria-hidden={!!(!isDirty || isInvalid)}
      style={actionBarParentStyles}
      className="group sticky top-0 z-10 mb-8 h-[--actionbar-height] transition-all duration-500 aria-hidden:pointer-events-none aria-hidden:mb-0 aria-hidden:h-0 md:fixed md:bottom-6 md:left-[calc((50%-(var(--actionbar-width)/2))+10rem)] md:top-auto md:mb-0 md:w-[--actionbar-width]"
    >
      <div
        ref={actionBarRef}
        className="bg-background/50 border-border fill-mode-backwards group-aria-hidden:fill-mode-forwards animate-in fade-in-0 group-aria-hidden:animate-out group-aria-hidden:fade-out-0  md:slide-in-from-bottom-6 absolute top-0 flex w-full items-center justify-between gap-4 rounded-md border p-4 backdrop-blur-sm transition-all delay-200 duration-500 group-aria-hidden:delay-0 sm:flex-col sm:items-start md:w-max md:flex-row md:items-center md:delay-0"
      >
        <div className="text-sm">
          <div className="font-semibold">You have unsaved changes!</div>
          <div className="text-muted-foreground hidden sm:block">
            {props.dirtyKeys.length} unsaved changes.
          </div>
        </div>
        <div className="flex gap-1.5 sm:flex-row-reverse md:flex-row">
          <Button type="reset" variant={"ghost"} onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit">
            <span className="sm:hidden">Save</span>
            <span className="hidden sm:inline">Save changes</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
