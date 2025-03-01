import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { WalletProvider } from './context/WalletContext';
import { ModeProvider } from './context/ModeContext';

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

// Services
import apiAdapter from './services/apiAdapter';
import { useMode } from './context/ModeContext';

// ApiAdapter mode synchronizer component
// Define this component outside of the App component to avoid context hook issues
const ApiModeSynchronizer: React.FC = () => {
  const { isDemoMode } = useMode();
  
  // Update API adapter mode when the app mode changes
  useEffect(() => {
    apiAdapter.setMode(isDemoMode);
    console.log(`Application mode set to: ${isDemoMode ? 'Demo' : 'Real'} mode`);
  }, [isDemoMode]);
  
  return null; // This component doesn't render anything
};

function App() {
  return (
    <ChakraProvider>
      <ModeProvider>
        <WalletProvider>
          <Router>
            <ApiModeSynchronizer />
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
      </ModeProvider>
    </ChakraProvider>
  );
}

export default App;
