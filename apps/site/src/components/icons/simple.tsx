import {
  SiDiscord as discord,
  SiGithub as github,
} from "@icons-pack/react-simple-icons"

import { cn } from "~/lib/utils"

// this library is MASSIVE, so we're only importing the icons we need
export const simpleIcons = {
  github,
  discord,
}

export type SimpleIconName = keyof typeof simpleIcons

export interface SimpleIconProps extends React.ComponentPropsWithRef<"svg"> {
  name: SimpleIconName
}

export function SimpleIcon({ name, className, ...props }: SimpleIconProps) {
  const Icon = simpleIcons[name]

  return (
    <Icon
      className={cn("pointer-events-none size-4 shrink-0", className)}
      {...props}
    />
  )
}
