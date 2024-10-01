import type { IconProps } from "@radix-ui/react-icons/dist/types"

export function CommandIcon(props: IconProps) {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M25 4H5C4.44772 4 4 4.44772 4 5V25C4 25.5522 4.44772 26 5 26H25C25.5522 26 26 25.5522 26 25V5C26 4.44772 25.5522 4 25 4ZM5 2C3.34314 2 2 3.34314 2 5V25C2 26.6568 3.34314 28 5 28H25C26.6568 28 28 26.6568 28 25V5C28 3.34314 26.6568 2 25 2H5Z"
        fill="currentColor"
      />
      <path
        d="M16.3265 8.5L10.9695 21.5H13.6734L19.0305 8.5H16.3265Z"
        fill="currentColor"
      />
    </svg>
  )
}
