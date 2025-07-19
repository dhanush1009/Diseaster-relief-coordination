const mongoose = require('mongoose');
const requestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  description: String,
  location: String,
  type: String,
  assignedVolunteer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, default: 'pending' }  // pending | in progress | completed
});
module.exports = mongoose.model('Request', requestSchema);
