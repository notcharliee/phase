import { getCookies } from "~/lib/clients/distube"

import "~/lib/env"
import "~/lib/db"

export default async function prestart() {
  // gets cookies from youtube
  await getCookies()
}
