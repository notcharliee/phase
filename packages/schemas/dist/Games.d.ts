import mongoose from 'mongoose';

declare const GameSchema: mongoose.Model<Game, {}, {}, {}, mongoose.Document<unknown, {}, Game> & Game & {
    _id: mongoose.Types.ObjectId;
}, any>;
type Game = {
    id: string;
    type: string;
    game_data: GameData;
    players: string[];
};
type GameDataTictactoe = {
    current_turn: {
        marker: string;
        player: string;
    };
    moves: string[];
};
type GameData = GameDataTictactoe;

export { type Game, type GameData, type GameDataTictactoe, GameSchema };
