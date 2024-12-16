import { BotSubcommandBuilder } from "@phasejs/builders"

import { getUrbanPost } from "~/lib/apis/urban"
import { truncateString } from "~/lib/utils/formatting"

import { BotErrorMessage } from "~/structures/BotError"
import { MessageBuilder } from "~/structures/builders/MessageBuilder"

export default new BotSubcommandBuilder()
  .setName("urban")
  .setDescription("Looks up a word in Urban Dictionary.")
  .addStringOption((option) =>
    option
      .setName("word")
      .setDescription("The word to look up.")
      .setRequired(true),
  )
  .addBooleanOption((option) =>
    option
      .setName("ephemeral")
      .setDescription("Hides the message from others (default: true).")
      .setRequired(false),
  )
  .setExecute(async (interaction) => {
    const word = interaction.options.getString("word", true)
    const ephemeral = interaction.options.getBoolean("ephemeral")

    await interaction.deferReply({
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      ephemeral: ephemeral === null ? true : ephemeral,
    })

    const urbanResponse = await getUrbanPost(word)

    if (!urbanResponse) {
      return void interaction.editReply(
        new BotErrorMessage("Could not find a word by that name."),
      )
    }

    void interaction.editReply(
      new MessageBuilder().setEmbeds((embed) => {
        const { thumbsUp, thumbsDown, ...urbanPost } = urbanResponse[0]

        const truncatedDefinition = truncateString(urbanPost.definition, 2048)
        const truncatedExample = truncateString(urbanPost.example, 1024)

        const total = thumbsUp + thumbsDown

        const thumbsUpPercentage = Math.round((thumbsUp / total) * 100)
        const thumbsDownPercentage = Math.round((thumbsDown / total) * 100)

        return embed
          .setAuthor({
            url: urbanPost.url,
            name: urbanPost.author,
            iconURL: "https://www.urbandictionary.com/favicon-32x32.png",
          })
          .setColor("Primary")
          .setTitle(`Urban Dictionary: ${urbanPost.word}`)
          .setURL(urbanPost.url)
          .setDescription(truncatedDefinition)
          .addFields(
            {
              name: "Example",
              value: truncatedExample,
            },
            {
              name: "Thumbs Up",
              value: `${thumbsUp} (${thumbsUpPercentage}%)`,
              inline: true,
            },
            {
              name: "Thumbs Down",
              value: `${thumbsDown} (${thumbsDownPercentage}%)`,
              inline: true,
            },
          )
          .setTimestamp(urbanPost.createdAt)
      }),
    )
  })
