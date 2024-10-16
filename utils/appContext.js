import React, { createContext, useContext, useState } from "react";

const MyContext = createContext();

export const MyProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [mapView, setMapView] = useState("standard");
  const [historyModal, setHistoryModal] = useState(false);
  const [transactionCount, setTransactionCount] = useState(0);
  const [frontLicense, setFrontLicense] = useState();
  const [backLicense, setBackLicense] = useState();
  const [selfie, setSelfie] = useState();
  const [OR, setOR] = useState();
  const [CR, setCR] = useState();
  const [clearance, setClearance] = useState();
  const [proofOfPurchase, setProofOfPurchase] = useState();

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
        frontLicense,
        setFrontLicense,
        selfie,
        setSelfie,
        backLicense,
        setBackLicense,
        OR,
        setOR,
        CR,
        setCR,
        clearance,
        setClearance,
        proofOfPurchase,
        setProofOfPurchase,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};

export const useSmokeContext = () => {
  return useContext(MyContext);
};
