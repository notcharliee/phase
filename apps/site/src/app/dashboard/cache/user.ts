import { cache } from "react"

import { getUser as fn } from "@/lib/auth"

export const getUser = cache(fn)
