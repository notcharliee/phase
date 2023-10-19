import mongoose from 'mongoose';
const Data = new mongoose.Schema({
    guild: String,
    channel: String,
    category: String,
    active: Array,
});
export default mongoose.models['JoinToCreate'] || mongoose.model('JoinToCreate', Data);
