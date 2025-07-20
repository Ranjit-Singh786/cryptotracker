import React, { useEffect,useState } from 'react';
import { Link } from 'react-router-dom';
import { useCrypto } from '../context/CryptoContext';
function CryptoList() {
  const {
    cryptos,
    selectedCrypto,
    loading,
    error,
    fetchCryptos,
    setSelectedCrypto,
    formatPrice,
    formatMarketCap,
    formatPercentage,
    puffLoaderDiv
  } = useCrypto();


  useEffect(() => {
    fetchCryptos();
  }, []);


  

  if (error) {
    return (
      <div className="container max-w-full mx-auto p-4">
        <h1 className='text-2xl text-center p-4 font-bold'>TOP 10 CRYPTOCURRENCIES</h1>
        <div className="text-center p-8 text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container max-w-full mx-auto p-4">
      <h1 className='text-2xl text-center p-4 font-bold'>TOP 10 CRYPTOCURRENCIES</h1>

      <div className="w-full bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto p-4 md:p-6 lg:p-8">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-16">
                  Rank
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-16">
                  Name
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ">
                  Price
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Market Cap
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-widerw-8">
                  % 24h
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {loading && cryptos.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8">
                    {puffLoaderDiv()}
                  </td>
                </tr>
              ) : (
               cryptos.map((crypto, index) => (
                <tr 
                  key={crypto.id} 
                  onClick={() => setSelectedCrypto(crypto)}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150 cursor-pointer ${selectedCrypto?.id === crypto.id ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                >
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-500 dark:text-gray-400">
                    {index + 1}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <Link to={`/crypto/${crypto.id}`} className="flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        <img src={crypto.image} alt={crypto.name} width="24" />
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100 m-0 p-0">{crypto.name}</span>
                        ({crypto.symbol.toUpperCase()})
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900 dark:text-gray-100">
                    {formatPrice(crypto.current_price)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900 dark:text-gray-100">
                    {formatMarketCap(crypto.market_cap)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm">
                    {formatPercentage(crypto.price_change_percentage_24h)}
                  </td>
                </tr>
              ))
              )}
              
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default CryptoList;