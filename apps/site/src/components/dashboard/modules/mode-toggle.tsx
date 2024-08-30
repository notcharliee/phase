import { useState } from "react"

import { PaddingIcon, Pencil2Icon } from "@radix-ui/react-icons"

import { Button } from "~/components/ui/button"

export enum Mode {
  Edit = 0,
  Manage = 1,
}

export interface ModeToggleProps {
  value: Mode
  onChange: (value: Mode) => void
}

export function ModeToggle({ value, onChange }: ModeToggleProps) {
  const [mode, setMode] = useState<Mode>(value)

  const Icon = mode === Mode.Edit ? PaddingIcon : Pencil2Icon

  const onClick = () => {
    const newMode = mode === Mode.Edit ? Mode.Manage : Mode.Edit
    setMode(newMode)
    onChange?.(newMode)
  }

  return (
    <Button
      onClick={onClick}
      type="button"
      title="Toggle Mode"
      className="space-x-2 transition-all active:scale-95"
    >
      <Icon className="h-4 w-4" />
      <span>{mode === Mode.Edit ? "Manage Mode" : "Edit Mode"}</span>
    </Button>
  )
}
