import { YouTubePlaylist, YouTubePlugin } from "@distube/youtube"
import puppeteer from "puppeteer-extra"
import stealthPlugin from "puppeteer-extra-plugin-stealth"

import { QueueManager } from "~/managers/queue"
import { VoiceManager } from "~/managers/voice"
import { Song } from "~/structures/song"

import type { Cookie } from "@distube/ytdl-core"
import type { Client, GuildMember, VoiceBasedChannel } from "discord.js"

export enum MusicError {
  InvalidQuery = "Invalid query",
}

export class Music {
  public readonly client: Client
  public readonly voices: VoiceManager
  public readonly queues: QueueManager
  public readonly youtube: YouTubePlugin

  constructor(client: Client) {
    this.client = client
    this.voices = new VoiceManager()
    this.queues = new QueueManager(this)
    this.youtube = new YouTubePlugin()

    client.on("voiceStateUpdate", (oldState, newState) => {
      const bot = oldState.guild.members.me!

      const botWasConnected = oldState.channel?.members.has(bot.id)
      const botIsStillConnected = newState.channel?.members.has(bot.id)

      if (!botWasConnected) return

      const botIsLonely = newState.channel?.members.size === 1

      if (botWasConnected && botIsStillConnected && botIsLonely) {
        bot.voice.disconnect()
      } else if (botWasConnected && !botIsStillConnected) {
        const queue = this.queues.get(oldState.guild.id)
        if (queue) queue.delete()
      }
    })
  }

  /**
   * Plays a song or playlist.
   *
   * @returns An array of songs that were added to the queue.
   */
  public async play(
    voiceChannel: VoiceBasedChannel,
    submitter: GuildMember,
    query: string,
  ): Promise<Song[]> {
    const queue = this.queues.has(voiceChannel.guild.id)
      ? this.queues.get(voiceChannel.guild.id)!
      : this.queues.create(voiceChannel)

    const youtubeSongOrPlaylist = this.youtube.validate(query)
      ? await this.youtube.resolve(query, {}).catch(() => null)
      : await this.youtube.searchSong(query, {}).catch(() => null)

    if (!youtubeSongOrPlaylist) {
      throw new Error(MusicError.InvalidQuery)
    }

    if (youtubeSongOrPlaylist instanceof YouTubePlaylist) {
      const youtubePlaylist = youtubeSongOrPlaylist

      const newSongs: Song[] = []

      for (const youtubeSong of youtubePlaylist.songs) {
        const streamUrl = await this.youtube
          .getStreamURL(youtubeSong)
          .catch(() => null)

        if (!streamUrl) {
          throw new Error(MusicError.InvalidQuery)
        }

        const song = new Song(queue, {
          name: youtubeSong.name!,
          thumbnail: youtubeSong.thumbnail!,
          duration: youtubeSong.duration,
          url: youtubeSong.url!,
          streamUrl,
          submitter,
        })

        newSongs.push(song)
        queue.addSong(song)
      }

      return newSongs
    } else {
      const youtubeSong = youtubeSongOrPlaylist

      const streamUrl = await this.youtube
        .getStreamURL(youtubeSong)
        .catch(() => null)

      if (!streamUrl) {
        throw new Error(MusicError.InvalidQuery)
      }

      const song = new Song(queue, {
        name: youtubeSong.name!,
        thumbnail: youtubeSong.thumbnail!,
        duration: youtubeSong.duration,
        url: youtubeSong.url!,
        streamUrl,
        submitter,
      })

      queue.addSong(song)

      return [song]
    }
  }

  /**
   * Gets the queue for a guild.
   */
  public getQueue(guildId: string) {
    return this.queues.get(guildId)
  }

  public async getCookies(refresh = false): Promise<Cookie[]> {
    if (!process.env.GOOGLE_EMAIL || !process.env.GOOGLE_PASSWORD) {
      throw new Error("Google credentials not set")
    }

    const stealth = stealthPlugin()

    stealth.enabledEvasions.delete("iframe.contentWindow")
    stealth.enabledEvasions.delete("media.codecs")

    puppeteer.use(stealth)

    const cookiesFile = Bun.file(".cookies.json")
    const cookiesFileExists = await cookiesFile.exists()

    if (cookiesFileExists && !refresh) {
      try {
        const cookiesJson: unknown = await cookiesFile.json()
        return cookiesJson as Cookie[]
      } catch (e) {
        console.error("Failed to parse cookies JSON:", e)
      }
    }

    console.log("Attempting to refresh YouTube cookies ...")

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
    } catch {
      // fallback to clicking "sign in" on navbar
      await page.click("#buttons > ytd-button-renderer > yt-button-shape > a")
    }

    // enter email
    await page.waitForSelector("#identifierId", { visible: true })
    await page.type("#identifierId", process.env.GOOGLE_EMAIL)
    await page.click("#identifierNext")

    // enter password
    await page.waitForSelector("#password", { visible: true })
    await page.type("#password input", process.env.GOOGLE_PASSWORD)

    await page.evaluate(
      // @ts-expect-error because page.click() on '#passwordNext' is not working
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
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
      console.log("Failed to refresh YouTube cookies.")
    }

    return cookies
  }

  static plugin(this: void, client: Client<false>) {
    Object.assign(client, { music: new Music(client) })
    return client
  }
}
