import Link from "next/link"

import QuickNavigate from "@/components/QuickNavigate"

export default () => {
  return (
    <header className="w-full bg-transparent font-medium text-light-900">
      <div className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
        <Link href="/" className="text-2xl font-bold">
          <span className="text-light-100">phase</span>
          <span className="text-light-900">bot</span>
        </Link>
        <QuickNavigate></QuickNavigate>
      </div>
    </header>
  )
}
