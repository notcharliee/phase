"use server"

import { EmbedBuilder } from "@discordjs/builders"
import { API } from "@discordjs/core/http-only"
import { REST } from "@discordjs/rest"

import { env } from "~/lib/env"

import { formSchema } from "./schema"

import type { FormValues } from "./schema"

const discordREST = new REST().setToken(env.DISCORD_TOKEN)
const discordAPI = new API(discordREST)

export const createBugReport = async (values: FormValues) => {
  const channelId = "1263379108453158922"
  const roleId = "1078441789985411172"

  const data = formSchema.parse(values)

  await discordAPI.channels.createMessage(channelId, {
    content: `<@&${roleId}>`,
    embeds: [
      new EmbedBuilder()
        .setTitle("New Bug Report")
        .setDescription("Submitted using the bug report form.")
        .setColor(parseInt("ed4245", 16))
        .setFields([
          { name: "Subject", value: data.subject, inline: true },
          {
            name: "Urgency",
            value:
              data.urgency === "low"
                ? "🟦 Low"
                : data.urgency === "medium"
                  ? "🟨 Medium"
                  : "🟥 High",
            inline: true,
          },
          { name: "Body", value: data.body, inline: false },
          {
            name: "Guild ID",
            value: data.guildId ?? "Not provided",
            inline: true,
          },
          {
            name: "Channel ID",
            value: data.channelId ?? "Not provided",
            inline: true,
          },
        ])
        .setTimestamp()
        .toJSON(),
    ],
  })
}
