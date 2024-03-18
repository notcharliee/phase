import { EmbedBuilder } from "discord.js"
import { botCommand, BotCommandBuilder } from "phasebot"
import { EmojiRegex, PhaseColour } from "~/utils"

export default botCommand(
  new BotCommandBuilder()
    .setName("poll")
    .setDescription("Creates a poll reaction message.")
    .addStringOption((option) =>
      option
        .setName("question")
        .setDescription("Type your question here.")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("choice_a")
        .setDescription("Start with an emoji to edit the reaction.")
        .setMaxLength(150)
        .setRequired(false),
    )
    .addStringOption((option) =>
      option
        .setName("choice_b")
        .setDescription("Start with an emoji to edit the reaction.")
        .setMaxLength(150)
        .setRequired(false),
    )
    .addStringOption((option) =>
      option
        .setName("choice_c")
        .setDescription("Start with an emoji to edit the reaction.")
        .setMaxLength(150)
        .setRequired(false),
    )
    .addStringOption((option) =>
      option
        .setName("choice_d")
        .setDescription("Start with an emoji to edit the reaction.")
        .setMaxLength(150)
        .setRequired(false),
    )
    .addStringOption((option) =>
      option
        .setName("choice_e")
        .setDescription("Start with an emoji to edit the reaction.")
        .setMaxLength(150)
        .setRequired(false),
    )
    .addStringOption((option) =>
      option
        .setName("choice_f")
        .setDescription("Start with an emoji to edit the reaction.")
        .setMaxLength(150)
        .setRequired(false),
    )
    .addStringOption((option) =>
      option
        .setName("choice_g")
        .setDescription("Start with an emoji to edit the reaction.")
        .setMaxLength(150)
        .setRequired(false),
    )
    .addStringOption((option) =>
      option
        .setName("choice_h")
        .setDescription("Start with an emoji to edit the reaction.")
        .setMaxLength(150)
        .setRequired(false),
    )
    .addStringOption((option) =>
      option
        .setName("choice_i")
        .setDescription("Start with an emoji to edit the reaction.")
        .setMaxLength(150)
        .setRequired(false),
    )
    .addStringOption((option) =>
      option
        .setName("choice_j")
        .setDescription("Start with an emoji to edit the reaction.")
        .setMaxLength(150)
        .setRequired(false),
    )
    .addStringOption((option) =>
      option
        .setName("choice_k")
        .setDescription("Start with an emoji to edit the reaction.")
        .setMaxLength(150)
        .setRequired(false),
    )
    .addStringOption((option) =>
      option
        .setName("choice_l")
        .setDescription("Start with an emoji to edit the reaction.")
        .setMaxLength(150)
        .setRequired(false),
    )
    .addStringOption((option) =>
      option
        .setName("choice_m")
        .setDescription("Start with an emoji to edit the reaction.")
        .setMaxLength(150)
        .setRequired(false),
    )
    .addStringOption((option) =>
      option
        .setName("choice_n")
        .setDescription("Start with an emoji to edit the reaction.")
        .setMaxLength(150)
        .setRequired(false),
    )
    .addStringOption((option) =>
      option
        .setName("choice_o")
        .setDescription("Start with an emoji to edit the reaction.")
        .setMaxLength(150)
        .setRequired(false),
    )
    .addStringOption((option) =>
      option
        .setName("choice_p")
        .setDescription("Start with an emoji to edit the reaction.")
        .setMaxLength(150)
        .setRequired(false),
    )
    .addStringOption((option) =>
      option
        .setName("choice_q")
        .setDescription("Start with an emoji to edit the reaction.")
        .setMaxLength(150)
        .setRequired(false),
    )
    .addStringOption((option) =>
      option
        .setName("choice_r")
        .setDescription("Start with an emoji to edit the reaction.")
        .setMaxLength(150)
        .setRequired(false),
    )
    .addStringOption((option) =>
      option
        .setName("choice_s")
        .setDescription("Start with an emoji to edit the reaction.")
        .setMaxLength(150)
        .setRequired(false),
    )
    .addStringOption((option) =>
      option
        .setName("choice_t")
        .setDescription("Start with an emoji to edit the reaction.")
        .setMaxLength(150)
        .setRequired(false),
    ),
  async (client, interaction) => {
    const question = interaction.options.getString("question")

    const choiceArray = []
    const choiceLetters = [
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
    ]
    const choiceEmojis = [
      "🇦",
      "🇧",
      "🇨",
      "🇩",
      "🇪",
      "🇫",
      "🇬",
      "🇭",
      "🇮",
      "🇯",
      "🇰",
      "🇱",
      "🇲",
      "🇳",
      "🇴",
      "🇵",
      "🇶",
      "🇷",
      "🇸",
      "🇹",
    ]

    for (let i = 0; i < choiceLetters.length; i++) {
      const choice = interaction.options.getString(`choice_${choiceLetters[i]}`)

      if (choice) {
        const match = choice.match(EmojiRegex)

        choiceArray.push({
          emoji: match ? match[0] : choiceEmojis[i],
          value: match ? choice.replace(match[0], "") : choice,
        })
      }
    }

    if (choiceArray.length) {
      const message = await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(PhaseColour.Primary)
            .setDescription(
              choiceArray
                .map((choice) => {
                  return `${choice.emoji} ${choice.value}\n\n`
                })
                .toString()
                .replaceAll(",", ""),
            )
            .setTitle(question),
        ],
        fetchReply: true,
      })

      for (const choice of choiceArray) message.react(choice.emoji)
    } else {
      const message = await interaction.reply({
        embeds: [
          new EmbedBuilder().setColor(PhaseColour.Primary).setTitle(question),
        ],
        fetchReply: true,
      })

      message.react("👍")
      message.react("👎")
    }
  },
)
