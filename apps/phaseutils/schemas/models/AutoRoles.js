import mongoose from 'mongoose';
const Data = new mongoose.Schema({
    guild: String,
    roles: Array,
    pending: Boolean,
});
export default mongoose.models['AutoRoles'] || mongoose.model('AutoRoles', Data);
