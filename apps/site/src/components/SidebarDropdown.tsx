"use client"

import * as React from "react"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import * as FaSolid from "@fortawesome/free-solid-svg-icons"

export default ({
  icon,
  title,
  items,
  disabled,
  open,
}: {
  icon: FaSolid.IconDefinition
  title: string
  items?: React.ReactElement[]
  disabled?: boolean
  open?: boolean
}) => {
  const [linksVisibility, setLinksVisibility] = React.useState(open ?? false)
  const toggleLinksVisibility = () =>
    !disabled
      ? setLinksVisibility(!linksVisibility)
      : setLinksVisibility(linksVisibility)

  const dropdownItem = (item: React.ReactElement, key: number) =>
    React.cloneElement(item, {
      className:
        "pl-4 p-2 hover:bg-dark-500 font-medium text-sm text-light-400 leading-none",
      key,
    })

  return (
    <div>
      <div
        className={
          "flex w-full select-none items-center rounded border border-dark-600 bg-dark-700 p-3 pl-4 pr-4 font-medium shadow" +
          `${
            disabled
              ? " cursor-not-allowed brightness-90"
              : " cursor-pointer hover:bg-dark-600"
          }`
        }
        onClick={toggleLinksVisibility}
      >
        <FontAwesomeIcon
          icon={icon}
          className="mr-2.5 inline-block h-4 w-4"
        ></FontAwesomeIcon>
        {title}
        <FontAwesomeIcon
          icon={FaSolid.faAngleDown}
          className="float-right ml-auto h-4 w-4 duration-150"
          style={{
            transform: linksVisibility ? "rotate(180deg)" : "rotate(0deg)",
          }}
        ></FontAwesomeIcon>
      </div>
      <div
        className="ml-5 flex-col border-l border-dark-600"
        style={{ display: linksVisibility ? "flex" : "none" }}
      >
        {items?.map((item, key) => {
          return dropdownItem(item, key)
        })}
      </div>
    </div>
  )
}
