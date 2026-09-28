import React, { createContext, useContext, useState } from 'react';
import { TRANSLATIONS } from '../constants/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('ENG');

  const t = (key, params = {}) => {
    let str = TRANSLATIONS[language]?.[key] || TRANSLATIONS['ENG']?.[key] || key;
    Object.keys(params).forEach((paramKey) => {
      str = str.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), params[paramKey]);
    });
    return str;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
