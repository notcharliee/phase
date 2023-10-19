import mongoose from 'mongoose';
const Data = new mongoose.Schema({
    guild: String,
    channel: String,
    advert: String,
    partners: Array,
    invites: Array
});
export default mongoose.models['AutoPartners'] || mongoose.model('AutoPartners', Data);
