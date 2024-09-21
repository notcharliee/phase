import { BotSubcommandBuilder } from "phasebot/builders"

import { BotErrorMessage } from "~/structures/BotError"

import { extensionOption, sizeOption } from "./_options"

import type { GuildMember, ImageExtension, ImageSize } from "discord.js"

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
  .setMetadata({ dmPermission: false })
  .setExecute(async (interaction) => {
    if (!interaction.guild) {
      void interaction.reply(BotErrorMessage.serverOnlyCommand().toJSON())
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
      void interaction.reply(new BotErrorMessage("No avatar URL found.").toJSON())
      return
    }

    void interaction.reply(url)
  })
