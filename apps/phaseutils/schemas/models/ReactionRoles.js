import mongoose from 'mongoose';
const Data = new mongoose.Schema({
    guild: String,
    channel: String,
    message: String,
    reactions: Array,
});
export default mongoose.models['ReactionRoles'] || mongoose.model('ReactionRoles', Data);
