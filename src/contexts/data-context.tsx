
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { type Cow, type Birth, type IATF } from '@/lib/data-schemas';

interface Data {
  cows: Cow[];
  births: Birth[];
  iatfs: IATF[];
}

interface DataContextType {
  data: Cow[];
  births: Birth[];
  iatfs: IATF[];
  addCow: (cow: Cow) => void;
  updateCow: (id: string, updatedCow: Cow) => void;
  deleteCow: (id: string) => void;
  updateCowsLot: (ids: string[], newLot: string) => void;
  addBirth: (birth: Birth) => void;
  updateBirth: (birthId: string, updatedBirth: Birth) => void;
  deleteBirth: (birthId: string) => void;
  transferBirthToCow: (birth: Birth) => void;
  updateBirthsLotAndSex: (birthIds: string[], newLot: string | undefined, newSex: 'Macho' | 'Fêmea' | 'Aborto' | 'Não Definido' | undefined) => void;
  replaceCows: (newCows: Cow[]) => void;
  replaceBirths: (newBirths: Birth[]) => void;
  addIATF: (iatf: IATF) => void;
  updateIATF: (id: string, updatedIATF: IATF) => void;
  deleteIATF: (id: string) => void;
  replaceAllData: (data: Data) => void;
}

const DATA_STORAGE_KEY = 'doisData';

const DataContext = createContext<DataContextType | undefined>(undefined);

const getInitialData = (): Data => {
  if (typeof window === 'undefined') {
    return { cows: [], births: [], iatfs: [] };
  }
  try {
    const item = window.localStorage.getItem(DATA_STORAGE_KEY);
    const data = item ? JSON.parse(item) : { cows: [], births: [], iatfs: [] };

    const birthsWithId = (data.births || []).map((b: any) => ({ // Use any to handle old data structure
      ...b,
      id: b.id || crypto.randomUUID(),
      date: b.date ? new Date(b.date) : undefined
    }));
    
    const iatfsWithId = (data.iatfs || []).map((i: any) => ({
      ...i,
      id: i.id || crypto.randomUUID(),
      inseminationDate: i.inseminationDate ? new Date(i.inseminationDate) : undefined,
      diagnosisDate: i.diagnosisDate ? new Date(i.diagnosisDate) : undefined,
    }));

    return {
      cows: data.cows || [],
      births: birthsWithId,
      iatfs: iatfsWithId
    };
  } catch (error) {
    console.warn(`Error reading localStorage key “${DATA_STORAGE_KEY}”:`, error);
    return { cows: [], births: [], iatfs: [] };
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

  const replaceAllData = (newData: Data) => {
    // Ensure dates are converted back to Date objects after parsing from JSON
    const parsedBirths = (newData.births || []).map((b: any) => ({
      ...b,
      id: b.id || crypto.randomUUID(),
      date: b.date ? new Date(b.date) : undefined,
    }));
    const parsedIatfs = (newData.iatfs || []).map((i: any) => ({
      ...i,
      id: i.id || crypto.randomUUID(),
      inseminationDate: i.inseminationDate ? new Date(i.inseminationDate) : undefined,
      diagnosisDate: i.diagnosisDate ? new Date(i.diagnosisDate) : undefined,
    }));
    setData({
      cows: newData.cows || [],
      births: parsedBirths,
      iatfs: parsedIatfs,
    });
  };


  const addCow = (cow: Cow) => {
    setData((prevData) => {
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
        const newBirth = { ...birth, id: birth.id || crypto.randomUUID() };

        // Avoid adding duplicates based on cowId and date if date exists
        const birthExists = prevData.births.some(b => 
            b.cowId.trim().toLowerCase() === newBirth.cowId.trim().toLowerCase() && 
            b.date && newBirth.date &&
            new Date(b.date).getTime() === new Date(newBirth.date).getTime()
        );
        if (newBirth.date && birthExists) {
            return prevData;
        }

        return {
            ...prevData,
            births: [...prevData.births, newBirth],
        };
    });
  };

  const updateBirth = (birthId: string, updatedBirth: Birth) => {
      setData(prevData => ({
          ...prevData,
          births: prevData.births.map(b => (b.id === birthId ? { ...b, ...updatedBirth } : b)),
      }));
  };

  const deleteBirth = (birthId: string) => {
      setData(prevData => ({
          ...prevData,
          births: prevData.births.filter(b => b.id !== birthId),
      }));
  };
  
  const transferBirthToCow = (birth: Birth) => {
    setData(prevData => {
      if (!birth.id) return prevData;
      
      const animalSexName = birth.sex === 'Macho' ? 'Bezerro' : 'Bezerra';
      const newCowId = `${animalSexName.toUpperCase()} DA ${birth.cowId}`;

      const newCow: Cow = {
        id: newCowId, 
        animal: animalSexName,
        origem: "Nascimento",
        farm: birth.farm || '',
        lot: birth.lot || '',
        location: birth.location || '',
        status: "Vazia",
        registrationStatus: "Ativo",
      };
      
      const newCows = [...prevData.cows, newCow];
      const newBirths = prevData.births.filter(b => b.id !== birth.id);

      return {
        ...prevData,
        cows: newCows,
        births: newBirths,
      };
    });
  };

  const updateBirthsLotAndSex = (birthIds: string[], newLot: string | undefined, newSex: 'Macho' | 'Fêmea' | 'Aborto' | 'Não Definido' | undefined) => {
    setData(prevData => ({
        ...prevData,
        births: prevData.births.map(birth => {
            if (birth.id && birthIds.includes(birth.id)) {
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
    const birthsWithIds = newBirths.map(b => ({
      ...b,
      id: b.id || crypto.randomUUID(),
      date: b.date ? new Date(b.date) : undefined
    }));
    setData(prevData => ({
      ...prevData,
      births: birthsWithIds,
    }));
  };

  const addIATF = (iatf: IATF) => {
    setData(prevData => {
      const newIATF = { ...iatf, id: iatf.id || crypto.randomUUID() };
      return {
        ...prevData,
        iatfs: [...prevData.iatfs, newIATF],
      };
    });
  };

  const updateIATF = (id: string, updatedIATF: IATF) => {
    setData(prevData => ({
      ...prevData,
      iatfs: prevData.iatfs.map(i => (i.id === id ? { ...i, ...updatedIATF } : i)),
    }));
  };

  const deleteIATF = (id: string) => {
    setData(prevData => ({
      ...prevData,
      iatfs: prevData.iatfs.filter(i => i.id !== id),
    }));
  };

  return (
    <DataContext.Provider value={{ 
      data: data.cows, 
      births: data.births, 
      iatfs: data.iatfs,
      addCow, 
      updateCow, 
      deleteCow, 
      updateCowsLot, 
      addBirth,
      updateBirth,
      deleteBirth,
      transferBirthToCow,
      updateBirthsLotAndSex,
      replaceCows,
      replaceBirths,
      addIATF,
      updateIATF,
      deleteIATF,
      replaceAllData,
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
