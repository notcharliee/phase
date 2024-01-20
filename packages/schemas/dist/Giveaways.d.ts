import mongoose from 'mongoose';

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

export { type Giveaway, GiveawaySchema };
