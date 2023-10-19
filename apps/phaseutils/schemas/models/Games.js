import mongoose from 'mongoose';
const Data = new mongoose.Schema({
    guild: String,
    message: String,
    type: String,
    participants: Array,
    gameData: Object,
});
export default mongoose.models['Games'] || mongoose.model('Games', Data);
