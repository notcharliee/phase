import mongoose from 'mongoose';

declare const AFKSchema: mongoose.Model<AFK, {}, {}, {}, mongoose.Document<unknown, {}, AFK> & AFK & {
    _id: mongoose.Types.ObjectId;
}, any>;
type AFK = {
    user: string;
    reason: string;
};

declare const GameSchema: mongoose.Model<Game, {}, {}, {}, mongoose.Document<unknown, {}, Game> & Game & {
    _id: mongoose.Types.ObjectId;
}, any>;
type Game = {
    id: string;
    type: string;
    game_data: GameData;
    players: string[];
};
type GameDataTictactoe = {
    current_turn: {
        marker: string;
        player: string;
    };
    moves: string[];
};
type GameData = GameDataTictactoe;

declare const GiveawaySchema: mongoose.Model<Giveaway, {}, {}, {}, mongoose.Document<unknown, {}, Giveaway> & Giveaway & {
    _id: mongoose.Types.ObjectId;
}, any>;
type Giveaway = {
    id: string;
    channel: string;
    created: string;
    host: string;
    winners: number;
    prize: string;
    duration: string;
    expires: string;
    expired: boolean;
};

declare const GuildSchema: mongoose.Model<Guild, {}, {}, {}, mongoose.Document<unknown, {}, Guild> & Guild & {
    _id: mongoose.Types.ObjectId;
}, any>;
type Guild = {
    id: string;
    admins: string[];
    commands: GuildCommands | undefined;
    modules: Partial<GuildModules> | undefined;
    news_channel: string | undefined;
};
type GuildCommands = Record<string, GuildCommand>;
type GuildCommand = {
    name: string;
    permissions: string | null;
};
type GuildModules = {
    AuditLogs: GuildModuleAuditLogs;
    AutoPartners: GuildModuleAutoPartners;
    AutoRoles: GuildModuleAutoRoles;
    JoinToCreates: GuildModuleJoinToCreates;
    Levels: GuildModuleLevels;
    ReactionRoles: GuildModuleReactionRoles;
    Tickets: GuildModuleTickets;
    Warnings: GuildModuleWarnings;
    WelcomeMessages: GuildModuleWelcomeMessages;
};
type GuildModule<T extends keyof GuildModules> = GuildModules[T];
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
type GuildModuleWarnings = {
    enabled: boolean;
    warnings: string[];
};
type GuildModuleWelcomeMessages = {
    enabled: boolean;
    channel: string;
    message: string;
    mention: boolean;
    card: {
        enabled: boolean;
        background?: string;
    };
};

declare const LevelSchema: mongoose.Model<Level, {}, {}, {}, mongoose.Document<unknown, {}, Level> & Level & {
    _id: mongoose.Types.ObjectId;
}, any>;
type Level = {
    guild: string;
    user: string;
    level: number;
    xp: number;
};

declare const TagSchema: mongoose.Model<Tag, {}, {}, {}, mongoose.Document<unknown, {}, Tag> & Tag & {
    _id: mongoose.Types.ObjectId;
}, any>;
type Tag = {
    guild: string;
    tags: {
        name: string;
        value: string;
    }[];
};

export { type AFK, AFKSchema, type Game, type GameData, type GameDataTictactoe, GameSchema, type Giveaway, GiveawaySchema, type Guild, type GuildCommand, type GuildCommands, type GuildModule, type GuildModuleAuditLogs, type GuildModuleAutoPartners, type GuildModuleAutoRoles, type GuildModuleJoinToCreates, type GuildModuleLevels, type GuildModuleReactionRoles, type GuildModuleTickets, type GuildModuleWarnings, type GuildModuleWelcomeMessages, type GuildModules, GuildSchema, type Level, LevelSchema, type Tag, TagSchema };
