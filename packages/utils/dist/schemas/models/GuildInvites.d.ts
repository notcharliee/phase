import mongoose from 'mongoose';

interface DataTypes {
    guild: string;
    invites: {
        channel: string | null;
        code: string;
        created: Date | null;
        expires: Date | null;
        inviter: string | null;
        maxAge: number | null;
        maxUses: number | null;
        targetUser: string | null;
        temporary: boolean | null;
        uses: number | null;
    }[];
}
declare const _default: mongoose.Model<DataTypes, {}, {}, {}, mongoose.Document<unknown, {}, DataTypes> & DataTypes & {
    _id: mongoose.Types.ObjectId;
}, any>;

export { _default as default };
