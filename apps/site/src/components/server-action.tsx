"use client"

import React from "react"

export const ServerAction = (props: { children: React.ReactElement<any, string | React.JSXElementConstructor<any>>, action: () => Promise<any> }) => {
  return React.cloneElement(props.children, { onClick: async () => await props.action() })
}