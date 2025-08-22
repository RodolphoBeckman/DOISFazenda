
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
    const parsedSettings: Settings = item ? JSON.parse(item) : { lots: [], pastures: [], farms: [], breeds: [] };

    // Remove duplicates from each category
    Object.keys(parsedSettings).forEach((key) => {
      const category = key as Category;
      const uniqueNames = new Set<string>();
      parsedSettings[category] = parsedSettings[category].filter(item => {
        const lowerCaseName = item.name.toLowerCase();
        if (uniqueNames.has(lowerCaseName)) {
          return false;
        } else {
          uniqueNames.add(lowerCaseName);
          return true;
        }
      });
    });

    return parsedSettings;

  } catch (error) {
    console.warn(`Error reading localStorage key “${SETTINGS_STORAGE_KEY}”:`, error);
    return { lots: [], pastures: [], farms: [], breeds: [] };
  }
};

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<Settings>(getInitialSettings);

  useEffect(() => {
    try {
      // Before saving, ensure data is still unique
      const uniqueSettings: Settings = { lots: [], pastures: [], farms: [], breeds: [] };
      Object.keys(settings).forEach(key => {
        const category = key as Category;
        const seen = new Set<string>();
        uniqueSettings[category] = settings[category].filter(item => {
           const lowerCaseName = item.name.toLowerCase();
           if (seen.has(lowerCaseName)) {
               return false;
           }
           seen.add(lowerCaseName);
           return true;
        });
      });
      window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(uniqueSettings));
    } catch (error) {
       console.warn(`Error setting localStorage key “${SETTINGS_STORAGE_KEY}”:`, error);
    }
  }, [settings]);


  const addSettingItem = (category: Category, item: Item) => {
     setSettings((prevSettings) => {
      const categoryItems = prevSettings[category];
      const itemExists = categoryItems.some(
        (existingItem) => existingItem.name.toLowerCase() === item.name.toLowerCase()
      );

      if (itemExists) {
        // Optionally, show a toast message to the user
        // toast({ variant: 'destructive', title: 'Erro', description: 'Este item já existe.' });
        return prevSettings; // Return current state if item exists
      }

      return {
        ...prevSettings,
        [category]: [...categoryItems, item],
      };
    });
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
