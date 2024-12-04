import { getEnv } from "@repo/env"

import { version as pkgVersion } from "~/../package.json"

import type { BotPluginVersion } from "@phasejs/core"

const env = getEnv("shared")

export const endpoint = "/"
export const url = env.BASE_URL + endpoint
export const version = pkgVersion as BotPluginVersion
