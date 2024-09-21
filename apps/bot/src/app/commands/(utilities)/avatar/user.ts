import { BotSubcommandBuilder } from "phasebot/builders"

import { BotErrorMessage } from "~/structures/BotError"

import { extensionOption, sizeOption } from "./_options"

import type { ImageExtension, ImageSize } from "discord.js"

export default new BotSubcommandBuilder()
  .setName("user")
  .setDescription("Gets a user's avatar.")
  .addUserOption((option) =>
    option
      .setName("user")
      .setDescription("Pick a user (defaults to you)")
      .setRequired(false),
  )
  .addStringOption(extensionOption)
  .addNumberOption(sizeOption)
  .setExecute(async (interaction) => {
    const extension = interaction.options.getString("extension")
    const size = interaction.options.getNumber("size")
    const user = interaction.options.getUser("user") ?? interaction.user

    const url =
      user.displayAvatarURL({
        extension: (extension as ImageExtension | null) ?? "webp",
        size: (size as ImageSize | null) ?? 512,
      }) ?? undefined

    if (!url) {
      void interaction.reply(new BotErrorMessage("No avatar URL found.").toJSON())
      return
    }

    void interaction.reply(url)
  })
