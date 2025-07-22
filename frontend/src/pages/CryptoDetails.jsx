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
  Filler,
} from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  zoomPlugin
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
    resetCryptoState,
    puffLoaderDiv
  } = useCrypto();

  const chartRef = React.useRef(null);

  React.useEffect(() => {
    if (id) {
      fetchCrypto(id);
      fetchHistory(id);
    }
    return () => {
      resetCryptoState();
    };
  }, [id]);

  if (error) {
    navigate('/');
    return null;
  }

  const handleBackClick = () => {
    resetCryptoState();
    navigate('/');
  }

  const handleResetZoom = () => {
    if (chartRef && chartRef.current) {
      chartRef.current.resetZoom();
    }
  };

  const chartData = {
    labels: history.map(item => new Date(item.timestamp).toLocaleTimeString()),
    datasets: [{
      label: 'Price (USD)',
      data: history.map(item => item.price),
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      tension: 0.1,
      pointRadius: 0,
      pointHoverRadius: 5,
      pointHitRadius: 10,
      pointHoverBackgroundColor: 'rgb(75, 192, 192)',
      fill: {
        target: 'origin',
        above: 'rgba(75, 192, 192, 0.2)'
      }
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    },
    plugins: {
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${formatPrice(context.parsed.y)}`;
          }
        }
      },
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true
          },
          mode: 'xy',
        },
        pan: {
          enabled: true,
          mode: 'xy',
        }
      },
      legend: {
        onClick: (e) => e.stopPropagation()
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Time'
        },
        grid: {
          display: false
        }
      },
      y: {
        title: {
          display: true,
          text: 'Price (USD)'
        },
        ticks: {
          callback: function(value) {
            return formatPrice(value);
          }
        }
      }
    },
    onHover: (event, chartElement) => {
      const target = event.native?.target;
      if (target) {
        target.style.cursor = chartElement[0] ? 'pointer' : 'default';
      }
    }
  };

  return (
    <div className="container max-w-full mx-auto p-4">
      <button 
        onClick={() => handleBackClick()}
        className="mb-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-100 rounded hover:bg-gray-300 dark:hover:bg-gray-900 transition cursor-pointer"
      >
       <span className='text-black'> ← Back to List</span>
      </button>

      {
        loading ? (
          <div className="text-center p-8">
            {puffLoaderDiv()}
          </div>
        ) : (
           <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 dark:text-gray-100">
          <img src={crypto?.image} alt={crypto?.name} className="w-16 h-16" />
          <div className="text-center md:text-left dark:text-gray-100">
            <h1 className="text-2xl font-bold">{crypto?.name} ({crypto?.symbol.toUpperCase()})</h1>
            <p className="text-3xl font-bold my-2 dark:text-gray-100">{formatPrice(crypto?.current_price)}</p>
            <div className="text-lg">
              {formatPercentage(crypto?.price_change_percentage_24h)}
            </div>
          </div>
          <div className="md:ml-auto grid grid-cols-2 gap-4 mt-4 md:mt-0">
            <div>
              <p className="text-gray-500 dark:text-gray-100">Market Cap</p>
              <p className="font-bold">{formatMarketCap(crypto?.market_cap)}</p>
            </div>
          </div>
        </div>
      </div>
        )
      }

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold dark:text-gray-100">Price Chart (24h)</h2>
          <button 
            onClick={handleResetZoom}
            className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:text-gray-100 hover:bg-gray-600 text-sm cursor-pointer"
          >
            Reset Zoom
          </button>
        </div>
        <div className="h-96 relative">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center text-center p-8">
              {puffLoaderDiv()}
            </div>
          ) : history.length > 0 ? (
            <Line 
            ref={chartRef}
            data={chartData} 
            options={chartOptions} 
          />
          
          )
          : (
            <div className="text-center p-8 dark:text-gray-100">No historical data available</div>
          )}  
         
          <div className="absolute bottom-2 left-2 text-xs text-gray-500 dark:text-gray-100">
            Scroll to zoom • Drag to pan • Click reset to restore
          </div>
        </div>
      </div>
    </div>
  );
}

export default CryptoDetail;