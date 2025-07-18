import React from 'react';
import CryptoList from './pages/CryptoList';
import { Route, Routes } from 'react-router-dom';
import CryptoDetail from './pages/CryptoDetails';
function App() {
  return (
       <>
    <Routes>
      <Route path="/" element={<CryptoList />} />
      <Route path="/crypto/:id" element={<CryptoDetail />} />
    </Routes>
       </>
  );
}

export default App;