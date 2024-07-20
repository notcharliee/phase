import {
  GuildMember,
  ImageExtension,
  ImageSize,
  SlashCommandNumberOption,
  SlashCommandStringOption,
} from "discord.js"
import { BotCommandBuilder } from "phasebot/builders"

import { BotError } from "~/lib/errors"

const imageSizes = [16, 32, 64, 128, 256, 512, 1024, 2048, 4096]

const extensionOption = new SlashCommandStringOption()
  .setName("extension")
  .setDescription("The image extension (defaults to webp)")
  .setRequired(false)
  .setChoices(
    {
      name: "webp",
      value: "webp",
    },
    {
      name: "png",
      value: "png",
    },
    {
      name: "jpg",
      value: "jpg",
    },
    {
      name: "jpeg",
      value: "jpeg",
    },
    {
      name: "gif",
      value: "gif",
    },
  )

const sizeOption = new SlashCommandNumberOption()
  .setName("size")
  .setDescription("The image size (defaults to 512)")
  .setRequired(false)
  .setChoices(
    ...imageSizes.map((size) => ({
      name: size.toString(),
      value: size,
    })),
  )

export default new BotCommandBuilder()
  .setName("avatar")
  .setDescription("avatar")
  .addSubcommand((subcommand) =>
    subcommand
      .setName("user")
      .setDescription("Gets a user's avatar.")
      .addUserOption((option) =>
        option
          .setName("user")
          .setDescription("Pick a user (defaults to you)")
          .setRequired(false),
      )
      .addStringOption(extensionOption)
      .addNumberOption(sizeOption),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("member")
      .setDescription("Gets a member's server avatar.")
      .addUserOption((option) =>
        option
          .setName("member")
          .setDescription("Pick a member (defaults to you)")
          .setRequired(false),
      )
      .addStringOption(extensionOption)
      .addNumberOption(sizeOption),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("server")
      .setDescription("Gets the server's avatar.")
      .addStringOption(extensionOption)
      .addNumberOption(sizeOption),
  )
  .setExecute(async (interaction) => {
    const extension = interaction.options.getString("extension")
    const size = interaction.options.getNumber("size")
    const subcommand = interaction.options.getSubcommand()

    let url: string | undefined = undefined

    if (subcommand === "server") {
      if (!interaction.guild) {
        void interaction.reply(BotError.serverOnlyCommand().toJSON())
        return
      }

      url =
        interaction.guild.iconURL({
          extension: (extension as ImageExtension | null) ?? "webp",
          size: (size as ImageSize | null) ?? 512,
        }) ?? undefined
    }

    if (subcommand === "user" || subcommand === "member") {
      const userOrMember =
        subcommand === "user"
          ? interaction.options.getUser("user", true)
          : (interaction.options.getMember("member") as GuildMember | null)

      if (!userOrMember) {
        void interaction.reply(BotError.memberNotFound().toJSON())
        return
      }

      url =
        userOrMember.displayAvatarURL({
          extension: (extension as ImageExtension | null) ?? "webp",
          size: (size as ImageSize | null) ?? 512,
        }) ?? undefined
    }

    if (!url) {
      void interaction.reply(new BotError("No avatar URL found.").toJSON())
      return
    }

    void interaction.reply(url)
  })
