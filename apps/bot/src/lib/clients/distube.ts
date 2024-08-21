import { getClient } from "phasebot"

import { YouTubePlugin } from "@distube/youtube"
import { DisTube, Events } from "distube"
import ffmpegPath from "ffmpeg-static"
import puppeteer from "puppeteer-extra"
import stealthPlugin from "puppeteer-extra-plugin-stealth"

import { env } from "~/lib/env"

import type { Cookie } from "@distube/ytdl-core"

const stealth = stealthPlugin()

stealth.enabledEvasions.delete("iframe.contentWindow")
stealth.enabledEvasions.delete("media.codecs")

puppeteer.use(stealth)

export async function getCookies(refresh: boolean = false): Promise<Cookie[]> {
  const cookiesFile = Bun.file(".cookies.json")
  const cookiesFileExists = await cookiesFile.exists()

  if (cookiesFileExists && !refresh) {
    try {
      const cookiesJson = await cookiesFile.json()
      return cookiesJson as Cookie[]
    } catch (e) {
      console.error("Failed to parse cookies JSON:", e)
    }
  }

  // refresh cookies if the file doesn't exist or if refresh is requested
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    ignoreDefaultArgs: ["--disable-extensions"],
  })

  const page = await browser.newPage()
  await page.goto("https://www.youtube.com", { waitUntil: "networkidle2" })

  try {
    // attempt to click "sign in" button
    await page.click(
      "#topbar > div.top-buttons.style-scope.ytd-consent-bump-v2-lightbox > div:nth-child(2) > ytd-button-renderer > yt-button-shape > a",
    )
  } catch (e) {
    // fallback to clicking "sign in" on navbar
    await page.click("#buttons > ytd-button-renderer > yt-button-shape > a")
  }

  // enter email
  await page.waitForSelector("#identifierId", { visible: true })
  await page.type("#identifierId", env.GOOGLE_EMAIL)
  await page.click("#identifierNext")

  // enter password
  await page.waitForSelector("#password", { visible: true })
  await page.type("#password input", env.GOOGLE_PASSWORD)

  await page.evaluate(
    // @ts-expect-error because page.click() on '#passwordNext' is not working
    (selector) => document.querySelector(selector).click(),
    "#passwordNext",
  )

  // handle potential security prompt
  try {
    const notNowSelector = `#yDmH0d > c-wiz:nth-child(9) > div > div > div > div.L5MEH.Bokche.ypEC4c > div.lq3Znf > div:nth-child(1) > button > span`
    await page.waitForSelector(notNowSelector, { timeout: 10000 })
    await page.click(notNowSelector)
  } catch {
    await page.goto("https://www.youtube.com", { waitUntil: "networkidle2" })
  }

  const cookies = await page.cookies()
  await browser.close()

  if (cookies.length >= 10) {
    await Bun.write(".cookies.json", JSON.stringify(cookies))
  } else {
    console.error(
      "Failed to authenticate with Google, falling back to guest cookies.\n",
    )
  }

  return cookies
}

const globalForDistubeClient = globalThis as unknown as {
  distubeClient: DisTube | undefined
}

export const distubeClient =
  globalForDistubeClient.distubeClient ??
  new DisTube(getClient(), {
    plugins: [new YouTubePlugin({ cookies: await getCookies() })],
    ffmpeg: { path: ffmpegPath! },
    emitAddListWhenCreatingQueue: false,
    emitAddSongWhenCreatingQueue: false,
    emitNewSongOnly: false,
    savePreviousSongs: false,
    nsfw: false,
  })

distubeClient.on(Events.FINISH, (queue) => queue.stop())
distubeClient.on(Events.DISCONNECT, (queue) => queue.stop())
distubeClient.on(Events.DELETE_QUEUE, (queue) => queue.voice.leave())
distubeClient.on(Events.ERROR, (error) => console.error(error))
