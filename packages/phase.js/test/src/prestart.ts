import { sleep } from "~/utils/sleep"

export default async function prestart() {
  await sleep(500)
  return 200
}
