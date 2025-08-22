
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { type Item, type Category } from '@/lib/data-schemas';

interface Settings {
  lots: Item[];
  pastures: Item[];
  farms: Item[];
  breeds: Item[];
}

interface SettingsContextType {
  settings: Settings;
  addSettingItem: (category: Category, item: Item) => void;
}

const SETTINGS_STORAGE_KEY = 'cattleLifeSettings';

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const getInitialSettings = (): Settings => {
  if (typeof window === 'undefined') {
    return { lots: [], pastures: [], farms: [], breeds: [] };
  }
  try {
    const item = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
    return item ? JSON.parse(item) : { lots: [], pastures: [], farms: [], breeds: [] };
  } catch (error) {
    console.warn(`Error reading localStorage key “${SETTINGS_STORAGE_KEY}”:`, error);
    return { lots: [], pastures: [], farms: [], breeds: [] };
  }
};

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<Settings>(getInitialSettings);

  useEffect(() => {
    try {
      window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
       console.warn(`Error setting localStorage key “${SETTINGS_STORAGE_KEY}”:`, error);
    }
  }, [settings]);


  const addSettingItem = (category: Category, item: Item) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [category]: [...prevSettings[category], item],
    }));
  };

  return (
    <SettingsContext.Provider value={{ settings, addSettingItem }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
