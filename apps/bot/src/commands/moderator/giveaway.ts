import { BotCommandBuilder, botCommand } from "phasebot"
import { GiveawaySchema } from "@repo/schemas"
import {
  PhaseColour,
  errorMessage,
  getRandomArrayElements,
  missingPermission,
} from "~/utils"
import {
  PermissionFlagsBits,
  GuildMember,
  EmbedBuilder,
  GuildTextBasedChannel,
} from "discord.js"

export default botCommand(
  new BotCommandBuilder()
    .setName("giveaway")
    .setDescription("giveaway")
    .setDMPermission(false)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("create")
        .setDescription("Creates a new giveaway.")
        .addStringOption((option) =>
          option
            .setName("prize")
            .setDescription("What the winner will get.")
            .setRequired(true)
            .setMaxLength(200),
        )
        .addIntegerOption((option) =>
          option
            .setName("winners")
            .setDescription("How many members will win.")
            .setRequired(true)
            .setMaxValue(15),
        )
        .addStringOption((option) =>
          option
            .setName("duration")
            .setDescription("How long the giveaway will last.")
            .setRequired(true)
            .addChoices(
              {
                name: "1m",
                value: `${1000 * 60 * 1}`,
              },
              {
                name: "15m",
                value: `${1000 * 60 * 15}`,
              },
              {
                name: "30m",
                value: `${1000 * 60 * 30}`,
              },
              {
                name: "1h",
                value: `${1000 * 60 * 60 * 1}`,
              },
              {
                name: "6h",
                value: `${1000 * 60 * 60 * 6}`,
              },
              {
                name: "12h",
                value: `${1000 * 60 * 60 * 12}`,
              },
              {
                name: "1d",
                value: `${1000 * 60 * 60 * 24 * 1}`,
              },
              {
                name: "7d",
                value: `${1000 * 60 * 60 * 24 * 7}`,
              },
            ),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("delete")
        .setDescription("Deletes a giveaway.")
        .addStringOption((option) =>
          option
            .setName("id")
            .setDescription("The ID of the giveaway.")
            .setRequired(true)
            .setMaxLength(200),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("reroll")
        .setDescription("Randomly rerolls a giveaway.")
        .addStringOption((option) =>
          option
            .setName("id")
            .setDescription("The ID of the giveaway.")
            .setRequired(true),
        )
        .addIntegerOption((option) =>
          option
            .setName("amount")
            .setDescription("How many winners you want to reroll.")
            .setRequired(false),
        ),
    ),
  async (client, interaction) => {
    if (!interaction.memberPermissions?.has(PermissionFlagsBits.ManageGuild))
      return interaction.reply(
        missingPermission(PermissionFlagsBits.ManageGuild),
      )

    switch (interaction.options.getSubcommand()) {
      case "create":
        {
          await interaction.deferReply({
            ephemeral: true,
          })

          const prize = interaction.options.getString("prize", true)
          const winners = interaction.options.getInteger("winners", true)
          const duration = interaction.options.getString("duration", true)

          const message = await interaction.channel!.send({
            embeds: [
              new EmbedBuilder()
                .setColor(PhaseColour.Primary)
                .setTitle("One moment...")
                .setDescription(
                  "To save the message ID, we need to send this first.",
                ),
            ],
          })

          const expires = new Date(
            message.createdTimestamp * 1000 + parseInt(duration, 10),
          ).getTime()

          const host = interaction.member as GuildMember

          await message.edit({
            embeds: [
              new EmbedBuilder()
                .setAuthor({
                  iconURL: host.displayAvatarURL(),
                  name: `Hosted by ${host.displayName}`,
                })
                .setColor(PhaseColour.Primary)
                .setTitle(`${prize}`)
                .setDescription(
                  `React with 🎉 to enter!\nGiveaway ends: <t:${Math.floor(expires / 1000)}:R>`,
                )
                .setFooter({ text: `ID: ${message.id}` }),
            ],
          })

          await message.react("🎉")

          await new GiveawaySchema({
            id: message.id,
            channel: message.channelId,
            created: message.createdTimestamp * 1000,
            host: host.id,
            winners,
            prize,
            duration,
            expires,
            expired: false,
          }).save()

          interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setColor(PhaseColour.Primary)
                .setTitle("Giveaway Created")
                .setDescription(
                  `**Prize:** ${prize}\n**Winners:** ${winners}\n**Duration:** <t:${Math.floor(expires / 1000)}:R>`,
                )
                .setFooter({ text: `ID: ${message.id}` }),
            ],
          })
        }
        break

      case "delete":
        {
          await interaction.deferReply({
            ephemeral: true,
          })

          const id = interaction.options.getString("id", true)

          const giveaway = await GiveawaySchema.findOne({ id })

          if (!giveaway) {
            return interaction.editReply(
              errorMessage({
                title: "Giveaway Not Found",
                description:
                  "Giveaway not found! Make sure you have the correct ID and try again.",
              }),
            )
          }

          const channel = client.channels.cache.get(giveaway.channel) as
            | GuildTextBasedChannel
            | undefined

          try {
            const message = await channel?.messages
              .fetch(giveaway.id)
              .catch(() => {})

            if (message) await message.delete()
            await giveaway.deleteOne()

            interaction.editReply({
              embeds: [
                new EmbedBuilder()
                  .setColor(PhaseColour.Primary)
                  .setTitle("Giveaway Deleted")
                  .setDescription(`Giveaway has been deleted.`),
              ],
            })
          } catch {
            return interaction.editReply(
              errorMessage({
                title: "Failed to delete",
                description:
                  "Failed to delete giveaway message. Make sure both the message and channel still exist, and that the bot has access to them, then try again.",
                ephemeral: true,
              }),
            )
          }
        }
        break

      case "reroll":
        {
          await interaction.deferReply({
            ephemeral: true,
          })

          const id = interaction.options.getString("id", true)
          const amount = interaction.options.getInteger("amount", false)

          const giveawaySchema = await GiveawaySchema.findOne({
            guild: interaction.guildId,
            created: id,
            expired: true,
          })

          if (!giveawaySchema) {
            return interaction.editReply(
              errorMessage({
                title: "Giveaway Not Found",
                description:
                  "Giveaway not found! Make sure you have the correct ID and try again.",
              }),
            )
          }

          const giveawayChannel = client.channels.cache.get(
            giveawaySchema.channel,
          ) as GuildTextBasedChannel | undefined

          if (!giveawayChannel) {
            await giveawaySchema.deleteOne()

            return interaction.editReply(
              errorMessage({
                title: "Giveaway Not Found",
                description:
                  "Giveaway not found! Make sure you have the correct ID and try again.",
              }),
            )
          }

          try {
            const giveawayMessage = await giveawayChannel.messages.fetch(
              giveawaySchema.id,
            )
            const giveawayHost = await giveawayChannel.guild.members.fetch(
              giveawaySchema.host,
            )

            const giveawayWinners = giveawaySchema.winners
            const giveawayRerollAmount = amount ?? giveawayWinners

            if (giveawayRerollAmount > giveawayWinners) {
              return interaction.editReply(
                errorMessage({
                  title: "Failed to reroll",
                  description: `Reroll amount cannot be higher than number of giveaway max winners (${giveawayWinners}).`,
                  ephemeral: true,
                }),
              )
            }

            const giveawayReaction = giveawayMessage.reactions.cache.get("🎉")

            if (!giveawayReaction) {
              await giveawayMessage.delete()
              await giveawaySchema.deleteOne()

              return interaction.editReply(
                errorMessage({
                  title: "Giveaway Not Found",
                  description:
                    "Giveaway not found! Make sure you have the correct ID and try again.",
                }),
              )
            }

            const giveawayEntries = (await giveawayReaction.users.fetch()).map(
              (user) => user,
            )

            giveawayEntries.splice(
              giveawayEntries.findIndex((user) => user.id == client.user.id),
              1,
            )

            if (!giveawayEntries.length) {
              return interaction.editReply(
                errorMessage({
                  title: "Failed to reroll",
                  description:
                    "Make sure at least 1 member has entered then try again.",
                  ephemeral: true,
                }),
              )
            }

            const giveawayNewWinners = getRandomArrayElements(
              giveawayEntries,
              giveawayRerollAmount,
            )

            giveawayMessage.reply({
              content: giveawayNewWinners.join(""),
              embeds: [
                new EmbedBuilder()
                  .setAuthor({
                    iconURL: giveawayHost.displayAvatarURL(),
                    name: `Hosted by ${giveawayHost.displayName}`,
                  })
                  .setColor(PhaseColour.Primary)
                  .setDescription(
                    `Congratulations, you have won the giveaway!`,
                  ),
              ],
            })

            interaction.editReply({
              embeds: [
                new EmbedBuilder()
                  .setColor(PhaseColour.Primary)
                  .setDescription(`New Winners: ${giveawayNewWinners.join("")}`)
                  .setTitle("Rerolled Giveaway"),
              ],
            })
          } catch {
            await giveawaySchema.deleteOne()

            return interaction.editReply(
              errorMessage({
                title: "Giveaway Not Found",
                description:
                  "Giveaway not found! Make sure you have the correct ID and try again.",
              }),
            )
          }
        }
        break
    }
  },
)
