import { pascalCase } from "change-case"
import { icons as lucideIcons } from "lucide-react"

import { cn } from "~/lib/utils"

import type { LucideProps } from "lucide-react"

type PascalToKebab<
  TValue extends string,
  TAccumulator extends string = "",
> = TValue extends `${infer First}${infer Rest}`
  ? First extends Uppercase<First>
    ? PascalToKebab<
        Rest,
        `${TAccumulator}${TAccumulator extends "" ? "" : "-"}${Lowercase<First>}`
      >
    : PascalToKebab<Rest, `${TAccumulator}${First}`>
  : TAccumulator

export type LucideIconPascalName = keyof typeof lucideIcons
export type LucideIconName = PascalToKebab<LucideIconPascalName>

const pascalIconNames = Object.keys(lucideIcons) as LucideIconPascalName[]

function isValidIconName(name: string): name is LucideIconPascalName {
  return pascalIconNames.includes(name as LucideIconPascalName)
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
