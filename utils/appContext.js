import React, { createContext, useContext, useRef, useState } from "react";

const MyContext = createContext();

export const MyProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [mapView, setMapView] = useState("standard");
  const [historyModal, setHistoryModal] = useState(false);
  const [walletModal, setWalletModal] = useState(false);
  const [conversationModal, setConversationModal] = useState(false);
  const [transactionCount, setTransactionCount] = useState(0);
  const [frontLicense, setFrontLicense] = useState();
  const [backLicense, setBackLicense] = useState();
  const [selfie, setSelfie] = useState();
  const [OR, setOR] = useState();
  const [CR, setCR] = useState();
  const [clearance, setClearance] = useState();
  const [proof, setProof] = useState();
  const [viewDirection, setViewDirection] = useState(false);
  const [messageInfo, setMessageInfo] = useState({
    receiver: "",
    sender: "",
  });
  const [bookLocation, setBookLocation] = useState();
  const [viewRiderState, setViewRiderState] = useState(false);
  const [showRiderBubble, setShowRiderBubble] = useState(false);
  const [messageUserInfo, setMessageUserInfo] = useState();
  const bookLocationRef = useRef();

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
        proof,
        setProof,
        viewDirection,
        setViewDirection,
        walletModal,
        setWalletModal,
        conversationModal,
        setConversationModal,
        messageInfo,
        setMessageInfo,
        messageUserInfo,
        setMessageUserInfo,
        bookLocation,
        setBookLocation,
        bookLocationRef,
        viewRiderState,
        setViewRiderState,
        showRiderBubble,
        setShowRiderBubble,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};

export const useSmokeContext = () => {
  return useContext(MyContext);
};
