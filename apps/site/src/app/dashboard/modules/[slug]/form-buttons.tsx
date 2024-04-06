/* eslint-disable @typescript-eslint/no-explicit-any */

import { type UseFormReturn } from "react-hook-form"

import { Button } from "@/components/ui/button"

export const ModuleFormButtons = ({
  form,
  isSubmitting,
}: {
  form: UseFormReturn<any, any, undefined>
  isSubmitting: boolean
}) => (
  <div className="flex space-x-3">
    <Button
      type={isSubmitting ? "button" : "submit"}
      disabled={!form.formState.isDirty}
    >
      Save changes
    </Button>
    <Button
      type="reset"
      variant={"destructive"}
      disabled={!form.formState.isDirty || isSubmitting}
      onClick={() => form.reset(form.formState.defaultValues)}
      className={
        form.formState.isDirty
          ? "animate-in fade-in-0 slide-in-from-bottom-3 duration-300"
          : "animate-out fade-out-0 slide-out-to-bottom-3 fill-mode-forwards duration-300"
      }
    >
      Undo changes
    </Button>
  </div>
)
