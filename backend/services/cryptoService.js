const axios = require('axios');
const CryptoCurrent = require('../models/CryptoCurrent');
const CryptoHistory = require('../models/CryptoHistory');

const fetchAndStoreCryptoData = async () => {
  try {
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false'
    );
    
    const cryptoData = response.data;
    
    await Promise.all(cryptoData.map(async (crypto) => {
      await CryptoCurrent.findOneAndUpdate(
        { id: crypto.id },
        {
          symbol: crypto.symbol,
          name: crypto.name,
          current_price: crypto.current_price,
          price_change_percentage_24h: crypto.price_change_percentage_24h,
          market_cap: crypto.market_cap,
          image: crypto.image,
          last_updated: new Date()
        },
        { upsert: true, new: true }
      );
      
      await CryptoHistory.create({
        cryptoId: crypto.id,
        price: crypto.current_price,
        market_cap: crypto.market_cap
      });
    }));
    
    console.log('Crypto data updated successfully');
  } catch (error) {
    console.error('Error fetching crypto data:', error.message);
  }
};

module.exports = { fetchAndStoreCryptoData };