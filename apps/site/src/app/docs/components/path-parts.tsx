"use client"

import { usePathname } from "next/navigation"

import { ChevronRightIcon } from "@radix-ui/react-icons"


export const PathParts = () => {
  const pathname = usePathname()

  const pathnameParts = pathname
  .replace("/docs", "Docs")
  .replaceAll("-", " ")
  .replace(/\b\w/g, match => match.toUpperCase())
  .split("/")

  if (pathnameParts.length == 1) pathnameParts.push("Introduction")

  return pathnameParts.map((part, index) => (
    <div className="flex items-center space-x-1" key={index}>
      <span className={index + 1 === pathnameParts.length ? "font-medium text-foreground" : ""}>{part}</span>
      {index + 1 !== pathnameParts.length && <ChevronRightIcon className="h-4 w-4" />}
    </div>
  ))
}
