
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LanguageContextType {
  isEnglish: boolean;
  toggleLanguage: () => void;
  t: (telugu: string, english: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [isEnglish, setIsEnglish] = useState(false);

  const toggleLanguage = () => {
    setIsEnglish(!isEnglish);
  };

  const t = (telugu: string, english: string) => {
    return isEnglish ? english : telugu;
  };

  return (
    <LanguageContext.Provider value={{ isEnglish, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
