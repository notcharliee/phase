import mongoose from 'mongoose';

declare const LevelSchema: mongoose.Model<Level, {}, {}, {}, mongoose.Document<unknown, {}, Level> & Level & {
    _id: mongoose.Types.ObjectId;
}, any>;
type Level = {
    guild: string;
    user: string;
    level: number;
    xp: number;
};

export { type Level, LevelSchema };
