import { cn } from "~/lib/utils"

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("bg-secondary/50 animate-pulse rounded-md", className)}
      {...props}
    />
  )
}
