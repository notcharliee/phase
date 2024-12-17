import { cn } from "~/lib/utils"

import { Moon } from "./moon"
import { OrbitingDots } from "./orbiting-dots"

interface LoadingProps extends React.ComponentPropsWithRef<"div"> {}

export const Loading = ({ className, ...props }: LoadingProps) => {
  return (
    <div
      className={cn(
        "relative grid size-48 shrink-0 place-items-center sm:size-64",
        className,
      )}
      {...props}
    >
      <OrbitingDots className="absolute inset-0 size-full [animation-duration:5s]" />
      <Moon animate={true} variant={"glow"} className="absolute size-1/4" />
    </div>
  )
}
