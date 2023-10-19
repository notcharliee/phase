import mongoose from 'mongoose';
const Data = new mongoose.Schema({
    guild: String,
    channel: String,
    panel: Object,
    tickets: Array,
    sent: Boolean,
});
export default mongoose.models['Tickets'] || mongoose.model('Tickets', Data);
