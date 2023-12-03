import mongoose from 'mongoose';

interface DataTypes {
    guild: string;
    message: string;
    channel: string;
    created: string;
    host: string;
    entries: string[];
    winners: number;
    prize: string;
    expires: string;
    duration: string;
    expired: boolean;
}
declare const _default: mongoose.Model<DataTypes, {}, {}, {}, mongoose.Document<unknown, {}, DataTypes> & DataTypes & {
    _id: mongoose.Types.ObjectId;
}, any>;

export { _default as default };
