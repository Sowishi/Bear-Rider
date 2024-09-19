import React, { createContext, useContext, useState } from "react";

const MyContext = createContext();

export const MyProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [mapView, setMapView] = useState("standard");
  const [historyModal, setHistoryModal] = useState(false);
  const [transactionCount, setTransactionCount] = useState(0);
  const [license, setLicense] = useState();
  const [selfie, setSelfie] = useState();

  return (
    <MyContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        mapView,
        setMapView,
        historyModal,
        setHistoryModal,
        transactionCount,
        setTransactionCount,
        license,
        setLicense,
        selfie,
        setSelfie,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};

export const useSmokeContext = () => {
  return useContext(MyContext);
};
