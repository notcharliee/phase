import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  GuildMember,
  GuildTextBasedChannel,
} from "discord.js"
import { botEvent } from "phasebot"

import { ModuleId } from "@repo/config/phase/modules.ts"

import { cache } from "~/lib/cache"
import { PhaseColour } from "~/lib/enums"
import { BotError } from "~/lib/errors"

export default botEvent("interactionCreate", async (client, interaction) => {
  if (
    !interaction.isButton() ||
    !interaction.inGuild() ||
    !interaction.customId.startsWith("form.start.")
  ) {
    return
  }

  await interaction.deferReply({ ephemeral: true })

  const guildDoc = await cache.guilds.get(interaction.guildId!)
  const moduleConfig = guildDoc?.modules?.[ModuleId.Forms]

  if (!moduleConfig?.enabled) {
    return interaction.editReply(
      BotError.moduleNotEnabled(ModuleId.Forms).toJSON(),
    )
  }

  const form = moduleConfig.forms.find(
    (form) => form.id === interaction.customId.split(".")[2],
  )

  if (!form) {
    return interaction.editReply(
      new BotError(
        "Could not find the form associated with this button. It may have been deleted.",
      ).toJSON(),
    )
  }

  try {
    await interaction.user.send({
      embeds: [
        new EmbedBuilder()
          .setTitle("Form process started")
          .setDescription(
            "You have started the form submission process.\n\nThe bot will ask a question and you'll have 10 minutes to respond before it times out.",
          )
          .setColor(PhaseColour.Primary)
          .setFooter({
            iconURL: interaction.guild?.iconURL() ?? undefined,
            text: `Sent from ${interaction.guild!.name}`,
          }),
      ],
    })
  } catch (error) {
    return interaction.editReply(
      new BotError(
        "Make sure the bot can DM you, otherwise it can't start the form.",
      ).toJSON(),
    )
  }

  interaction.editReply({
    embeds: [
      new EmbedBuilder()
        .setTitle("Form process started")
        .setDescription("Open your DMs and follow the instructions.")
        .setColor(PhaseColour.Primary),
    ],
  })

  const startedAt = Date.now()

  const questionsAndAnswers: [string, string | null][] = form.questions.map(
    (question) => [question, null],
  )

  const askQuestion = async () => {
    const questionIndex = questionsAndAnswers.findIndex(
      ([_, answer]) => answer === null,
    )

    const question =
      questionIndex !== -1 ? questionsAndAnswers[questionIndex]![0] : null

    if (question) {
      const questionMessage = await interaction.user.send({
        embeds: [
          new EmbedBuilder()
            .setColor(PhaseColour.Primary)
            .setAuthor({
              iconURL: interaction.guild?.iconURL() ?? undefined,
              name: `Sent from ${interaction.guild!.name}`,
            })
            .setTitle(
              `${form.name} - ${questionIndex + 1}/${form.questions.length}`,
            )
            .setDescription(question)
            .setFooter({
              text: `Respond with \`STOP\` to cancel the form.`,
            }),
        ],
      })

      const answerMessage = (
        await questionMessage.channel.awaitMessages({
          filter: (message) => !message.author.bot,
          max: 1,
          time: 1000 * 60 * 10,
        })
      ).at(0)

      if (!answerMessage) {
        return interaction.user.send(
          new BotError(
            "You didn't respond in time.\nTo restart, go to <#123456789012345678>.",
          ).toJSON(),
        )
      }

      if (answerMessage.content === "STOP") {
        return interaction.user.send({
          embeds: [
            new EmbedBuilder()
              .setColor(PhaseColour.Primary)
              .setTitle("Form cancelled")
              .setDescription(
                "Your form has been cancelled and your answers have been discarded.",
              ),
          ],
        })
      }

      questionsAndAnswers[questionIndex]![1] = answerMessage.content

      askQuestion()
    } else {
      interaction.user.send({
        embeds: [
          new EmbedBuilder()
            .setTitle("Form submitted")
            .setDescription("Your answers have been submitted.")
            .setColor(PhaseColour.Primary)
            .setFooter({
              iconURL: interaction.guild?.iconURL() ?? undefined,
              text: `Sent from ${interaction.guild!.name}`,
            }),
        ],
      })

      const channel = client.channels.cache.get(
        moduleConfig.channel,
      ) as GuildTextBasedChannel

      const member = interaction.member as GuildMember

      const endedAt = Math.floor((Date.now() - startedAt) / 1000)
      const minutes = Math.floor(endedAt / 60)
      const seconds = endedAt % 60
      const duration = minutes > 0 ? `${minutes}m, ${seconds}s` : `${seconds}s`

      const responses = questionsAndAnswers
        .map((response) => `**${response[0]}**\n${response[1]}`)
        .join("\n\n")

      channel.send({
        embeds: [
          new EmbedBuilder()
            .setTitle(`New ${form.name} Submission`)
            .setDescription(
              `**Member:** ${member}\n**Joined:** ${member.joinedAt ? `<t:${Math.floor(member.joinedAt.getTime() / 1000)}:R>` : "Unknown"}\n**Duration:** ${duration}\n\n${responses}`,
            )
            .setColor(PhaseColour.Primary)
            .setThumbnail(member.displayAvatarURL()),
        ],
        components: [
          new ActionRowBuilder<ButtonBuilder>().setComponents(
            new ButtonBuilder()
              .setCustomId(`form.accept.${form.id}.${member.id}`)
              .setLabel("Accept")
              .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
              .setCustomId(`form.reject.${form.id}.${member.id}`)
              .setLabel("Reject")
              .setStyle(ButtonStyle.Secondary),
          ),
        ],
      })
    }
  }

  askQuestion()
})
