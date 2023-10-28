import mongoose from 'mongoose';

interface DataTypes {
    guild: string;
    channel: string;
    options?: {
        server: {
            channel: string;
            enabled: string;
        };
        messages: {
            channel: string;
            enabled: string;
        };
        voice: {
            channel: string;
            enabled: string;
        };
        invites: {
            channel: string;
            enabled: string;
        };
        members: {
            channel: string;
            enabled: string;
        };
        punishments: {
            channel: string;
            enabled: string;
        };
    };
}
declare const _default: mongoose.Model<DataTypes, {}, {}, {}, mongoose.Document<unknown, {}, DataTypes> & DataTypes & {
    _id: mongoose.Types.ObjectId;
}, any>;

export { _default as default };
