"use client"

import { useEffect } from "react"

interface AccessTokenProps {
  accessToken: string
}

export function SetSearchParams(props: AccessTokenProps) {
  useEffect(() => {
    window.history.replaceState(
      null,
      "",
      "/auth/login?access_token=" + props.accessToken,
    )
  }, [props.accessToken])

  return null
}
