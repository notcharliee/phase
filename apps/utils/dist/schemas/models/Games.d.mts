import mongoose from 'mongoose';

interface DataTypes {
    guild: string;
    message: string;
    type: 'TICTACTOE';
    participants: string[];
    gameData: {
        currentTurn: {
            participant: string;
            marker: string;
        };
        moves: string[];
    };
}
declare const _default: mongoose.Model<DataTypes, {}, {}, {}, mongoose.Document<unknown, {}, DataTypes> & DataTypes & {
    _id: mongoose.Types.ObjectId;
}, any>;

export { _default as default };
