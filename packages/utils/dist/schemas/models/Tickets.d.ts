import mongoose from 'mongoose';

interface DataTypes {
    guild: string;
    channel: string;
    panel: {
        message: string;
        embed: {
            title: string;
            message: string;
            colour: string;
        };
        buttons: {
            name: string;
            id: string;
        }[];
    };
    tickets: [
        {
            id: string;
            name: string;
            category: string;
            message: string;
            embed?: {
                title: string;
                message: string;
                colour: string;
            };
            permissions?: {
                access: [string];
                locked: {
                    close: boolean;
                    reopen: boolean;
                    delete: boolean;
                };
            };
            count: number;
        }
    ];
    sent: boolean;
}
declare const _default: mongoose.Model<DataTypes, {}, {}, {}, mongoose.Document<unknown, {}, DataTypes> & DataTypes & {
    _id: mongoose.Types.ObjectId;
}, any>;

export { _default as default };
