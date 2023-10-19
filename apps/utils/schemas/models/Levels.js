import mongoose from 'mongoose';
const Data = new mongoose.Schema({
    guild: String,
    message: String,
    setChannel: String,
    msgChannel: Boolean,
    dmsChannel: Boolean,
    roles: Array,
    levels: Array,
});
export default mongoose.models['Levels'] || mongoose.model('Levels', Data);
