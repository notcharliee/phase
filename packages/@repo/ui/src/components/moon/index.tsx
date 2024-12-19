import { cva } from "class-variance-authority"

import { cn } from "~/lib/utils"

import type { VariantProps } from "class-variance-authority"

export const moonVariants = cva(undefined, {
  variants: {
    animate: {
      true: "animate-spin [animation-duration:1.5s]",
      false: "animate-none",
    },
    variant: {
      default: undefined,
      glow: "!shadow-glow-sm shadow-primary rounded-full",
    },
  },
  defaultVariants: {
    animate: false,
    variant: "default",
  },
})

export interface MoonProps
  extends React.ComponentPropsWithRef<"svg">,
    VariantProps<typeof moonVariants> {}

export function Moon({ className, animate, variant, ...props }: MoonProps) {
  return (
    <svg
      width="512"
      height="512"
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(moonVariants({ animate, variant }), className)}
      {...props}
    >
      <path
        d="M256 511.621C397.176 511.621 511.621 397.176 511.621 256C511.621 114.824 397.176 0.378723 256 0.378723C114.824 0.378723 0.378711 114.824 0.378711 256C0.378711 397.176 114.824 511.621 256 511.621Z"
        className="fill-foreground"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M488.784 361.762C446.761 396.493 393.31 417.285 335.121 417.285C199.828 417.285 90.1506 304.883 90.1506 166.228C90.1506 118.591 103.097 74.0523 125.58 36.1064C50.6159 80.6642 0.378711 162.465 0.378711 256C0.378711 397.176 114.824 511.621 256 511.621C359.456 511.621 448.558 450.162 488.784 361.762Z"
        className="fill-muted-foreground"
      />
      <path
        d="M207.31 405.873C226.217 405.873 241.545 390.546 241.545 371.639C241.545 352.731 226.217 337.404 207.31 337.404C188.403 337.404 173.075 352.731 173.075 371.639C173.075 390.546 188.403 405.873 207.31 405.873Z"
        className="fill-muted-foreground stroke-foreground"
        strokeWidth="8"
      />
      <path
        d="M110.909 274.068C120.888 274.068 128.977 265.979 128.977 256C128.977 246.021 120.888 237.932 110.909 237.932C100.93 237.932 92.8401 246.021 92.8401 256C92.8401 265.979 100.93 274.068 110.909 274.068Z"
        className="fill-muted-foreground stroke-foreground"
        strokeWidth="8"
      />
      <path
        d="M270.455 53.6331C278.438 53.6331 284.91 47.1615 284.91 39.1783C284.91 31.1952 278.438 24.7236 270.455 24.7236C262.472 24.7236 256 31.1952 256 39.1783C256 47.1615 262.472 53.6331 270.455 53.6331Z"
        className="fill-muted-foreground stroke-foreground"
        strokeWidth="6.08622"
      />
      <path
        d="M302.407 192.095C317.953 192.095 330.556 179.492 330.556 163.946C330.556 148.4 317.953 135.797 302.407 135.797C286.861 135.797 274.258 148.4 274.258 163.946C274.258 179.492 286.861 192.095 302.407 192.095Z"
        className="fill-muted-foreground stroke-foreground"
        strokeWidth="6.08622"
      />
      <path
        d="M421.089 309.255C452.601 309.255 478.147 283.709 478.147 252.196C478.147 220.684 452.601 195.138 421.089 195.138C389.577 195.138 364.031 220.684 364.031 252.196C364.031 283.709 389.577 309.255 421.089 309.255Z"
        className="fill-muted-foreground stroke-foreground"
        strokeWidth="6.08622"
      />
      <path
        d="M274.259 298.604C291.906 298.604 306.211 284.298 306.211 266.651C306.211 249.004 291.906 234.699 274.259 234.699C256.612 234.699 242.306 249.004 242.306 266.651C242.306 284.298 256.612 298.604 274.259 298.604Z"
        className="fill-muted-foreground stroke-foreground"
        strokeWidth="6.08622"
      />
      <path
        d="M167.75 128.189C180.355 128.189 190.573 117.971 190.573 105.366C190.573 92.761 180.355 82.5427 167.75 82.5427C155.145 82.5427 144.926 92.761 144.926 105.366C144.926 117.971 155.145 128.189 167.75 128.189Z"
        className="fill-muted-foreground stroke-foreground"
        strokeWidth="6.08622"
      />
      <path
        d="M187.53 210.354C194.252 210.354 199.702 204.904 199.702 198.181C199.702 191.458 194.252 186.009 187.53 186.009C180.807 186.009 175.357 191.458 175.357 198.181C175.357 204.904 180.807 210.354 187.53 210.354Z"
        className="fill-muted-foreground stroke-foreground"
        strokeWidth="6.08622"
      />
    </svg>
  )
}
