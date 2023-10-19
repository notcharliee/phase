import mongoose from 'mongoose';
const Data = new mongoose.Schema({
    guild: String,
    channel: String,
    options: Array,
});
export default mongoose.models['AuditLogs'] || mongoose.model('AuditLogs', Data);
