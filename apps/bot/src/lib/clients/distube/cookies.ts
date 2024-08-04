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

  // if refresh is true, wait for the cookies to refresh first
  if (refresh) await refreshCookies()

  while (attempt < 3) {
    attempt++

    const cookiesFile = Bun.file(".cookies.json")
    const cookiesFileExists = await cookiesFile.exists()

    if (cookiesFileExists) {
      try {
        const cookiesJson = await cookiesFile.json()
        return cookiesJson as Cookie[]
      } catch (e) {
        console.error("Failed to parse cookies JSON:", e)
      }
    } else {
      await refreshCookies()
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
  }

  throw new Error(
    "Failed to retrieve or parse cookies from .cookies.json after 3 attempts",
  )
}

export async function refreshCookies() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  })

  const page = await browser.newPage()
  await page.goto("https://www.youtube.com", { waitUntil: "networkidle2" })

  try {
    // press "sign in" button on youtube in accept cookie usage
    await page.click(
      "#topbar > div.top-buttons.style-scope.ytd-consent-bump-v2-lightbox > div:nth-child(2) > ytd-button-renderer > yt-button-shape > a",
    )
  } catch (e) {
    // press "sign in" on navbar
    await page.click("#buttons > ytd-button-renderer > yt-button-shape > a")
  }

  // type email in form
  await page.waitForSelector("#identifierId", { visible: true })
  await page.type("#identifierId", env.GOOGLE_EMAIL)
  await page.click("#identifierNext")

  // type password in form
  await page.waitForSelector("#password", { visible: true })
  await page.type("#password input", env.GOOGLE_PASSWORD)

  await page.evaluate(
    // @ts-expect-error because page.click() on '#passwordNext' is not working
    (selector) => document.querySelector(selector).click(),
    "#passwordNext",
  )

  // skip measures of security (if google asks)
  try {
    const NotNowSelector =
      "#yDmH0d > c-wiz:nth-child(9) > div > div > div > div.L5MEH.Bokche.ypEC4c > div.lq3Znf > div:nth-child(1) > button > span"
    await page.waitForSelector(NotNowSelector, { timeout: 1e4 })
    await page.click(NotNowSelector)

    console.log("Clicked not now button")
  } catch (e) {
    await page.goto("https://www.youtube.com", { waitUntil: "networkidle2" })

    console.log("Failed to click not now button")
  }

  const cookies = await page.cookies()

  await browser.close()

  if (cookies.length < 10) {
    throw new Error("Failed to authenticate with Google")
  }

  await Bun.write(".cookies.json", JSON.stringify(cookies))
}
