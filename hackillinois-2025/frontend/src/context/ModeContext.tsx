import React, { createContext, useState, useContext, useEffect } from 'react';

interface ModeContextType {
  isDemoMode: boolean;
  toggleMode: () => void;
  setDemoMode: (isDemoMode: boolean) => void;
}

// Create context with default values
const ModeContext = createContext<ModeContextType>({
  isDemoMode: true, // Default to demo mode
  toggleMode: () => {},
  setDemoMode: () => {}
});

export const useMode = () => useContext(ModeContext);

interface ModeProviderProps {
  children: React.ReactNode;
}

export const ModeProvider: React.FC<ModeProviderProps> = ({ children }) => {
  // Default to demo mode for hackathon presentation, but allow switching
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);

  // Check if mode preference was previously set
  useEffect(() => {
    const savedMode = localStorage.getItem('appMode');
    if (savedMode) {
      setIsDemoMode(savedMode === 'demo');
    }
  }, []);

  // Toggle between demo and real mode
  const toggleMode = () => {
    const newMode = !isDemoMode;
    setIsDemoMode(newMode);
    localStorage.setItem('appMode', newMode ? 'demo' : 'real');
  };

  // Set mode directly
  const handleSetDemoMode = (isDemoMode: boolean) => {
    setIsDemoMode(isDemoMode);
    localStorage.setItem('appMode', isDemoMode ? 'demo' : 'real');
  };

  return (
    <ModeContext.Provider
      value={{
        isDemoMode,
        toggleMode,
        setDemoMode: handleSetDemoMode
      }}
    >
      {children}
    </ModeContext.Provider>
  );
};

export default ModeContext;