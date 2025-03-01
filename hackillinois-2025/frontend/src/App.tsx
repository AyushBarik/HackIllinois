import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { WalletProvider } from './context/WalletContext';

// Components
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import Properties from './pages/Properties';
import PropertyDetail from './pages/PropertyDetail';
import DigitalKeys from './pages/DigitalKeys';
import Dashboard from './pages/Dashboard';
import MyProperties from './pages/MyProperties';
import MyRentals from './pages/MyRentals';
import SecurityMonitoring from './pages/SecurityMonitoring';
import TransactionHistory from './pages/TransactionHistory';

function App() {
  return (
    <ChakraProvider>
      <WalletProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/properties/:id" element={<PropertyDetail />} />
            <Route path="/digital-keys" element={<DigitalKeys />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/my-properties" element={<MyProperties />} />
            <Route path="/my-rentals" element={<MyRentals />} />
            <Route path="/security" element={<SecurityMonitoring />} />
            <Route path="/transactions" element={<TransactionHistory />} />
          </Routes>
        </Router>
      </WalletProvider>
    </ChakraProvider>
  );
}

export default App;
