import mongoose from 'mongoose';

declare const AFKSchema: mongoose.Model<AFK, {}, {}, {}, mongoose.Document<unknown, {}, AFK> & AFK & {
    _id: mongoose.Types.ObjectId;
}, any>;
type AFK = {
    user: string;
    reason: string;
};

export { type AFK, AFKSchema };
