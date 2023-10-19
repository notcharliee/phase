import mongoose from 'mongoose';
const Data = new mongoose.Schema({
    guild: String,
    user: String,
    reason: String,
});
export default mongoose.models['AFKs'] || mongoose.model('AFKs', Data);
