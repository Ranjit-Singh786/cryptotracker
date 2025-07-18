import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import { Link } from 'react-router-dom';
const apiUrl = import.meta.env.VITE_API_URL|| 'http://localhost:5000';
function CryptoList() {
  const [cryptos, setCryptos] = useState([]);
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchCryptos();
  }, []);

  useEffect(() => {
    if (selectedCrypto) {
      fetchHistory(selectedCrypto.id);
    }
  }, [selectedCrypto]);

  const fetchCryptos = async () => {
    try {
      const response = await axios.get(`${apiUrl}/crypto/current`);
      setCryptos(response.data);
      if (response.data.length > 0 && !selectedCrypto) {
        setSelectedCrypto(response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching cryptos:', error);
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

  return (
    <div className="container">
      <h1 className='text-2xl text-center p-4 font-bold'>Top 10 Cryptocurrencies</h1>

      <div className="w-full bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      <div className="overflow-x-auto p-4 md:p-6 lg:p-8">
        <table className="w-full ">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-16">
                Rank
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Symbol
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Market Cap
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Price
              </th>
             
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                % 24h
              </th>
           </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {cryptos.map((crypto,index) => (
              <tr key={crypto.id} 
             className={`hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150 cursor-pointer ${selectedCrypto?.id === crypto.id ? 'bg-gray-100 dark:bg-gray-700' : ''}`}>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-500 dark:text-gray-400">
                  {index+1}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                    <Link to={`/crypto/${crypto.id}`} className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <img src={crypto.image} alt={crypto.name} width="24" />
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{crypto.name}</span>
                  </div>
                </Link>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-500 dark:text-gray-400">
                  {crypto.symbol.toUpperCase()}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900 dark:text-gray-100">
                  {formatMarketCap(crypto.market_cap)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900 dark:text-gray-100">
                  {formatPrice(crypto.current_price)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right text-sm">
                  {formatPercentage(crypto.price_change_percentage_24h)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
}

export default CryptoList;