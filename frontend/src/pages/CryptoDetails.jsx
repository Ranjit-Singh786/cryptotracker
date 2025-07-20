import React from 'react';
import { Line } from 'react-chartjs-2';
import { useParams, useNavigate } from 'react-router-dom';
import { useCrypto } from '../context/CryptoContext.jsx';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function CryptoDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    crypto,
    history,
    loading,
    error,
    fetchCrypto,
    fetchHistory,
    formatPrice,
    formatMarketCap,
    formatPercentage,
    resetCryptoState
  } = useCrypto();

  React.useEffect(() => {
    if (id) {
      fetchCrypto(id);
      fetchHistory(id);
    }
     return () => {
      resetCryptoState();
    };
  }, [id]);

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (error) {
    navigate('/');
    return null;
  }
  if (!crypto) return null;

  const handleBackClick = () => {
    resetCryptoState();
    navigate('/');
  }

  const chartData = {
    labels: history.map(item => new Date(item.timestamp).toLocaleTimeString()),
    datasets: [{
      label: 'Price (USD)',
      data: history.map(item => item.price),
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      tension: 0.1,
        fill: {
        target: 'origin', 
        above: 'rgba(75, 192, 192, 0.2)'
      }
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animate:{
       animation: {
      duration: 0
    }
    },
    scales: {
      x: {
        type: 'category',
        title: {
          display: true,
          text: 'Time'
        }
      },
      y: {
        type: 'linear',
        title: {
          display: true,
          text: 'Price (USD)'
        }
      }
    }
  };

  return (
    <div className="container max-w-full mx-auto p-4">
      <button 
        onClick={() => handleBackClick()}
        className="mb-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition cursor-pointer"
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
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}

export default CryptoDetail;