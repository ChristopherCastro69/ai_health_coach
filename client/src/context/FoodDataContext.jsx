import React, { createContext, useContext } from "react";
import { useFoodData } from "../hooks/useFoodData";


const FoodDataContext = createContext(null);


export function FoodDataProvider({ children }) {
  const foodData = useFoodData();

  return (
    <FoodDataContext.Provider value={foodData}>
      {children}
    </FoodDataContext.Provider>
  );
}


export function useFood() {
  const context = useContext(FoodDataContext);
  if (!context) {
    throw new Error("useFood must be used within a FoodDataProvider");
  }
  return context;
}
