import mongoose from "mongoose"


// Schema structure

const schema = new mongoose.Schema<Guild>({
  id: String, // Guild ID
  admins: Array, // Dashboard admin IDs
  commands: Object, // Commands config
  modules: Object, // Modules config
  news_channel: String, // Bot news channel
  owner: String, // Guild owner ID
})

export const GuildSchema = (
  mongoose.models['Guilds'] as mongoose.Model<Guild> ||
  mongoose.model<Guild>('Guilds', schema)
)


// Schema types

export type Guild = {
  id: string,
  admins: string[],
  commands: Record<string, GuildCommand>,
  modules: {
    AFKs: GuildModuleAFKs,
    AuditLogs: GuildModuleAuditLogs,
    AutoPartners: GuildModuleAutoPartners,
    AutoRoles: GuildModuleAutoRoles,
    JoinToCreates: GuildModuleJoinToCreates,
    Levels: GuildModuleLevels,
    ReactionRoles: GuildModuleReactionRoles,
    Tags: GuildModuleTags,
  },
  news_channel: string | null,
  owner: string,
}

export type GuildCommand = {
  name: string,
  permissions: string | null,
}

export type GuildModuleAFKs = {
  enabled: boolean,
  user: string,
  reason: string,
}

export type GuildModuleAuditLogs = {
  enabled: boolean,
  channels: {
    server: string | null, // channels, roles, boosts, emojis, server settings
    messages: string | null, // deletes, edits, mentions
    voice: string | null, // joins, leaves, mutes, deafens
    invites: string | null, // creates, expires, usage
    members: string | null, // joins, leaves, role changes, nickname changes
    punishments: string | null, // warns, unwarns, bans, tempbans, timeouts
  },
}

export type GuildModuleAutoPartners = {
  enabled: boolean,
  channel: string,
  partners: {
    guild: string,
    channel: string,
    message: string,
  }[],
  invites: {
    code: string,
    expires: string,
  }[],
}

export type GuildModuleAutoRoles = {
  enabled: boolean,
  roles: string[],
  pending: boolean,
}

export type GuildModuleJoinToCreates = {
  enabled: boolean,
  channel: string,
  category: string,
  created: string[],
}

export type GuildModuleLevels = {
  enabled: boolean,
  channel: string, // "dm" == dm user; "reply" == reply to msg; id == send to id
  message: string,
  mention: boolean,
  roles: {
    level: number,
    role: string,
  }[],
}

export type GuildModuleReactionRoles = {
  enabled: boolean,
  channel: string,
  message: string,
  reactions: {
    emoji: string,
    role: string,
  }[],
}

export type GuildModuleTags = {
  enabled: boolean,
  tags: {
    name: string,
    value: string,
  }[],
}

export type GuildModuleTickets = {
  enabled: boolean,
  channel: string,
  tickets: {
    id: string,
    name: string,
    message: string,
    admins: string[],
    count: number,
  }[],
}

export type GuildModule = GuildModuleAFKs | GuildModuleAuditLogs | GuildModuleAutoPartners | GuildModuleAutoRoles | GuildModuleJoinToCreates | GuildModuleLevels | GuildModuleReactionRoles | GuildModuleTags | GuildModuleTickets
