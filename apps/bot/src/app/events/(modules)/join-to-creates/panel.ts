import {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  userMention,
} from "discord.js"
import { BotEventBuilder } from "phasebot/builders"

import { ModuleId } from "@repo/utils/modules"

import { db } from "~/lib/db"

import { BotErrorMessage } from "~/structures/BotError"
import { MessageBuilder } from "~/structures/builders/MessageBuilder"

type PanelAction = "name" | "users" | "lock" | "mute" | "transfer" | "delete"

export default new BotEventBuilder()
  .setName("interactionCreate")
  .setContext("Guild")
  .setExecute(async (client, interaction) => {
    if (
      (!interaction.isButton() &&
        !interaction.isUserSelectMenu() &&
        !interaction.isModalSubmit()) ||
      !interaction.channel?.isVoiceBased() ||
      !interaction.customId.startsWith("jtc.panel.")
    ) {
      return
    }

    const customIdParts = interaction.customId.split(".")
    const panelAction = customIdParts[2] as PanelAction

    if (!(panelAction === "name" && interaction.isButton())) {
      await interaction.deferReply({ ephemeral: true })
    }

    const guildDoc = client.stores.guilds.get(interaction.guildId)
    const moduleConfig = guildDoc?.modules?.[ModuleId.JoinToCreates]

    if (!moduleConfig?.enabled) {
      return void interaction.editReply(
        BotErrorMessage.moduleNotEnabled(ModuleId.JoinToCreates),
      )
    }

    const JTCDoc = await db.joinToCreates.findOne({
      guild: interaction.guildId,
      channel: interaction.channelId,
    })

    if (!JTCDoc) {
      return void interaction.editReply(
        new BotErrorMessage("This is not an active JTC channel."),
      )
    }

    if (JTCDoc.owner !== interaction.user.id) {
      return void interaction.editReply(
        new BotErrorMessage("You are not the owner of this JTC channel."),
      )
    }

    const owner = (await interaction.guild?.members
      .fetch(JTCDoc.owner)
      .catch(() => null))!

    try {
      switch (panelAction) {
        case "name": {
          if (interaction.isButton()) {
            const modal = new ModalBuilder()
              .setTitle("Edit Channel Name")
              .setCustomId("jtc.panel.name.modal")
              .setComponents(
                new ActionRowBuilder<TextInputBuilder>().setComponents(
                  new TextInputBuilder()
                    .setStyle(TextInputStyle.Short)
                    .setLabel("Channel Name")
                    .setCustomId("jtc.panel.name.input")
                    .setPlaceholder(`${owner.displayName}'s vc`)
                    .setRequired(true),
                ),
              )

            return void interaction.showModal(modal)
          }

          if (interaction.isModalSubmit()) {
            const newName = interaction.fields.getTextInputValue(
              "jtc.panel.name.input",
            )

            await interaction.channel.setName(newName)

            return void interaction.editReply(
              `Channel name has been changed to \`${newName}\``,
            )
          }

          return
        }

        case "users": {
          if (interaction.isButton()) {
            return void interaction.editReply(
              new MessageBuilder().setComponents((actionrow) => {
                return actionrow.addUserSelectMenu((selectmenu) => {
                  return selectmenu
                    .setCustomId("jtc.panel.users.select")
                    .setPlaceholder("Select a member to disconnect")
                    .setMaxValues(1)
                    .setMinValues(1)
                })
              }),
            )
          }

          if (interaction.isUserSelectMenu()) {
            const memberId = interaction.values[0]!
            const member = interaction.channel.members.get(memberId)

            if (!member) {
              return void interaction.editReply(
                new BotErrorMessage(
                  "The selected member is not in this channel.",
                ),
              )
            }

            if (member.id === owner.id) {
              return void interaction.editReply(
                new BotErrorMessage("You cannot disconnect yourself."),
              )
            }

            return void interaction.editReply(
              `Member ${member.displayName} has been disconnected.`,
            )
          }

          return
        }

        case "lock": {
          const overwrites = interaction.channel.permissionOverwrites.cache.get(
            interaction.guildId,
          )

          const isLocked = overwrites?.deny.has("Connect")
          const isMuted = overwrites?.deny.has("Speak")

          await interaction.channel.permissionOverwrites.set([
            {
              id: interaction.guildId,
              allow: [isLocked ? ["Connect"] : [], isMuted ? [] : ["Speak"]],
              deny: [isLocked ? [] : ["Connect"], isMuted ? ["Speak"] : []],
            },
            {
              id: interaction.user.id,
              allow: ["Connect", "Speak"],
            },
            {
              id: client.user!.id,
              allow: ["Connect", "Speak"],
            },
          ])

          return void interaction.editReply(
            "Channel lock has been " + (isMuted ? "disabled." : "enabled."),
          )
        }

        case "mute": {
          const overwrites = interaction.channel.permissionOverwrites.cache.get(
            interaction.guildId,
          )

          const isMuted = overwrites?.deny.has("Speak")
          const isLocked = overwrites?.deny.has("Connect")

          await interaction.channel.permissionOverwrites.set([
            {
              id: interaction.guildId,
              allow: [isMuted ? ["Speak"] : [], !isLocked ? ["Connect"] : []],
              deny: [isMuted ? [] : ["Speak"], !isLocked ? [] : ["Connect"]],
            },
            {
              id: interaction.user.id,
              allow: ["Speak", "Connect"],
            },
            {
              id: client.user!.id,
              allow: ["Speak", "Connect"],
            },
          ])

          return void interaction.editReply(
            "Channel mute has been " + (isMuted ? "disabled." : "enabled."),
          )
        }

        case "transfer": {
          if (interaction.isButton()) {
            return void interaction.editReply(
              new MessageBuilder().setComponents((actionrow) => {
                return actionrow.addUserSelectMenu((selectmenu) => {
                  return selectmenu
                    .setCustomId("jtc.panel.transfer.select")
                    .setPlaceholder("Select a new owner")
                    .setMaxValues(1)
                    .setMinValues(1)
                })
              }),
            )
          }

          if (interaction.isUserSelectMenu()) {
            const newOwner = interaction.values[0]!
            const newOwnerMember = interaction.channel.members.get(newOwner)
            const newOwnerMention = userMention(newOwner)

            if (newOwner === owner.id) {
              return void interaction.editReply(
                new BotErrorMessage("You already own this channel."),
              )
            }

            if (!newOwnerMember) {
              return void interaction.editReply(
                new BotErrorMessage(
                  "The new owner must already be in this channel.",
                ),
              )
            }

            if (newOwnerMember.user.bot) {
              return void interaction.editReply(
                new BotErrorMessage("The new owner cannot be a bot."),
              )
            }

            await JTCDoc.updateOne({ owner: newOwner })

            return void interaction.editReply(
              `Channel ownership has been transferred to ${newOwnerMention}`,
            )
          }

          return
        }

        case "delete": {
          setTimeout(() => {
            void owner.voice.disconnect().catch(() => null)
          }, 3_000)

          return void interaction.editReply(
            "Channel will be deleted in a few seconds...",
          )
        }

        default: {
          return void interaction.editReply(
            new BotErrorMessage("Invalid panel action."),
          )
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(`[Join to Creates] ${error.message}`)
        console.error(error)

        return void interaction.editReply(
          new BotErrorMessage(
            "Something went wrong. Make sure the bot has the required permissions, then try again.",
          ),
        )
      } else {
        throw error
      }
    }
  })
