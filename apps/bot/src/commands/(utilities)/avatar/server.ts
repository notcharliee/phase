import { ImageExtension, ImageSize } from "discord.js"
import { BotSubcommandBuilder } from "phasebot/builders"

import { BotError } from "~/lib/errors"

import { extensionOption, sizeOption } from "./_options"

export default new BotSubcommandBuilder()
  .setName("server")
  .setDescription("Gets the server's icon.")
  .addStringOption(extensionOption)
  .addNumberOption(sizeOption)
  .setExecute(async (interaction) => {
    if (!interaction.guild) {
      void interaction.reply(BotError.serverOnlyCommand().toJSON())
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
      void interaction.reply(new BotError("No icon URL found.").toJSON())
      return
    }

    void interaction.reply(url)
  })
