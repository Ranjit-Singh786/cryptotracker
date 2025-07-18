const express = require('express');
const router = express.Router();
const CryptoCurrent = require('../models/CryptoCurrent');
const CryptoHistory = require('../models/CryptoHistory');

// Get top 10 cryptocurrencies
router.get('/current', async (req, res) => {
  try {
    const cryptos = await CryptoCurrent.find().sort({ market_cap: -1 }).limit(10);
    res.json(cryptos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get historical data for a specific crypto
router.get('/history/:id', async (req, res) => {
  try {
    const history = await CryptoHistory.find({ cryptoId: req.params.id })
      .sort({ timestamp: 1 })
      .limit(100);
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;