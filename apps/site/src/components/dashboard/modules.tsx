"use client"

import { useEffect, useState } from "react"

import { type UseFormReturn } from "react-hook-form"

import { Button } from "~/components/ui/button"

import { useMediaQuery } from "~/hooks/use-media-query"

import { cn } from "~/lib/utils"

interface ModuleFormButtonsProps {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  form: UseFormReturn<any, any, undefined>
  isSubmitting: boolean
}

export const ModuleFormButtons = (props: ModuleFormButtonsProps) => {
  const [hasBeenDirty, setHasBeenDirty] = useState(false)
  const isMobile = useMediaQuery("(max-width: 640px)")

  useEffect(() => {
    if (props.form.formState.isDirty) {
      setHasBeenDirty(true)
    }
  }, [props.form.formState.isDirty])

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Button
        type={props.isSubmitting ? "button" : "submit"}
        disabled={!props.form.formState.isDirty}
      >
        Save changes
      </Button>
      <Button
        type="reset"
        variant={"destructive"}
        disabled={!props.form.formState.isDirty || props.isSubmitting}
        onClick={() => props.form.reset(props.form.formState.defaultValues)}
        className={cn(
          "duration-300",
          !isMobile &&
            (props.form.formState.isDirty
              ? "animate-in fade-in-0 slide-in-from-bottom-3"
              : hasBeenDirty
                ? "animate-out fade-out-0 slide-out-to-bottom-3 fill-mode-forwards"
                : "hidden"),
        )}
      >
        Undo changes
      </Button>
    </div>
  )
}
