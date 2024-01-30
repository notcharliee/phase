import Link from "next/link"
import { ArrowRightIcon } from "@radix-ui/react-icons"


export const Announcement = () => (
  <Link
    href="/docs/changelog"
    className="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm font-medium"
  >
    <span className="mr-4">🎉</span>
    <span className="inline">Check out the v3 changelog.</span>
    <ArrowRightIcon className="ml-2 h-4 w-4" />
  </Link>
)
