import { BotSubcommandBuilder } from "phasebot/builders"

import { BotErrorMessage } from "~/structures/BotError"

import { extensionOption, sizeOption } from "./_options"

import type { ImageExtension, ImageSize } from "discord.js"

export default new BotSubcommandBuilder()
  .setName("server")
  .setDescription("Gets the server's icon.")
  .addStringOption(extensionOption)
  .addNumberOption(sizeOption)
  .setMetadata({ dmPermission: false })
  .setExecute(async (interaction) => {
    if (!interaction.guild) {
      void interaction.reply(BotErrorMessage.serverOnlyCommand().toJSON())
      return
    }

    const extension = interaction.options.getString("extension")
    const size = interaction.options.getNumber("size")

    const url =
      interaction.guild.iconURL({
        extension: (extension as ImageExtension | null) ?? "webp",
        size: (size as ImageSize | null) ?? 512,
      }) ?? undefined

    if (!url) {
      void interaction.reply(new BotErrorMessage("No icon URL found.").toJSON())
      return
    }

    void interaction.reply(url)
  })
