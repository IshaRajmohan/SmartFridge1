import React, { createContext, useState } from 'react';

export const FridgeContext = createContext();

export const FridgeProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  const addItem = (item) => setItems((prev) => [...prev, item]);
  const deleteItem = (id) => setItems((prev) => prev.filter((i) => i.id !== id));

  return (
    <FridgeContext.Provider value={{ items, addItem, deleteItem }}>
      {children}
    </FridgeContext.Provider>
  );
};
