
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { type Cow, type Birth } from '@/lib/data-schemas';

interface Data {
  cows: Cow[];
  births: Birth[];
}

interface DataContextType {
  data: Cow[];
  births: Birth[];
  addCow: (cow: Cow) => void;
  updateCow: (id: string, updatedCow: Cow) => void;
  deleteCow: (id: string) => void;
  updateCowsLot: (ids: string[], newLot: string) => void;
  addBirth: (birth: Birth) => void;
}

const DATA_STORAGE_KEY = 'cattleLifeData';

const DataContext = createContext<DataContextType | undefined>(undefined);

const getInitialData = (): Data => {
  if (typeof window === 'undefined') {
    return { cows: [], births: [] };
  }
  try {
    const item = window.localStorage.getItem(DATA_STORAGE_KEY);
    return item ? JSON.parse(item) : { cows: [], births: [] };
  } catch (error) {
    console.warn(`Error reading localStorage key “${DATA_STORAGE_KEY}”:`, error);
    return { cows: [], births: [] };
  }
};

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<Data>(getInitialData);

  useEffect(() => {
    try {
      window.localStorage.setItem(DATA_STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
       console.warn(`Error setting localStorage key “${DATA_STORAGE_KEY}”:`, error);
    }
  }, [data]);


  const addCow = (cow: Cow) => {
    setData((prevData) => ({
      ...prevData,
      cows: [...prevData.cows, cow],
    }));
  };

  const updateCow = (id: string, updatedCow: Cow) => {
    setData((prevData) => ({
      ...prevData,
      cows: prevData.cows.map(cow => cow.id === id ? updatedCow : cow),
    }));
  }

  const deleteCow = (id: string) => {
    setData((prevData) => ({
      ...prevData,
      cows: prevData.cows.filter(cow => cow.id !== id),
    }));
  };

  const updateCowsLot = (ids: string[], newLot: string) => {
    setData((prevData) => ({
      ...prevData,
      cows: prevData.cows.map(cow => 
        ids.includes(cow.id) ? { ...cow, lot: newLot } : cow
      ),
    }));
  };
  
  const addBirth = (birth: Birth) => {
    setData((prevData) => ({
      ...prevData,
      births: [...prevData.births, birth],
    }));
  };

  return (
    <DataContext.Provider value={{ data: data.cows, births: data.births, addCow, updateCow, deleteCow, updateCowsLot, addBirth }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

    