const mongoose = require('mongoose');

const BlacklistedTokenSchema = new mongoose.Schema({
  token: String,
  createdAt: { type: Date, default: Date.now, expires: '1d' } // auto-delete in 1 day
});

module.exports = mongoose.model('BlacklistedToken', BlacklistedTokenSchema);
