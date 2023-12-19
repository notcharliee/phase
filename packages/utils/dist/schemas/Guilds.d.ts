import mongoose from 'mongoose';

declare const GuildSchema: mongoose.Model<Guild, {}, {}, {}, mongoose.Document<unknown, {}, Guild> & Guild & {
    _id: mongoose.Types.ObjectId;
}, any>;
type Guild = {
    id: string;
    admins: string[];
    commands: Record<string, GuildCommand>;
    modules: {
        AFKs: GuildModuleAFKs;
        AuditLogs: GuildModuleAuditLogs;
        AutoPartners: GuildModuleAutoPartners;
        AutoRoles: GuildModuleAutoRoles;
        JoinToCreates: GuildModuleJoinToCreates;
        Levels: GuildModuleLevels;
        ReactionRoles: GuildModuleReactionRoles;
        Tags: GuildModuleTags;
    };
    news_channel: string | null;
    owner: string;
};
type GuildCommand = {
    name: string;
    permissions: string | null;
};
type GuildModuleAFKs = {
    enabled: boolean;
    user: string;
    reason: string;
};
type GuildModuleAuditLogs = {
    enabled: boolean;
    channels: {
        server: string | null;
        messages: string | null;
        voice: string | null;
        invites: string | null;
        members: string | null;
        punishments: string | null;
    };
};
type GuildModuleAutoPartners = {
    enabled: boolean;
    channel: string;
    partners: {
        guild: string;
        channel: string;
        message: string;
    }[];
    invites: {
        code: string;
        expires: string;
    }[];
};
type GuildModuleAutoRoles = {
    enabled: boolean;
    roles: string[];
    pending: boolean;
};
type GuildModuleJoinToCreates = {
    enabled: boolean;
    channel: string;
    category: string;
    created: string[];
};
type GuildModuleLevels = {
    enabled: boolean;
    channel: string;
    message: string;
    mention: boolean;
    roles: {
        level: number;
        role: string;
    }[];
};
type GuildModuleReactionRoles = {
    enabled: boolean;
    channel: string;
    message: string;
    reactions: {
        emoji: string;
        role: string;
    }[];
};
type GuildModuleTags = {
    enabled: boolean;
    tags: {
        name: string;
        value: string;
    }[];
};
type GuildModuleTickets = {
    enabled: boolean;
    channel: string;
    tickets: {
        id: string;
        name: string;
        message: string;
        admins: string[];
        count: number;
    }[];
};
type GuildModule = GuildModuleAFKs | GuildModuleAuditLogs | GuildModuleAutoPartners | GuildModuleAutoRoles | GuildModuleJoinToCreates | GuildModuleLevels | GuildModuleReactionRoles | GuildModuleTags | GuildModuleTickets;

export { Guild, GuildCommand, GuildModule, GuildModuleAFKs, GuildModuleAuditLogs, GuildModuleAutoPartners, GuildModuleAutoRoles, GuildModuleJoinToCreates, GuildModuleLevels, GuildModuleReactionRoles, GuildModuleTags, GuildModuleTickets, GuildSchema };
