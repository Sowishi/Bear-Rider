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
  const [proof, setProof] = useState([]);
  const [viewDirection, setViewDirection] = useState(false);
  const [messageInfo, setMessageInfo] = useState({
    receiver: "",
    sender: "",
  });

  const [viewRiderState, setViewRiderState] = useState(false);
  const [showRiderBubble, setShowRiderBubble] = useState(false);
  const [messageUserInfo, setMessageUserInfo] = useState();
  const [showSelectedLocation, setShowSelectedLocation] = useState(false);
  const bookLocationRef = useRef();
  const [showBook, setShowBook] = useState(true);
  const [storeName, setStoreName] = useState("");
  const [sumModal, setSumModal] = useState(false);
  const [sumInfo, setSumInfo] = useState();

  const [bookLocation, setBookLocation] = useState();
  const [destination, setDestination] = useState();
  const [userLocation, setUserLocation] = useState();
  const [addSaveLocation, setAddSaveLocation] = useState();
  const [findingRider, setFindingRider] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [fare, setFare] = useState({});

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
        showSelectedLocation,
        setShowSelectedLocation,
        showBook,
        setShowBook,
        storeName,
        setStoreName,
        sumModal,
        setSumModal,
        setSumInfo,
        sumInfo,
        destination,
        setDestination,
        userLocation,
        setUserLocation,
        addSaveLocation,
        setAddSaveLocation,
        findingRider,
        setFindingRider,
        selectedTransaction,
        setSelectedTransaction,
        paymentMethod,
        setPaymentMethod,
        fare,
        setFare,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};

export const useSmokeContext = () => {
  return useContext(MyContext);
};
