interface CircleProgressBarProps extends React.SVGAttributes<SVGElement> {
  value: number
  text: string
}

export const CircleProgressBar = ({
  value,
  text,
  ...props
}: CircleProgressBarProps) => (
  <svg viewBox="0 0 100 100" {...props}>
    <path
      className="stroke-primary transition-all"
      d="M 50,50 m 0,-46 a 46,46 0 1 1 0,92 a 46,46 0 1 1 0,-92"
      fillOpacity="0"
      strokeWidth="8"
      strokeLinecap="square"
      strokeDasharray={289.027}
      strokeDashoffset={0}
    ></path>
    <path
      className="stroke-secondary"
      d="M 50,50 m 0,-46 a 46,46 0 1 1 0,92 a 46,46 0 1 1 0,-92"
      fillOpacity="0"
      strokeWidth="9"
      strokeLinecap="square"
      strokeDasharray={289.027}
      strokeDashoffset={-(289.027 / 100) * value}
    ></path>
    <text
      className="fill-primary text-3xl font-semibold"
      x="50"
      y="52.5"
      textAnchor="middle"
      dominantBaseline="middle"
    >
      {text}
    </text>
  </svg>
)
