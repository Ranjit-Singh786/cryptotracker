import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { BeatLoader } from "react-spinners";
const CryptoContext = createContext();
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
 const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};
export const CryptoProvider = ({ children }) => {
  const [crypto, setCrypto] = useState(null);
  const [cryptos, setCryptos] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [puffloading, setPuffLoading] = useState(true);
  const [color, setColor] = useState("#756c6cff");

   const fetchCryptos = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/crypto/current`);
      setCryptos(response.data);
      if (response.data.length > 0 && !selectedCrypto) {
        setSelectedCrypto(response.data[0]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCrypto = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/crypto/current`);
      const foundCrypto = response.data.find(c => c.id === id);
      if (foundCrypto) {
        setCrypto(foundCrypto);
      } else {
        throw new Error('Crypto not found');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async (cryptoId) => {
    try {
      const response = await axios.get(`${apiUrl}/crypto/history/${cryptoId}`);
      setHistory(response.data);
    } catch (err) {
      setError(err.message);
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
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(cap);
  };

  const formatPercentage = (value) => {
    const isPositive = value >= 0;
    const color = isPositive ? 'text-green-600' : 'text-red-600';
    return (
      <span className={color}>
        {isPositive ? '+' : ''}{value?.toFixed(2)}%
      </span>
    );
  };

  const resetCryptoState = () => {
  setCrypto(null);
  setHistory([]);
  setLoading(true);
  setError(null);
};
 const puffLoaderDiv = ()=> {
    return (
      <div className="sweet-loading">
      <button onClick={() => setPuffLoading(!loading)}></button>
      <input
        onChange={(input) => setColor(input.target.value) }
      />

      <BeatLoader
        color={color}
        loading={puffloading}
        cssOverride={override}
        size={15}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
    );
  };


  return (
    <CryptoContext.Provider
     value={{
        cryptos,
        selectedCrypto,
        crypto,
        history,
        loading,
        error,
        fetchCryptos,
        fetchCrypto,
        fetchHistory,
        setSelectedCrypto,
        formatPrice,
        formatMarketCap,
        formatPercentage,
        resetCryptoState,
        puffLoaderDiv,
      }}
    >
      {children}
    </CryptoContext.Provider>
  );
};

export const useCrypto = () => useContext(CryptoContext);
  