import mongoose from 'mongoose';
const Data = new mongoose.Schema({
    guild: String,
    tags: Array,
});
export default mongoose.models['Tags'] || mongoose.model('Tags', Data);
