const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  companyJobDescription: {
    type: String,
    required: true,
    default: 'Default Company Job Description'
  }
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
