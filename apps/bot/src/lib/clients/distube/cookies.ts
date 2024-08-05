import puppeteer from "puppeteer-extra"
import stealthPlugin from "puppeteer-extra-plugin-stealth"

import { env } from "~/lib/env"

import type { Cookie } from "@distube/ytdl-core"

const stealth = stealthPlugin()

stealth.enabledEvasions.delete("iframe.contentWindow")
stealth.enabledEvasions.delete("media.codecs")

puppeteer.use(stealth)

export async function getCookies(refresh: boolean = false): Promise<Cookie[]> {
  let attempt = 0

  while (attempt < 3) {
    attempt++

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

    // Refresh cookies if the file doesn't exist or if refresh is requested
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      ignoreDefaultArgs: ["--disable-extensions"],
    })

    const page = await browser.newPage()
    await page.goto("https://www.youtube.com", { waitUntil: "networkidle2" })

    try {
      // Attempt to click "sign in" button
      await page.click(
        "#topbar > div.top-buttons.style-scope.ytd-consent-bump-v2-lightbox > div:nth-child(2) > ytd-button-renderer > yt-button-shape > a",
      )
    } catch (e) {
      // Fallback to clicking "sign in" on navbar
      await page.click("#buttons > ytd-button-renderer > yt-button-shape > a")
    }

    // Enter email
    await page.waitForSelector("#identifierId", { visible: true })
    await page.type("#identifierId", env.GOOGLE_EMAIL)
    await page.click("#identifierNext")

    // Enter password
    await page.waitForSelector("#password", { visible: true })
    await page.type("#password input", env.GOOGLE_PASSWORD)

    await page.evaluate(
      // @ts-expect-error because page.click() on '#passwordNext' is not working
      (selector) => document.querySelector(selector).click(),
      "#passwordNext",
    )

    // Handle potential security prompt
    try {
      const notNowSelector =
        "#yDmH0d > c-wiz:nth-child(9) > div > div > div > div.L5MEH.Bokche.ypEC4c > div.lq3Znf > div:nth-child(1) > button > span"

      await page.waitForSelector(notNowSelector, { timeout: 10000 })
      await page.click(notNowSelector)
    } catch (e) {
      await page.goto("https://www.youtube.com", { waitUntil: "networkidle2" })
    }

    const cookies = await page.cookies()
    await browser.close()

    if (cookies.length >= 10) {
      await Bun.write(".cookies.json", JSON.stringify(cookies))
      return cookies
    } else {
      console.error("Failed to authenticate with Google")
      if (attempt >= 3) {
        return []
      }
    }
  }

  console.log(
    "Failed to retrieve or parse cookies from .cookies.json after 3 attempts, so falling back to guest cookies.",
  )
  return []
}
