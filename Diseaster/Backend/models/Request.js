const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const requestSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true }, // ✅ make sure this is here
  location: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, default: 'pending' },
  assignedVolunteer: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.models.Request || mongoose.model('Request', requestSchema);
