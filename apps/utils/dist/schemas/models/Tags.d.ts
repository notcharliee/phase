import mongoose from 'mongoose';

interface DataTypes {
    guild: string;
    tags: {
        name: string;
        value: string;
    }[];
}
declare const _default: mongoose.Model<DataTypes, {}, {}, {}, mongoose.Document<unknown, {}, DataTypes> & DataTypes & {
    _id: mongoose.Types.ObjectId;
}, any>;

export { _default as default };
