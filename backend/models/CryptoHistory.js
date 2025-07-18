const mongoose = require('mongoose');

const cryptoHistorySchema = new mongoose.Schema({
  cryptoId: { type: String, required: true },
  price: { type: Number, required: true },
  market_cap: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CryptoHistory', cryptoHistorySchema);