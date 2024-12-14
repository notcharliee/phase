import { BotSubcommandBuilder } from "@phasejs/core/builders"
import { ButtonBuilder, ButtonStyle } from "discord.js"

import { capitalCase } from "change-case"

import { askDictionary, getPhonetic } from "~/lib/apis/dictionary"
import { truncateString } from "~/lib/utils/formatting"

import { BotErrorMessage } from "~/structures/BotError"
import { MessageBuilder } from "~/structures/builders/MessageBuilder"

export default new BotSubcommandBuilder()
  .setName("dictionary")
  .setDescription("Looks up a word in the dictionary.")
  .addStringOption((option) =>
    option
      .setName("word")
      .setDescription("The word to look up.")
      .setRequired(true),
  )
  .setExecute(async (interaction) => {
    await interaction.deferReply()

    const word = interaction.options.getString("word", true)

    const dictionaryResponse = await askDictionary(word)

    if (!dictionaryResponse) {
      return void interaction.editReply(
        new BotErrorMessage("Could not find a word by that name."),
      )
    }

    const wordData = dictionaryResponse[0]
    const phonetic = getPhonetic(wordData)

    void interaction.editReply(
      new MessageBuilder()
        .setEmbeds((embed) => {
          return embed
            .setColor("Primary")
            .setTitle(capitalCase(wordData.word))
            .setDescription(phonetic?.text ?? wordData.phonetic ?? null)
            .addFields(
              wordData.meanings
                .filter(
                  (meaning) =>
                    meaning.definitions.filter(
                      (definition) => definition.definition.length,
                    ).length,
                )
                .map((meaning) => ({
                  name: `${capitalCase(meaning.partOfSpeech)} Defintions`,
                  value: truncateString(
                    meaning.definitions
                      .filter((definition) => definition.definition.length)
                      .slice(0, 5)
                      .map((definition) => `- ${definition.definition}`)
                      .join("\n"),
                    1024,
                  ),
                })),
            )
            .addFields(
              wordData.origin
                ? [{ name: "Origin", value: wordData.origin }]
                : [],
            )
            .addFields({
              name: "Sources",
              value: wordData.sourceUrls.join("\n"),
            })
            .setFooter({ text: "Made with dictionaryapi.dev 🤍" })
        })
        .setComponents(
          phonetic
            ? [
                (actionrow) => {
                  return actionrow.addComponents(
                    new ButtonBuilder()
                      .setStyle(ButtonStyle.Secondary)
                      .setEmoji("🔊")
                      .setLabel("Pronounce")
                      .setCustomId(
                        `dictionary.pronounce.${encodeURIComponent(wordData.word)}`,
                      ),
                  )
                },
              ]
            : [],
        ),
    )
  })
