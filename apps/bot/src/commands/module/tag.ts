import { EmbedBuilder } from "discord.js"
import { BotCommandBuilder } from "phasebot/builders"

import { TagSchema } from "@repo/schemas"

import { errorMessage, PhaseColour } from "~/utils"

export default new BotCommandBuilder()
  .setName("tag")
  .setDescription("tag")
  .setDMPermission(false)
  .addSubcommand((subcommand) =>
    subcommand
      .setName("add")
      .setDescription("Adds a tag.")
      .addStringOption((option) =>
        option
          .setName("name")
          .setDescription("The name of the tag.")
          .setRequired(true),
      )
      .addStringOption((option) =>
        option
          .setName("value")
          .setDescription("The value of the tag.")
          .setRequired(true),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("edit")
      .setDescription("Edits an existing tag.")
      .addStringOption((option) =>
        option
          .setName("name")
          .setDescription("The name of the tag.")
          .setRequired(true),
      )
      .addStringOption((option) =>
        option
          .setName("value")
          .setDescription("The new value of the tag.")
          .setRequired(true),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("get")
      .setDescription("Gets a tag by name.")
      .addStringOption((option) =>
        option
          .setName("name")
          .setDescription("The name of the tag.")
          .setRequired(true),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("list")
      .setDescription("Lists all the tags in the server."),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("remove")
      .setDescription("Removes a tag.")
      .addStringOption((option) =>
        option
          .setName("name")
          .setDescription("The name of the tag.")
          .setRequired(true),
      ),
  )
  .setExecute(async (interaction) => {
    const tagSchema =
      (await TagSchema.findOne({ guild: interaction.guildId })) ??
      (await new TagSchema({
        guild: interaction.guildId,
        tags: [],
      }).save())

    switch (interaction.options.getSubcommand()) {
      case "add":
        {
          const tagName = interaction.options.getString("name", true)
          const tagValue = interaction.options.getString("value", true)
          const tagIndex = tagSchema.tags.findIndex(
            (tag) => tag.name == tagName,
          )

          if (tagIndex != -1)
            return errorMessage({
              title: "Tag Already Exists",
              description:
                "A tag already exists with that name. Use `/tag edit` instead.",
            })

          tagSchema.tags.push({
            name: tagName,
            value: tagValue,
          })

          tagSchema.save()

          interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(PhaseColour.Primary)
                .setDescription(`Added tag \`${tagName}\` to the server.`)
                .setTitle("Tag Added"),
            ],
          })
        }
        break

      case "edit":
        {
          const tagName = interaction.options.getString("name", true)
          const tagValue = interaction.options.getString("value", true)
          const tagIndex = tagSchema.tags.findIndex(
            (tag) => tag.name == tagName,
          )

          if (tagIndex == -1)
            return errorMessage({
              title: "Tag Not Found",
              description: "Could not find a tag by that name.",
            })

          const tagBeforeValue = tagSchema.tags[tagIndex].value

          tagSchema.tags.splice(tagIndex, 1)

          tagSchema.tags.push({
            name: tagName,
            value: tagValue,
          })

          tagSchema.save()

          interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(PhaseColour.Primary)
                .setDescription(`Edited tag \`${tagName}\`.`)
                .setFields([
                  { name: "Before Value", value: tagBeforeValue },
                  { name: "After Value", value: tagValue },
                ])
                .setTitle("Tag Edited"),
            ],
          })
        }
        break

      case "get":
        {
          const tag = tagSchema.tags.find(
            (tag) => tag.name == interaction.options.getString("name", true),
          )

          if (!tag)
            return errorMessage({
              title: "Tag Not Found",
              description: "Could not find a tag by that name.",
            })

          interaction.reply(tag.value)
        }
        break

      case "list":
        {
          const embedDescription = tagSchema.tags
            .map((tag) => `${tag.name}`)
            .toString()
            .replaceAll(",", ", ")

          interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(PhaseColour.Primary)
                .setDescription(
                  embedDescription.length ? embedDescription : "No tags found.",
                )
                .setTitle(`Tag List (${tagSchema.tags.length})`),
            ],
          })
        }
        break

      case "remove":
        {
          const tagName = interaction.options.getString("name", true)
          const tagIndex = tagSchema.tags.findIndex(
            (tag) => tag.name == tagName,
          )

          if (tagIndex == -1)
            return errorMessage({
              title: "Tag Not Found",
              description: "Could not find a tag by that name.",
            })

          tagSchema.tags.splice(tagIndex, 1)

          tagSchema.save()

          interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(PhaseColour.Primary)
                .setDescription(`Removed tag \`${tagName}\` from the server.`)
                .setTitle("Tag Removed"),
            ],
          })
        }
        break
    }
  })
