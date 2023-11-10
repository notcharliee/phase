/**
 * 
 *  THIS IS A TEMPORARY FILE
 * 
 *  This file will be removed with a future update.
 *  Do not build upon file in any commits as it will be deleted later on.
 * 
 */

import * as Discord from 'discord.js'
import * as Utils from 'utils/bot'
import * as Schemas from 'utils/schemas'

import discordlogs from 'discord-logs'


export default async (client: Discord.Client<true>) => {

    await discordlogs(client)

    async function sendlog (guildId: string, embed: Discord.EmbedBuilder) {

        const auditLogsSchema = await Schemas.AuditLogs.findOne({ guild: guildId })
        if (!auditLogsSchema) return

        const channel = client.channels.cache.get(auditLogsSchema.channel)
        if (!channel || !channel.isTextBased()) return
        
        embed.setTimestamp()

        channel.send({
          embeds: [embed],
        }).catch(() => { return })
    }

    // Channel Topic Updating 
    client.on('guildChannelTopicUpdate', (channel: Discord.GuildChannel, oldTopic: string, newTopic: string) => {

        if(!oldTopic && !newTopic) return

        const embed = new Discord.EmbedBuilder()
        .setTitle('Topic Updated')
        .setColor('Blurple')
        .setDescription(`\`#${channel.name}\`'s topic has been updated.`)
        .setFields([
            { name: 'Before', value: oldTopic || 'None' },
            { name: 'After', value: newTopic || 'None' }
        ])

        return sendlog(channel.guild.id, embed)

    })

    // Channel Permission Updating
    client.on('guildChannelPermissionsUpdate', (channel: Discord.GuildChannel) => {

        const embed = new Discord.EmbedBuilder()
        .setTitle('Channel Updated')
        .setColor('Blurple')
        .setDescription(`\`#${channel.name}\`'s settings have been updated.`)

        return sendlog(channel.guild.id, embed)
    
    })

    // Member Started Boosting
    client.on('guildMemberBoost', (member: Discord.GuildMember) => {

        const embed = new Discord.EmbedBuilder()
        .setTitle('Member Started Boosting')
        .setColor('#EE82EE')
        .setDescription(`\`@${member.user.username}\` has started boosting this server.`)

        return sendlog(member.guild.id, embed)

    })

    // Member Unboosted
    client.on('guildMemberUnboost', (member: Discord.GuildMember) => {

        const embed = new Discord.EmbedBuilder()
        .setTitle('Member Stopped Boosting')
        .setColor('#EE82EE')
        .setDescription(`\`@${member.user.username}\` has stopped boosting this server.`)

        return sendlog(member.guild.id, embed)

    })

    // Member Got Discord.Role
    client.on('guildMemberDiscord.RoleAdd', (member: Discord.GuildMember, role: Discord.Role) => {

        const embed = new Discord.EmbedBuilder()
        .setTitle('Discord.Roles Updated')
        .setColor('Blurple')
        .setDescription(`\`@${member.user.username}\` got the role \`${role.name}\`.`)

        return sendlog(member.guild.id, embed)

    })

    // Member Lost Discord.Role
    client.on('guildMemberDiscord.RoleRemove', (member: Discord.GuildMember, role: Discord.Role) => {

        const embed = new Discord.EmbedBuilder()
        .setTitle('Discord.Roles Updated')
        .setColor('Blurple')
        .setDescription(`\`@${member.user.username}\` lost the role \`${role.name}\`.`)

        return sendlog(member.guild.id, embed)

    })

    // Nickname Changed
    client.on('guildMemberNicknameUpdate', (member: Discord.GuildMember, oldNickname: string, newNickname: string) => {

        const embed = new Discord.EmbedBuilder()
        .setTitle('Nickname Updated')
        .setColor('Blurple')
        .setDescription(`\`@${member.user.username}\` updated their nickname.`)
        .setFields([
            { name: 'Before', value: oldNickname || 'None' },
            { name: 'After', value: newNickname || 'None' }
        ])

        return sendlog(member.guild.id, embed)

    })

    // Server Boost Level Up
    client.on('guildBoostLevelUp', (guild: Discord.Guild, oldLevel: number, newLevel: number) => {

        const embed = new Discord.EmbedBuilder()
        .setTitle('Server Level Up')
        .setColor('Purple')
        .setDescription(`This server reached the boost level \`${newLevel}\`.`)

        return sendlog(guild.id, embed)

    })

    // Server Boost Level Down
    client.on('guildBoostLevelDown', (guild: Discord.Guild, oldLevel: number, newLevel: number) => {

        const embed = new Discord.EmbedBuilder()
        .setTitle('Server Level Down')
        .setColor('Purple')
        .setDescription(`This server levelled down from \`${oldLevel}\` to \`${newLevel}\`.`)

        return sendlog(guild.id, embed)

    })

    // Banner Added
    client.on('guildBannerAdd', (guild: Discord.Guild, bannerURL: string) => {

        const embed = new Discord.EmbedBuilder()
        .setTitle('Server Banner Added')
        .setColor('Green')
        .setImage(bannerURL)

        return sendlog(guild.id, embed)

    })

    // AFK Channel Added
    client.on('guildAfkChannelAdd', (guild: Discord.Guild, afkChannel: Discord.GuildChannel) => {

        const embed = new Discord.EmbedBuilder()
        .setTitle('AFK Channel Added')
        .setColor('Green')
        .setDescription(`\`#${afkChannel}\` has been set as this server's AFK channel.`)

        return sendlog(guild.id, embed)

    })

    // Discord.Guild Vanity Add
    client.on('guildVanityURLAdd', (guild: Discord.Guild, vanityURL: string) => {

        const embed = new Discord.EmbedBuilder()
        .setTitle('Vanity URL Added')
        .setColor('Green')
        .setDescription(`This server has a new Vanity URL.`)
        .setFields([
            { name: 'New URL', value: vanityURL }
        ])

        return sendlog(guild.id, embed)

    })

    // Discord.Guild Vanity Remove
    client.on('guildVanityURLRemove', (guild: Discord.Guild, vanityURL: string) => {

        const embed = new Discord.EmbedBuilder()
        .setTitle('Vanity URL Removed')
        .setColor('Red')
        .setDescription(`This server has removed its Vanity URL.`)
        .setFields([
            { name: 'Old URL', value: vanityURL }
        ])

        return sendlog(guild.id, embed)

    })

    // Discord.Guild Vanity Link Updated
    client.on('guildVanityURLUpdate', (guild: Discord.Guild, oldVanityURL: string, newVanityURL: string) => {

        const embed = new Discord.EmbedBuilder()
        .setTitle('Vanity URL Updated')
        .setColor('Blurple')
        .setDescription(`This server has updated its Vanity URL.`)
        .setFields([
            { name: 'Old URL', value: oldVanityURL },
            { name: 'New URL', value: newVanityURL }
        ])

        return sendlog(guild.id, embed)

    })

    // Message Pinned
    client.on('messagePinned', (message: Discord.Message<true>) => {

        const embed = new Discord.EmbedBuilder()
        .setTitle('Message Pinned')
        .setColor('Green')
        .setDescription(`[Message](${message.url}) has been pinned by \`@${message.author.username}\`.`)

        return sendlog(message.guild.id, embed)

    })

    // Message Edited
    client.on('messageContentEdited', (message: Discord.Message<true>) => {

        const embed = new Discord.EmbedBuilder()
        .setTitle('Message Updated')
        .setColor('Blurple')
        .setDescription(`[Message](${message.url}) has been updated by \`@${message.author.username}\`.`)

        return sendlog(message.guild.id, embed)

    })

    // Discord.Role Permission Updated
    client.on('rolePermissionsUpdate', (role: Discord.Role) => {

        const embed = new Discord.EmbedBuilder()
        .setTitle('Discord.Role Permissions Updated')
        .setColor('Blurple')
        .setDescription(`\`@${role.name}\`'s permissions have been updated.`)

        return sendlog(role.guild.id, embed)

    })

    // Discord.Role Created
    client.on('roleCreate', (role: Discord.Role) => {

        const embed = new Discord.EmbedBuilder()
        .setTitle('Discord.Role Added')
        .setColor('Green')
        .setDescription(`\`@${role.name}\` has been created.`)

        return sendlog(role.guild.id, embed)

    })

    // Discord.Role Deleted
    client.on('roleDelete', (role: Discord.Role) => {

        const embed = new Discord.EmbedBuilder()
        .setTitle('Discord.Role Deleted')
        .setColor('Red')
        .setDescription(`\`@${role.name}\` has been deleted.`)

        return sendlog(role.guild.id, embed)

    })

    // Channel Created
    client.on('channelCreate', (channel: Discord.GuildChannel) => {

        const embed = new Discord.EmbedBuilder()
        .setTitle('Channel Created')
        .setColor('Green')
        .setDescription(`\`#${channel.name}\` has been created.`)

        return sendlog(channel.guild.id, embed)

    })

    // Channel Deleted
    client.on('channelDelete', (channel: Discord.Channel) => {

        if (channel.type == Discord.ChannelType.DM || channel.type == Discord.ChannelType.GroupDM) return

        const embed = new Discord.EmbedBuilder()
        .setTitle('Channel Deleted')
        .setColor('Red')
        .setDescription(`\`#${channel.name}\` has been deleted.`)

        return sendlog(channel.guild.id, embed)

    })

}