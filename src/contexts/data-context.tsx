
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
  replaceCows: (newCows: Cow[]) => void;
  replaceBirths: (newBirths: Birth[]) => void;
}

const DATA_STORAGE_KEY = 'cattleLifeData';

const DataContext = createContext<DataContextType | undefined>(undefined);

const getInitialData = (): Data => {
  if (typeof window === 'undefined') {
    return { cows: [], births: [] };
  }
  try {
    const item = window.localStorage.getItem(DATA_STORAGE_KEY);
    const data = item ? JSON.parse(item) : { cows: [], births: [] };
    // Ensure both are arrays, initialize if missing
    return {
      cows: data.cows || [],
      births: data.births || []
    };
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
    setData((prevData) => {
      // Avoid adding duplicates
      if (prevData.cows.some(c => c.id.trim().toLowerCase() === cow.id.trim().toLowerCase())) {
        return prevData;
      }
      return {
        ...prevData,
        cows: [...prevData.cows, cow],
      }
    });
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
    setData((prevData) => {
        // Avoid adding duplicates
        if (prevData.births.some(b => b.cowId.trim().toLowerCase() === birth.cowId.trim().toLowerCase() && new Date(b.date).toDateString() === new Date(birth.date).toDateString())) {
            return prevData;
        }
        return {
            ...prevData,
            births: [...prevData.births, birth],
        };
    });
  };

  const replaceCows = (newCows: Cow[]) => {
    setData(prevData => ({
      ...prevData,
      cows: newCows,
    }));
  };

  const replaceBirths = (newBirths: Birth[]) => {
    setData(prevData => ({
      ...prevData,
      births: newBirths,
    }));
  };

  return (
    <DataContext.Provider value={{ 
      data: data.cows, 
      births: data.births, 
      addCow, 
      updateCow, 
      deleteCow, 
      updateCowsLot, 
      addBirth,
      replaceCows,
      replaceBirths
    }}>
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
