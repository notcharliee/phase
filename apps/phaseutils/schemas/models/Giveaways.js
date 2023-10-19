import mongoose from 'mongoose';
const Data = new mongoose.Schema({
    guild: String,
    message: String,
    channel: String,
    created: String,
    host: String,
    entries: Array,
    winners: Number,
    prize: String,
    expires: String,
    duration: String,
    expired: Boolean,
});
export default mongoose.models['Giveaways'] || mongoose.model('Giveaways', Data);
