import {
  Channel,
  ChannelType,
  EmbedBuilder,
  Guild,
  GuildChannel,
  GuildMember,
  Message,
  Role,
} from "discord.js"
import { botEvent } from "phasebot"

import { ModuleId } from "@repo/config/phase/modules.ts"
import discordlogs from "discord-logs"

import { cache } from "~/lib/cache"

export default botEvent("ready", async (client) => {
  await discordlogs(client)

  async function sendlog(guildId: string, embed: EmbedBuilder) {
    embed.setTimestamp()

    const guildDoc = await cache.guilds.get(guildId)
    if (!guildDoc) return

    if (
      !guildDoc.modules?.[ModuleId.AuditLogs]?.enabled ||
      !guildDoc.modules[ModuleId.AuditLogs].channels.server ||
      !client.channels.cache.has(
        guildDoc.modules[ModuleId.AuditLogs].channels.server,
      )
    )
      return

    const channel = client.channels.cache.get(
      guildDoc.modules[ModuleId.AuditLogs].channels.server,
    )!
    if (!channel.isTextBased()) return

    void channel.send({ embeds: [embed] }).catch(() => null)
  }

  // Channel Topic Updating
  client.on(
    "guildChannelTopicUpdate",
    (channel: GuildChannel, oldTopic: string, newTopic: string) => {
      if (!oldTopic && !newTopic) return

      const embed = new EmbedBuilder()
        .setTitle("Topic Updated")
        .setColor("Blurple")
        .setDescription(`\`#${channel.name}\`'s topic has been updated.`)
        .setFields([
          { name: "Before", value: oldTopic || "None" },
          { name: "After", value: newTopic || "None" },
        ])

      return sendlog(channel.guild.id, embed)
    },
  )

  // Channel Permission Updating
  client.on("guildChannelPermissionsUpdate", (channel: GuildChannel) => {
    const embed = new EmbedBuilder()
      .setTitle("Channel Updated")
      .setColor("Blurple")
      .setDescription(`\`#${channel.name}\`'s settings have been updated.`)

    return sendlog(channel.guild.id, embed)
  })

  // Member Started Boosting
  client.on("guildMemberBoost", (member: GuildMember) => {
    const embed = new EmbedBuilder()
      .setTitle("Member Started Boosting")
      .setColor("#EE82EE")
      .setDescription(
        `\`@${member.user.username}\` has started boosting this server.`,
      )

    return sendlog(member.guild.id, embed)
  })

  // Member Unboosted
  client.on("guildMemberUnboost", (member: GuildMember) => {
    const embed = new EmbedBuilder()
      .setTitle("Member Stopped Boosting")
      .setColor("#EE82EE")
      .setDescription(
        `\`@${member.user.username}\` has stopped boosting this server.`,
      )

    return sendlog(member.guild.id, embed)
  })

  // Member Got Role
  client.on("guildMemberRoleAdd", (member: GuildMember, role: Role) => {
    const embed = new EmbedBuilder()
      .setTitle("Roles Updated")
      .setColor("Blurple")
      .setDescription(
        `\`@${member.user.username}\` got the role \`${role.name}\`.`,
      )

    return sendlog(member.guild.id, embed)
  })

  // Member Lost Role
  client.on("guildMemberRoleRemove", (member: GuildMember, role: Role) => {
    const embed = new EmbedBuilder()
      .setTitle("Roles Updated")
      .setColor("Blurple")
      .setDescription(
        `\`@${member.user.username}\` lost the role \`${role.name}\`.`,
      )

    return sendlog(member.guild.id, embed)
  })

  // Nickname Changed
  client.on(
    "guildMemberNicknameUpdate",
    (member: GuildMember, oldNickname: string, newNickname: string) => {
      const embed = new EmbedBuilder()
        .setTitle("Nickname Updated")
        .setColor("Blurple")
        .setDescription(`\`@${member.user.username}\` updated their nickname.`)
        .setFields([
          { name: "Before", value: oldNickname || "None" },
          { name: "After", value: newNickname || "None" },
        ])

      return sendlog(member.guild.id, embed)
    },
  )

  // Server Boost Level Up
  client.on("guildBoostLevelUp", (guild: Guild, _, newLevel: number) => {
    const embed = new EmbedBuilder()
      .setTitle("Server Level Up")
      .setColor("Purple")
      .setDescription(`This server reached the boost level \`${newLevel}\`.`)

    return sendlog(guild.id, embed)
  })

  // Server Boost Level Down
  client.on(
    "guildBoostLevelDown",
    (guild: Guild, oldLevel: number, newLevel: number) => {
      const embed = new EmbedBuilder()
        .setTitle("Server Level Down")
        .setColor("Purple")
        .setDescription(
          `This server levelled down from \`${oldLevel}\` to \`${newLevel}\`.`,
        )

      return sendlog(guild.id, embed)
    },
  )

  // Banner Added
  client.on("guildBannerAdd", (guild: Guild, bannerURL: string) => {
    const embed = new EmbedBuilder()
      .setTitle("Server Banner Added")
      .setColor("Green")
      .setImage(bannerURL)

    return sendlog(guild.id, embed)
  })

  // AFK Channel Added
  client.on("guildAfkChannelAdd", (guild: Guild, afkChannel: GuildChannel) => {
    const embed = new EmbedBuilder()
      .setTitle("AFK Channel Added")
      .setColor("Green")
      .setDescription(
        `\`#${afkChannel}\` has been set as this server's AFK channel.`,
      )

    return sendlog(guild.id, embed)
  })

  // Guild Vanity Add
  client.on("guildVanityURLAdd", (guild: Guild, vanityURL: string) => {
    const embed = new EmbedBuilder()
      .setTitle("Vanity URL Added")
      .setColor("Green")
      .setDescription(`This server has a new Vanity URL.`)
      .setFields([{ name: "New URL", value: vanityURL }])

    return sendlog(guild.id, embed)
  })

  // Guild Vanity Remove
  client.on("guildVanityURLRemove", (guild: Guild, vanityURL: string) => {
    const embed = new EmbedBuilder()
      .setTitle("Vanity URL Removed")
      .setColor("Red")
      .setDescription(`This server has removed its Vanity URL.`)
      .setFields([{ name: "Old URL", value: vanityURL }])

    return sendlog(guild.id, embed)
  })

  // Guild Vanity Link Updated
  client.on(
    "guildVanityURLUpdate",
    (guild: Guild, oldVanityURL: string, newVanityURL: string) => {
      const embed = new EmbedBuilder()
        .setTitle("Vanity URL Updated")
        .setColor("Blurple")
        .setDescription(`This server has updated its Vanity URL.`)
        .setFields([
          { name: "Old URL", value: oldVanityURL },
          { name: "New URL", value: newVanityURL },
        ])

      return sendlog(guild.id, embed)
    },
  )

  // Message Edited
  client.on("messageContentEdited", (message: Message<true>) => {
    const embed = new EmbedBuilder()
      .setTitle("Message Updated")
      .setColor("Blurple")
      .setDescription(
        `[Message](${message.url}) has been updated by \`@${message.author.username}\`.`,
      )

    return sendlog(message.guild.id, embed)
  })

  // Role Permission Updated
  client.on("rolePermissionsUpdate", (role: Role) => {
    const embed = new EmbedBuilder()
      .setTitle("Role Permissions Updated")
      .setColor("Blurple")
      .setDescription(`\`@${role.name}\`'s permissions have been updated.`)

    return sendlog(role.guild.id, embed)
  })

  // Role Created
  client.on("roleCreate", (role: Role) => {
    const embed = new EmbedBuilder()
      .setTitle("Role Added")
      .setColor("Green")
      .setDescription(`\`@${role.name}\` has been created.`)

    return sendlog(role.guild.id, embed)
  })

  // Role Deleted
  client.on("roleDelete", (role: Role) => {
    const embed = new EmbedBuilder()
      .setTitle("Role Deleted")
      .setColor("Red")
      .setDescription(`\`@${role.name}\` has been deleted.`)

    return sendlog(role.guild.id, embed)
  })

  // Channel Created
  client.on("channelCreate", (channel: GuildChannel) => {
    const embed = new EmbedBuilder()
      .setTitle("Channel Created")
      .setColor("Green")
      .setDescription(`\`#${channel.name}\` has been created.`)

    return sendlog(channel.guild.id, embed)
  })

  // Channel Deleted
  client.on("channelDelete", (channel: Channel) => {
    if (channel.type == ChannelType.DM || channel.type == ChannelType.GroupDM)
      return

    const embed = new EmbedBuilder()
      .setTitle("Channel Deleted")
      .setColor("Red")
      .setDescription(`\`#${channel.name}\` has been deleted.`)

    return sendlog(channel.guild.id, embed)
  })
})
