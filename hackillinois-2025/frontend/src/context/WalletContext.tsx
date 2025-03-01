import React, { createContext, useState, useContext, useEffect } from 'react';
import { Keypair, PublicKey, Connection, clusterApiUrl } from '@solana/web3.js';
import { useMode } from './ModeContext';

interface WalletContextType {
  publicKey: string | null;
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  walletType: 'owner' | 'tenant' | null;
  setWalletType: (type: 'owner' | 'tenant' | null) => void;
  balance: number | null;
  refreshBalance: () => Promise<void>;
}

// Create context with default values
const WalletContext = createContext<WalletContextType>({
  publicKey: null,
  isConnected: false,
  connect: async () => {},
  disconnect: () => {},
  walletType: null,
  setWalletType: () => {},
  balance: null,
  refreshBalance: async () => {}
});

export const useWallet = () => useContext(WalletContext);

interface WalletProviderProps {
  children: React.ReactNode;
}

// Mock wallet addresses for demo mode to ensure consistent experience
const DEMO_OWNER_WALLET = "Demo5OwnerXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
const DEMO_TENANT_WALLET = "Demo5TenantXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const { isDemoMode } = useMode();
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [walletType, setWalletType] = useState<'owner' | 'tenant' | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  
  // Solana network connection for real mode
  const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

  // Check if wallet was previously connected
  useEffect(() => {
    const savedPublicKey = localStorage.getItem('walletPublicKey');
    const savedWalletType = localStorage.getItem('walletType') as 'owner' | 'tenant' | null;
    
    if (savedPublicKey) {
      setPublicKey(savedPublicKey);
      setIsConnected(true);
      setWalletType(savedWalletType);
      
      // Fetch initial balance if in real mode
      if (!isDemoMode && savedPublicKey) {
        refreshBalance();
      } else if (isDemoMode) {
        // Set mock balance for demo mode
        setBalance(walletType === 'owner' ? 1000 : 500);
      }
    }
  }, [isDemoMode]);

  // Update mock balance when wallet type changes in demo mode
  useEffect(() => {
    if (isDemoMode && isConnected) {
      setBalance(walletType === 'owner' ? 1000 : 500);
    }
  }, [walletType, isDemoMode, isConnected]);

  // Refresh wallet balance
  const refreshBalance = async () => {
    if (isDemoMode) {
      // For demo mode, use fixed amounts
      setBalance(walletType === 'owner' ? 1000 : 500);
      return;
    }
    
    try {
      if (publicKey) {
        const pk = new PublicKey(publicKey);
        const balance = await connection.getBalance(pk);
        // Convert lamports to SOL
        setBalance(balance / 1000000000);
      }
    } catch (error) {
      console.error('Failed to fetch balance:', error);
      setBalance(null);
    }
  };

  // Connect wallet
  const connect = async () => {
    try {
      if (isDemoMode) {
        // In demo mode, use predefined addresses based on current role
        const demoPublicKey = walletType === 'owner' ? DEMO_OWNER_WALLET : DEMO_TENANT_WALLET;
        
        setPublicKey(demoPublicKey);
        setIsConnected(true);
        setBalance(walletType === 'owner' ? 1000 : 500);
        
        // Save to localStorage
        localStorage.setItem('walletPublicKey', demoPublicKey);
      } else {
        // Real mode: Try to connect to Phantom wallet or other Solana wallets
        // For now, we'll use a randomly generated keypair since
        // full wallet integration would require more dependencies and setup
        
        const keypair = Keypair.generate();
        const publicKeyString = keypair.publicKey.toString();
        
        setPublicKey(publicKeyString);
        setIsConnected(true);
        
        // Save to localStorage
        localStorage.setItem('walletPublicKey', publicKeyString);
        
        // Fetch the balance
        await refreshBalance();
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  // Disconnect wallet
  const disconnect = () => {
    setPublicKey(null);
    setIsConnected(false);
    setWalletType(null);
    setBalance(null);
    localStorage.removeItem('walletPublicKey');
    localStorage.removeItem('walletType');
  };

  // Update wallet type and save to localStorage
  const handleSetWalletType = (type: 'owner' | 'tenant' | null) => {
    setWalletType(type);
    
    if (type) {
      localStorage.setItem('walletType', type);
      
      // In demo mode, update the wallet address based on type
      if (isDemoMode && isConnected) {
        const demoPublicKey = type === 'owner' ? DEMO_OWNER_WALLET : DEMO_TENANT_WALLET;
        setPublicKey(demoPublicKey);
        localStorage.setItem('walletPublicKey', demoPublicKey);
        setBalance(type === 'owner' ? 1000 : 500);
      }
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
        setWalletType: handleSetWalletType,
        balance,
        refreshBalance
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export default WalletContext;