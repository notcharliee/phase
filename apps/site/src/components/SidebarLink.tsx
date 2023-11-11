"use client"

import Link from "next/link"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import * as FaSolid from "@fortawesome/free-solid-svg-icons"

export default ({
  icon,
  title,
  href,
}: {
  icon: FaSolid.IconDefinition
  title?: string
  href: string
}) => {
  return (
    <Link
      href={href}
      className="w-full rounded border border-dark-600 bg-dark-700 p-3 pl-4 pr-4 font-medium shadow hover:bg-dark-600"
    >
      <FontAwesomeIcon
        icon={icon}
        className="inline-block h-4 w-4"
        style={{ marginRight: title ? "10px" : undefined }}
      ></FontAwesomeIcon>
      {title ?? <></>}
    </Link>
  )
}
