import React, { createContext, useContext, useState } from "react";

const MyContext = createContext();

export const MyProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [mapView, setMapView] = useState("standard");
  const [historyModal, setHistoryModal] = useState(false);

  return (
    <MyContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        mapView,
        setMapView,
        historyModal,
        setHistoryModal,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};

export const useSmokeContext = () => {
  return useContext(MyContext);
};
