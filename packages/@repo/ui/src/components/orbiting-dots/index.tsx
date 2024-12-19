import { cva } from "class-variance-authority"

import { cn } from "~/lib/utils"

import type { VariantProps } from "class-variance-authority"

export const orbitingDotsVariants = cva(undefined, {
  variants: {
    animate: {
      true: "animate-spin [animation-duration:60s]",
      false: "animate-none",
    },
    size: {
      default: undefined,
      screen: "size-[90vh] md:size-[85vw] lg:size-[80vw] xl:size-[75vw]",
    },
  },
  defaultVariants: {
    animate: true,
    size: "default",
  },
})

export interface OrbitingDotsProps
  extends React.ComponentPropsWithRef<"svg">,
    VariantProps<typeof orbitingDotsVariants> {}

export function OrbitingDots({
  className,
  animate,
  size,
  ...props
}: OrbitingDotsProps) {
  return (
    <svg
      width="1156"
      height="1156"
      viewBox="0 0 1156 1156"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(orbitingDotsVariants({ animate, size }), className)}
      {...props}
    >
      <circle
        cx="580"
        cy="578"
        r="513"
        className="stroke-secondary"
        strokeWidth="1"
      />
      <circle
        cx="137.781"
        cy="837.781"
        r="3.5"
        transform="rotate(-60 137.781 837.781)"
        className="fill-muted-foreground"
      />
      <circle cx="457" cy="80" r="5" className="fill-muted-foreground" />
      <circle cx="859" cy="147" r="5" className="fill-muted-foreground" />
      <circle cx="1075" cy="443" r="5" className="fill-foreground" />
      <circle cx="1005" cy="864" r="5" className="fill-muted-foreground" />
      <circle cx="820" cy="1031" r="5" className="fill-muted-foreground" />
      <circle cx="305" cy="1011" r="5" className="fill-foreground" />
      <circle cx="67" cy="551" r="5" className="fill-muted-foreground" />
      <circle
        cx="168.781"
        cy="270.781"
        r="3.5"
        transform="rotate(-60 168.781 270.781)"
        className="fill-foreground"
      />
      <circle
        cx="578.699"
        cy="576.788"
        r="358.8"
        transform="rotate(-60 578.699 576.788)"
        className="stroke-secondary"
        strokeWidth="1"
      />
      <circle
        cx="231.592"
        cy="669.795"
        r="3.5"
        transform="rotate(-60 231.592 669.795)"
        className="fill-foreground"
      />
      <circle
        cx="670.11"
        cy="229.46"
        r="3.5"
        transform="rotate(-60 670.11 229.46)"
        className="fill-foreground"
      />
      <circle
        cx="411.83"
        cy="259.232"
        r="5"
        transform="rotate(-60 411.83 259.232)"
        className="fill-muted-foreground"
      />
      <circle
        cx="900.828"
        cy="419.245"
        r="3.5"
        transform="rotate(-60 900.828 419.245)"
        className="fill-muted-foreground"
      />
      <circle
        cx="936.83"
        cy="589.83"
        r="5"
        transform="rotate(-60 936.83 589.83)"
        className="fill-muted-foreground"
      />
      <circle
        cx="559.998"
        cy="935.379"
        r="3.5"
        transform="rotate(-60 559.998 935.379)"
        className="fill-muted-foreground"
      />
    </svg>
  )
}
