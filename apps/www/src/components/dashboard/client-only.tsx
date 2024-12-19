"use client"

import React from "react"

import { useIsClient } from "@uidotdev/usehooks"

/**
 * hack to work around next.js hydration
 * @see https://github.com/uidotdev/usehooks/issues/218
 */

interface ClientOnlyProps {
  children: React.ReactNode
}

export const ClientOnly: React.FC<ClientOnlyProps> = ({ children }) => {
  const isClient = useIsClient()

  // render children if on client side, otherwise return null
  return isClient ? <>{children}</> : null
}
