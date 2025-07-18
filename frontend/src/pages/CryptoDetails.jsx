import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { useParams, useNavigate } from 'react-router-dom';
const apiUrl = import.meta.env.VITE_API_URL|| 'http://localhost:5000';
function CryptoDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [crypto, setCrypto] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (id) {
      fetchCrypto();
      fetchHistory(id);
    }
  }, [id]);

  const fetchCrypto = async () => {
    try {
      const response = await axios.get(`${apiUrl}/crypto/current`);
      const foundCrypto = response.data.find(c => c.id === id);
      if (foundCrypto) {
        setCrypto(foundCrypto);
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Error fetching crypto:', error);
      navigate('/');
    }
  };

  const fetchHistory = async (cryptoId) => {
    try {
      const response = await axios.get(`${apiUrl}/crypto/history/${cryptoId}`);
      setHistory(response.data);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const formatMarketCap = (cap) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      compactDisplay: 'short'
    }).format(cap);
  };

  const formatPercentage = (value) => {
    const isPositive = value >= 0;
    const color = isPositive ? 'text-green-600' : 'text-red-600';
    return (
      <span className={color}>
        {isPositive ? '+' : ''}{value.toFixed(2)}%
      </span>
    );
  };

  if (!crypto) return <div className="text-center p-8">Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <button 
        onClick={() => navigate('/')}
        className="mb-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
      >
        ← Back to List
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <img src={crypto.image} alt={crypto.name} className="w-16 h-16" />
          <div className="text-center md:text-left">
            <h1 className="text-2xl font-bold">{crypto.name} ({crypto.symbol.toUpperCase()})</h1>
            <p className="text-3xl font-bold my-2">{formatPrice(crypto.current_price)}</p>
            <div className="text-lg">
              {formatPercentage(crypto.price_change_percentage_24h)}
            </div>
          </div>
          <div className="md:ml-auto grid grid-cols-2 gap-4 mt-4 md:mt-0">
            <div>
              <p className="text-gray-500 dark:text-gray-400">Market Cap</p>
              <p className="font-bold">{formatMarketCap(crypto.market_cap)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Price Chart (24h)</h2>
        <div className="h-96">
          <Line
            data={{
              labels: history.map(item => new Date(item.timestamp).toLocaleTimeString()),
              datasets: [{
                label: 'Price (USD)',
                data: history.map(item => item.price),
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
              }]
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default CryptoDetail;