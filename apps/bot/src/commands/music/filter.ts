import { EmbedBuilder } from "discord.js"
import { BotSubcommandBuilder } from "phasebot/builders"

import { PhaseColour } from "~/lib/enums"
import { BotError } from "~/lib/errors"

import type { GuildMember } from "discord.js"

const filters = {
  "3d": {
    name: "3D",
    value: "apulsator=hz=0.125",
  },
  bassboost: {
    name: "Bass Boost",
    value: "bass=g=10",
  },
  reverse: {
    name: "Reverse",
    value: "areverse",
  },
  echo: {
    name: "Echo",
    value: "aecho=0.8:0.9:1000:0.3",
  },
  surround: {
    name: "Surround",
    value: "surround",
  },
  phaser: {
    name: "Phaser",
    value: "aphaser",
  },
  flanger: {
    name: "Flanger",
    value: "flanger",
  },
  tremolo: {
    name: "Tremolo",
    value: "tremolo",
  },
  gate: {
    name: "Gate",
    value: "agate",
  },
  haas: {
    name: "Haas",
    value: "haas",
  },
  earwax: {
    name: "Earwax",
    value: "earwax",
  },
  none: {
    name: "No filter",
    value: "none",
  },
}

export default new BotSubcommandBuilder()
  .setName("filter")
  .setDescription("Sets the filter of the music.")
  .addStringOption((option) =>
    option
      .setName("filter")
      .setDescription("The filter to set.")
      .addChoices(Object.values(filters))
      .setRequired(true),
  )
  .setMetadata({ dmPermission: false })
  .setExecute(async (interaction) => {
    await interaction.deferReply()

    const member = interaction.member as GuildMember
    const channel = member.voice.channel

    if (!channel?.isVoiceBased()) {
      return void interaction.editReply(
        BotError.specificChannelOnlyCommand("voice").toJSON(),
      )
    }

    const queue = interaction.client.distube.getQueue(interaction.guildId!)

    if (!queue) {
      return void interaction.editReply(
        new BotError("No songs were found in the queue.").toJSON(),
      )
    }

    const filterValue = interaction.options.getString("filter", true)
    const [filterKey, filter] = Object.entries(filters).find(
      ([, f]) => f.value === filterValue,
    )!

    const queueFilters = queue.filters

    if (queueFilters.has(filterValue)) {
      return void interaction.editReply(
        new BotError("This filter is already enabled.").toJSON(),
      )
    }

    queueFilters.set(filterKey === "none" ? [] : [filterKey])

    void interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(PhaseColour.Primary)
          .setAuthor({
            name: `Set by ${member.displayName}`,
            iconURL: member.displayAvatarURL(),
          })
          .setDescription(
            `Filter \`${filter.name}\` has been enabled for this queue.`,
          ),
      ],
    })
  })
