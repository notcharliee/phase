import { GuildMember, ImageExtension, ImageSize } from "discord.js"
import { BotSubcommandBuilder } from "phasebot/builders"

import { BotError } from "~/lib/errors"

import { extensionOption, sizeOption } from "./_options"

export default new BotSubcommandBuilder()
  .setName("member")
  .setDescription("Gets a member's server avatar.")
  .addUserOption((option) =>
    option
      .setName("member")
      .setDescription("Pick a member (defaults to you)")
      .setRequired(false),
  )
  .addStringOption(extensionOption)
  .addNumberOption(sizeOption)
  .setExecute(async (interaction) => {
    if (!interaction.guild) {
      void interaction.reply(BotError.serverOnlyCommand().toJSON())
      return
    }

    const extension = interaction.options.getString("extension")
    const size = interaction.options.getNumber("size")
    const member = (interaction.options.getMember("member") ??
      interaction.member) as GuildMember

    const url =
      member.displayAvatarURL({
        extension: (extension as ImageExtension | null) ?? "webp",
        size: (size as ImageSize | null) ?? 512,
      }) ?? undefined

    if (!url) {
      void interaction.reply(new BotError("No avatar URL found.").toJSON())
      return
    }

    void interaction.reply(url)
  })
