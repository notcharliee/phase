import mongoose from 'mongoose';

interface DataTypes {
    guild: string;
    channel: string | undefined;
    advert: string | undefined;
    partners: {
        guildId: string;
        channelId: string;
        messageId: string;
    }[];
    invites: {
        code: string;
        expires: string;
    }[];
}
declare const _default: mongoose.Model<DataTypes, {}, {}, {}, mongoose.Document<unknown, {}, DataTypes> & DataTypes & {
    _id: mongoose.Types.ObjectId;
}, any>;

export { _default as default };
