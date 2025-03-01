import React, { createContext, useState, useContext, useEffect } from 'react';
import { Keypair } from '@solana/web3.js';

interface WalletContextType {
  publicKey: string | null;
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  walletType: 'owner' | 'tenant' | null;
  setWalletType: (type: 'owner' | 'tenant' | null) => void;
}

// Create context with default values
const WalletContext = createContext<WalletContextType>({
  publicKey: null,
  isConnected: false,
  connect: async () => {},
  disconnect: () => {},
  walletType: null,
  setWalletType: () => {}
});

export const useWallet = () => useContext(WalletContext);

interface WalletProviderProps {
  children: React.ReactNode;
}

// For this demo, we'll use a mock wallet implementation
export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [walletType, setWalletType] = useState<'owner' | 'tenant' | null>(null);

  // Check if wallet was previously connected
  useEffect(() => {
    const savedPublicKey = localStorage.getItem('walletPublicKey');
    const savedWalletType = localStorage.getItem('walletType') as 'owner' | 'tenant' | null;
    
    if (savedPublicKey) {
      setPublicKey(savedPublicKey);
      setIsConnected(true);
      setWalletType(savedWalletType);
    }
  }, []);

  // Connect wallet (simplified for demo)
  const connect = async () => {
    try {
      // Generate a random keypair for demo purposes
      const keypair = Keypair.generate();
      const publicKeyString = keypair.publicKey.toString();
      
      setPublicKey(publicKeyString);
      setIsConnected(true);
      
      // Save to localStorage
      localStorage.setItem('walletPublicKey', publicKeyString);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  // Disconnect wallet
  const disconnect = () => {
    setPublicKey(null);
    setIsConnected(false);
    setWalletType(null);
    localStorage.removeItem('walletPublicKey');
    localStorage.removeItem('walletType');
  };

  // Update wallet type and save to localStorage
  const handleSetWalletType = (type: 'owner' | 'tenant' | null) => {
    setWalletType(type);
    if (type) {
      localStorage.setItem('walletType', type);
    } else {
      localStorage.removeItem('walletType');
    }
  };

  return (
    <WalletContext.Provider
      value={{
        publicKey,
        isConnected,
        connect,
        disconnect,
        walletType,
        setWalletType: handleSetWalletType
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export default WalletContext;