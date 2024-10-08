import { SlashCommandNumberOption, SlashCommandStringOption } from "discord.js"

const imageSizes = [16, 32, 64, 128, 256, 512, 1024, 2048, 4096]

export const extensionOption = new SlashCommandStringOption()
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

export const sizeOption = new SlashCommandNumberOption()
  .setName("size")
  .setDescription("The image size (defaults to 512)")
  .setRequired(false)
  .setChoices(
    ...imageSizes.map((size) => ({
      name: size.toString(),
      value: size,
    })),
  )
