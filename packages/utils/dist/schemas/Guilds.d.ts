import mongoose from 'mongoose';

declare const GuildSchema: mongoose.Model<Guild, {}, {}, {}, mongoose.Document<unknown, {}, Guild> & Guild & {
    _id: mongoose.Types.ObjectId;
}, any>;
type Guild = {
    id: string;
    admins: string[];
    commands: Record<string, GuildCommand>;
    modules: {
        AuditLog: GuildModuleAuditLogs;
        AutoPartner: GuildModuleAutoPartners;
        AutoRole: GuildModuleAutoRoles;
        JoinToCreate: GuildModuleJoinToCreates;
        Levels: GuildModuleLevels;
        ReactionRoles: GuildModuleReactionRoles;
        Tickets: GuildModuleTickets;
    };
    news_channel: string | null;
};
type GuildCommand = {
    name: string;
    permissions: string | null;
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
    active: string[];
    channel: string;
    category: string;
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
type GuildModuleTickets = {
    enabled: boolean;
    channel: string;
    tickets: {
        id: string;
        name: string;
        message: string;
        max_open: number;
    }[];
};
type GuildModule = GuildModuleAuditLogs | GuildModuleAutoPartners | GuildModuleAutoRoles | GuildModuleJoinToCreates | GuildModuleLevels | GuildModuleReactionRoles | GuildModuleTickets;

export { Guild, GuildCommand, GuildModule, GuildModuleAuditLogs, GuildModuleAutoPartners, GuildModuleAutoRoles, GuildModuleJoinToCreates, GuildModuleLevels, GuildModuleReactionRoles, GuildModuleTickets, GuildSchema };
