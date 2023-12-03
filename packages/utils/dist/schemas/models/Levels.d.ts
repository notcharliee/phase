import mongoose from 'mongoose';

interface DataTypes {
    guild: string;
    message: string;
    setChannel: string;
    msgChannel: boolean;
    dmsChannel: boolean;
    roles: {
        level: number;
        role: string;
    }[];
    levels: {
        id: string;
        level: number;
        xp: number;
        target: number;
    }[];
}
declare const _default: mongoose.Model<DataTypes, {}, {}, {}, mongoose.Document<unknown, {}, DataTypes> & DataTypes & {
    _id: mongoose.Types.ObjectId;
}, any>;

export { _default as default };
