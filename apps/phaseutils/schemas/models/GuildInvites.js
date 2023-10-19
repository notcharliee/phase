import mongoose from 'mongoose';
const Data = new mongoose.Schema({
    guild: String,
    invites: Array,
});
export default mongoose.models['GuildInvites'] || mongoose.model('GuildInvites', Data);
