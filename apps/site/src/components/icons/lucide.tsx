import { pascalCase } from "change-case"
import { icons as lucideIcons } from "lucide-react"

import { cn } from "~/lib/utils"

import type { PascalToKebab } from "~/types/utils"
import type { LucideProps } from "lucide-react"

export type LucideIconName = PascalToKebab<keyof typeof lucideIcons>
export type LucideIconPascalName = keyof typeof lucideIcons

function isValidIconName(name: string): name is LucideIconPascalName {
  return name in lucideIcons
}

export interface LucideIconProps extends LucideProps {
  name: LucideIconName
}

export function LucideIcon({ name, className, ...props }: LucideIconProps) {
  const pascalName = pascalCase(name).replaceAll("_", "")

  if (!isValidIconName(pascalName)) {
    throw new Error(`Invalid Lucide icon name: ${pascalName}`)
  }

  const Icon = lucideIcons[pascalName]

  return (
    <Icon
      className={cn("pointer-events-none size-4 shrink-0", className)}
      {...props}
    />
  )
}
