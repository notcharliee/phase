import * as Discord from 'discord.js'
import * as Utils from '#src/utils/index.js'
import * as Schemas from '@repo/schemas'


export default Utils.clientSlashCommand({
  data: new Discord.SlashCommandBuilder()
    .setName('tag')
    .setDescription('tag')
    .addSubcommand(
      new Discord.SlashCommandSubcommandBuilder()
        .setName('add')
        .setDescription('Adds a tag.')
        .addStringOption(
          new Discord.SlashCommandStringOption()
            .setName('name')
            .setDescription('The name of the tag.')
            .setRequired(true)
        )
        .addStringOption(
          new Discord.SlashCommandStringOption()
            .setName('value')
            .setDescription('The value of the tag.')
            .setRequired(true)
        )
    )
    .addSubcommand(
      new Discord.SlashCommandSubcommandBuilder()
        .setName('edit')
        .setDescription('Edits an existing tag.')
        .addStringOption(
          new Discord.SlashCommandStringOption()
            .setName('name')
            .setDescription('The name of the tag.')
            .setRequired(true)
        )
        .addStringOption(
          new Discord.SlashCommandStringOption()
            .setName('value')
            .setDescription('The new value of the tag.')
            .setRequired(true)
        )
    )
    .addSubcommand(
      new Discord.SlashCommandSubcommandBuilder()
        .setName('get')
        .setDescription('Gets a tag by name.')
        .addStringOption(
          new Discord.SlashCommandStringOption()
            .setName('name')
            .setDescription('The name of the tag.')
            .setRequired(true)
        )
    )
    .addSubcommand(
      new Discord.SlashCommandSubcommandBuilder()
        .setName('list')
        .setDescription('Lists all the tags in the server.')
    )
    .addSubcommand(
      new Discord.SlashCommandSubcommandBuilder()
        .setName('remove')
        .setDescription('Removes a tag.')
        .addStringOption(
          new Discord.SlashCommandStringOption()
            .setName('name')
            .setDescription('The name of the tag.')
            .setRequired(true)
        )
    ),
  permissions: {
    baseCommand: null,
    subCommands: {
      add: Discord.PermissionFlagsBits.ManageMessages,
      edit: Discord.PermissionFlagsBits.ManageMessages,
      remove: Discord.PermissionFlagsBits.ManageMessages,
    },
  },
  async execute(client, interaction) {

    const tagSchema = await Schemas.TagSchema.findOne({ guild: interaction.guildId }) ?? await new Schemas.TagSchema({
      guild: interaction.guildId,
      tags: []
    }).save()

    switch (interaction.options.getSubcommand()) {

      case 'add': {

        const tagName = interaction.options.getString('name', true)
        const tagValue = interaction.options.getString('value', true)
        const tagIndex = tagSchema.tags.findIndex(tag => tag.name == tagName)

        if (tagIndex != -1) return Utils.clientError(
          interaction,
          'No can do!',
          'A tag already exists with that name.'
        )

        tagSchema.tags.push({
          name: tagName,
          value: tagValue,
        })

        tagSchema.save()

        interaction.reply({
          embeds: [
            new Discord.EmbedBuilder()
              .setColor(Utils.PhaseColour.Primary)
              .setDescription(`Added tag \`${tagName}\` to the server.`)
              .setTitle('Tag Added')
          ],
        })

      } break



      case 'edit': {

        const tagName = interaction.options.getString('name', true)
        const tagValue = interaction.options.getString('value', true)
        const tagIndex = tagSchema.tags.findIndex(tag => tag.name == tagName)

        if (tagIndex == -1) return Utils.clientError(
          interaction,
          'No can do!',
          'No tag exists with that name.'
        )

        const tagBeforeValue = tagSchema.tags[tagIndex].value

        tagSchema.tags.splice(tagIndex, 1)

        tagSchema.tags.push({
          name: tagName,
          value: tagValue,
        })

        tagSchema.save()

        interaction.reply({
          embeds: [
            new Discord.EmbedBuilder()
              .setColor(Utils.PhaseColour.Primary)
              .setDescription(`Edited tag \`${tagName}\`.`)
              .setFields([
                { name: 'Before Value', value: tagBeforeValue },
                { name: 'After Value', value: tagValue },
              ])
              .setTitle('Tag Edited')
          ],
        })

      } break



      case 'get': {

        const tag = tagSchema.tags.find(tag => tag.name == interaction.options.getString('name', true))

        if (!tag) return Utils.clientError(
          interaction,
          'No can do!',
          'No tag exists with that name.'
        )

        interaction.reply(tag.value)

      } break



      case 'list': {

        const embedDescription = tagSchema.tags.map(tag => `${tag.name}`).toString().replaceAll(',', ', ')

        interaction.reply({
          embeds: [
            new Discord.EmbedBuilder()
              .setColor(Utils.PhaseColour.Primary)
              .setDescription(embedDescription.length ? embedDescription : 'No tags found.')
              .setTitle(`Tag List (${tagSchema.tags.length})`)
          ],
        })

      } break



      case 'remove': {

        const tagName = interaction.options.getString('name', true)
        const tagIndex = tagSchema.tags.findIndex(tag => tag.name == tagName)

        if (tagIndex == -1) return Utils.clientError(
          interaction,
          'No can do!',
          'Could not find a tag by that name.'
        )

        tagSchema.tags.splice(tagIndex, 1)

        tagSchema.save()

        interaction.reply({
          embeds: [
            new Discord.EmbedBuilder()
              .setColor(Utils.PhaseColour.Primary)
              .setDescription(`Removed tag \`${tagName}\` from the server.`)
              .setTitle('Tag Removed')
          ],
        })

      } break

    }

  }
})