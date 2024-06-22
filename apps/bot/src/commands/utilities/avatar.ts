import { ImageExtension, ImageSize } from "discord.js"
import { BotCommandBuilder } from "phasebot/builders"

const imageSizes = [16, 32, 64, 128, 256, 512, 1024, 2048, 4096]

export default new BotCommandBuilder()
  .setName("avatar")
  .setDescription("Get a member's avatar.")
  .addUserOption((option) =>
    option
      .setName("member")
      .setDescription("Pick a member (defaults to you)")
      .setRequired(false),
  )
  .addStringOption((option) =>
    option
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
      ),
  )
  .addNumberOption((option) =>
    option
      .setName("size")
      .setDescription("The image size (defaults to 512)")
      .setRequired(false)
      .setChoices(
        ...imageSizes.map((size) => ({
          name: size.toString(),
          value: size,
        })),
      ),
  )
  .setExecute(async (interaction) => {
    const member = interaction.options.getUser("member")
    const extension = interaction.options.getString("extension")
    const size = interaction.options.getNumber("size")

    interaction.reply(
      (member ?? interaction.user).displayAvatarURL({
        extension: (extension as ImageExtension | null) ?? "webp",
        size: (size as ImageSize | null) ?? 512,
      }),
    )
  })
