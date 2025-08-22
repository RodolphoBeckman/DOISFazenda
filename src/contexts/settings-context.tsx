
"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
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

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<Settings>({
    lots: [],
    pastures: [],
    farms: [],
    breeds: [],
  });

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
