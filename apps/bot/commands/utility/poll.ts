import * as Discord from 'discord.js'
import * as Utils from 'phaseutils'


export default Utils.Functions.clientSlashCommand({
  data: new Discord.SlashCommandBuilder()
    .setName('poll')
    .setDescription('Creates a poll reaction message.')
    .addStringOption(
      new Discord.SlashCommandStringOption()
        .setName('question')
        .setDescription('Type your question here.')
        .setRequired(true)
    )
    .addStringOption(
      new Discord.SlashCommandStringOption()
        .setName('choice_a')
        .setDescription('Add a choice to the poll (start with an emoji to edit the reaction).')
        .setMaxLength(150)
        .setRequired(false)
    )
    .addStringOption(
      new Discord.SlashCommandStringOption()
        .setName('choice_b')
        .setDescription('Add a choice to the poll (start with an emoji to edit the reaction).')
        .setMaxLength(150)
        .setRequired(false)
    )
    .addStringOption(
      new Discord.SlashCommandStringOption()
        .setName('choice_c')
        .setDescription('Add a choice to the poll (start with an emoji to edit the reaction).')
        .setMaxLength(150)
        .setRequired(false)
    )
    .addStringOption(
      new Discord.SlashCommandStringOption()
        .setName('choice_d')
        .setDescription('Add a choice to the poll (start with an emoji to edit the reaction).')
        .setMaxLength(150)
        .setRequired(false)
    )
    .addStringOption(
      new Discord.SlashCommandStringOption()
        .setName('choice_e')
        .setDescription('Add a choice to the poll (start with an emoji to edit the reaction).')
        .setMaxLength(150)
        .setRequired(false)
    )
    .addStringOption(
      new Discord.SlashCommandStringOption()
        .setName('choice_f')
        .setDescription('Add a choice to the poll (start with an emoji to edit the reaction).')
        .setMaxLength(150)
        .setRequired(false)
    )
    .addStringOption(
      new Discord.SlashCommandStringOption()
        .setName('choice_g')
        .setDescription('Add a choice to the poll (start with an emoji to edit the reaction).')
        .setMaxLength(150)
        .setRequired(false)
    )
    .addStringOption(
      new Discord.SlashCommandStringOption()
        .setName('choice_h')
        .setDescription('Add a choice to the poll (start with an emoji to edit the reaction).')
        .setMaxLength(150)
        .setRequired(false)
    )
    .addStringOption(
      new Discord.SlashCommandStringOption()
        .setName('choice_i')
        .setDescription('Add a choice to the poll (start with an emoji to edit the reaction).')
        .setMaxLength(150)
        .setRequired(false)
    )
    .addStringOption(
      new Discord.SlashCommandStringOption()
        .setName('choice_j')
        .setDescription('Add a choice to the poll (start with an emoji to edit the reaction).')
        .setMaxLength(150)
        .setRequired(false)
    )
    .addStringOption(
      new Discord.SlashCommandStringOption()
        .setName('choice_k')
        .setDescription('Add a choice to the poll (start with an emoji to edit the reaction).')
        .setMaxLength(150)
        .setRequired(false)
    )
    .addStringOption(
      new Discord.SlashCommandStringOption()
        .setName('choice_l')
        .setDescription('Add a choice to the poll (start with an emoji to edit the reaction).')
        .setMaxLength(150)
        .setRequired(false)
    )
    .addStringOption(
      new Discord.SlashCommandStringOption()
        .setName('choice_m')
        .setDescription('Add a choice to the poll (start with an emoji to edit the reaction).')
        .setMaxLength(150)
        .setRequired(false)
    )
    .addStringOption(
      new Discord.SlashCommandStringOption()
        .setName('choice_n')
        .setDescription('Add a choice to the poll (start with an emoji to edit the reaction).')
        .setMaxLength(150)
        .setRequired(false)
    )
    .addStringOption(
      new Discord.SlashCommandStringOption()
        .setName('choice_o')
        .setDescription('Add a choice to the poll (start with an emoji to edit the reaction).')
        .setMaxLength(150)
        .setRequired(false)
    )
    .addStringOption(
      new Discord.SlashCommandStringOption()
        .setName('choice_p')
        .setDescription('Add a choice to the poll (start with an emoji to edit the reaction).')
        .setMaxLength(150)
        .setRequired(false)
    )
    .addStringOption(
      new Discord.SlashCommandStringOption()
        .setName('choice_q')
        .setDescription('Add a choice to the poll (start with an emoji to edit the reaction).')
        .setMaxLength(150)
        .setRequired(false)
    )
    .addStringOption(
      new Discord.SlashCommandStringOption()
        .setName('choice_r')
        .setDescription('Add a choice to the poll (start with an emoji to edit the reaction).')
        .setMaxLength(150)
        .setRequired(false)
    )
    .addStringOption(
      new Discord.SlashCommandStringOption()
        .setName('choice_s')
        .setDescription('Add a choice to the poll (start with an emoji to edit the reaction).')
        .setMaxLength(150)
        .setRequired(false)
    )
    .addStringOption(
      new Discord.SlashCommandStringOption()
        .setName('choice_t')
        .setDescription('Add a choice to the poll (start with an emoji to edit the reaction).')
        .setMaxLength(150)
        .setRequired(false)
    ),
  async execute(client, interaction) {

    const question = interaction.options.getString('question')

    const choiceArray = []
    const choiceconstters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't']
    const choiceEmojis = ['🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭', '🇮', '🇯', '🇰', '🇱', '🇲', '🇳', '🇴', '🇵', '🇶', '🇷', '🇸', '🇹']


    for (let i = 0; i < choiceconstters.length; i++) {

      const choice = interaction.options.getString(`choice_${choiceconstters[i]}`)

      if (choice) {

        const match = choice.match(Utils.Constants.emojiRegex)

        choiceArray.push({
          emoji: match ? match[0] : choiceEmojis[i],
          value: match ? choice.replace(match[0], '') : choice,
        })

      }

    }

    if (choiceArray.length) {

      const message = await interaction.reply({
        embeds: [
          new Discord.EmbedBuilder()
            .setColor(Utils.Enums.PhaseColour.Primary)
            .setDescription(choiceArray.map(choice => { return `${choice.emoji} ${choice.value}\n\n` }).toString().replaceAll(',', ''))
            .setTitle(question)
        ],
        fetchReply: true,
      })

      for (const choice of choiceArray) message.react(choice.emoji)

    } else {

      const message = await interaction.reply({
        embeds: [
          new Discord.EmbedBuilder()
            .setColor(Utils.Enums.PhaseColour.Primary)
            .setTitle(question)
        ],
        fetchReply: true,
      })

      message.react('👍')
      message.react('👎')

    }

  }
})