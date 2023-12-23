import mongoose from "mongoose"


// Schema structure

const schema = new mongoose.Schema<Guild>({
  id: String, // Guild ID
  admins: Array, // Dashboard admin IDs
  commands: Object, // Commands config
  modules: Object, // Modules config
  news_channel: String, // Bot news channel
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
    AuditLog: GuildModuleAuditLogs,
    AutoPartner: GuildModuleAutoPartners,
    AutoRole: GuildModuleAutoRoles,
    JoinToCreate: GuildModuleJoinToCreates,
    Levels: GuildModuleLevels,
    ReactionRoles: GuildModuleReactionRoles,
    Tickets: GuildModuleTickets,
  },
  news_channel: string | null,
}

export type GuildCommand = {
  name: string,
  permissions: string | null,
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
  active: string[],
  channel: string,
  category: string,
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

export type GuildModuleTickets = {
  enabled: boolean,
  channel: string,
  tickets: {
    id: string,
    name: string,
    message: string,
    max_open: number,
  }[],
}

export type GuildModule = | GuildModuleAuditLogs | GuildModuleAutoPartners | GuildModuleAutoRoles | GuildModuleJoinToCreates | GuildModuleLevels | GuildModuleReactionRoles | GuildModuleTickets
