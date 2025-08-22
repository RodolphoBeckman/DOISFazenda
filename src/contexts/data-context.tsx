
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
  updateBirth: (cowId: string, date: Date, updatedBirth: Birth) => void;
  deleteBirth: (cowId: string, date: Date) => void;
  updateBirthsLotAndSex: (birthsToUpdate: { cowId: string; date: Date }[], newLot: string | undefined, newSex: 'Macho' | 'Fêmea' | 'Aborto' | 'Não Definido' | undefined) => void;
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
      births: (data.births || []).map((b: Birth) => ({...b, date: b.date ? new Date(b.date) : undefined}))
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
        const birthExists = prevData.births.some(b => 
            b.cowId.trim().toLowerCase() === birth.cowId.trim().toLowerCase() && 
            b.date && birth.date &&
            new Date(b.date).getTime() === new Date(birth.date).getTime()
        );
        if (birthExists) {
            return prevData;
        }
        return {
            ...prevData,
            births: [...prevData.births, birth],
        };
    });
  };

  const updateBirth = (cowId: string, date: Date, updatedBirth: Birth) => {
      setData(prevData => ({
          ...prevData,
          births: prevData.births.map(b =>
              b.cowId === cowId && b.date && new Date(b.date).getTime() === new Date(date).getTime()
                  ? updatedBirth
                  : b
          ),
      }));
  };

  const deleteBirth = (cowId: string, date: Date) => {
      setData(prevData => ({
          ...prevData,
          births: prevData.births.filter(b =>
              !(b.cowId === cowId && b.date && new Date(b.date).getTime() === new Date(date).getTime())
          ),
      }));
  };

  const updateBirthsLotAndSex = (birthsToUpdate: { cowId: string; date: Date }[], newLot: string | undefined, newSex: 'Macho' | 'Fêmea' | 'Aborto' | 'Não Definido' | undefined) => {
    setData(prevData => ({
        ...prevData,
        births: prevData.births.map(birth => {
            const shouldUpdate = birthsToUpdate.some(itemToUpdate =>
                itemToUpdate.cowId === birth.cowId &&
                birth.date &&
                new Date(itemToUpdate.date).getTime() === new Date(birth.date).getTime()
            );

            if (shouldUpdate) {
                return {
                    ...birth,
                    lot: newLot !== undefined ? newLot : birth.lot,
                    sex: newSex !== undefined ? newSex : birth.sex,
                };
            }
            return birth;
        }),
    }));
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
      births: newBirths.map(b => ({...b, date: b.date ? new Date(b.date) : undefined})),
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
      updateBirth,
      deleteBirth,
      updateBirthsLotAndSex,
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
