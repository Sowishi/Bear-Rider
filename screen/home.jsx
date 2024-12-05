import {
  View,
  BackHandler,
  AppState,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Constants from "expo-constants";

import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";
import BottomModal from "../components/bottomModal";
import { useSmokeContext } from "../utils/appContext";
import haversineDistance from "../utils/calculateDistance";
import Toast from "react-native-toast-message";
import useCrudTransaction from "../hooks/useCrudTransaction";
import useAddOnline from "../hooks/useAddOnline";

import ScreenModal from "../components/screenModal";
import BearRiderMap from "../components/BearRiderMap";
import PickServiceContent from "../components/pickServiceContent";
import TransactionContent from "../components/transactionContent";
import HistoryContent from "../components/historyContent";
import MapHeader from "../components/mapHeader";
import PickServiceButton from "../components/pickServiceButton";
import RiderAcceptedView from "../components/riderAcceptedView";
import RiderBottomNavigation from "../components/riderBottomNavigation";
import PahatodCustomerView from "../components/pahatodCustomerView";
import NotificationContent from "../components/notificationContent";
import OrderNotes from "../components/orderNotes";
import Wallet from "./wallet";
import Message from "../components/message";
import ConversationList from "../components/conversation";
import PopupModal from "../components/popupModal";
import TransactionSummary from "../components/transactionSummary";
import { StatusBar } from "expo-status-bar";
import LottieView from "lottie-react-native";

const Home = ({ route, navigation }) => {
  //Other State
  const [distance, setDistance] = useState(0);
  const [appState, setAppState] = useState(AppState.currentState);
  const [watchInstance, setWatchInstance] = useState(null);
  const [deliveryNotes, setDeliveryNotes] = useState([]);

  //Boolean State
  const [isOnline, setIsOnline] = useState(true);
  const [findingRider, setFindingRider] = useState(false);
  const [mapLoading, setMapLoading] = useState(false);

  // Modal State
  const [serviceModal, setServiceModal] = useState(false);
  const [pahatodModal, setPahatodModal] = useState(false);
  const [serviceType, setServiceType] = useState(null);
  const [transactionModal, setTransactionModal] = useState(false);
  const [notificationModal, setNotificationModal] = useState(false);
  const [transactionRemarksModal, setTransactionRemarksModal] = useState(false);
  const [transactionDetailsModal, setTransactionDetailsModal] = useState(false);
  const [viewTransactionModal, setViewTransactionModal] = useState(false);
  const [messageModal, setMessageModal] = useState(false);

  //Location State
  const [location, setLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  //Refs
  const mapRef = useRef();
  const googlePlacesRef = useRef();
  const pahatodInputRef = useRef();

  // Hooks
  const {
    historyModal,
    setHistoryModal,
    currentUser,
    setTransactionCount,
    setProof,
    walletModal,
    setWalletModal,
    conversationModal,
    setConversationModal,
    setMessageUserInfo,
    bookLocation,
    showBook,
    setBookLocation,
    viewRiderState,
    setViewRiderState,
    setShowBook,
    storeName,
    setSumModal,
    sumModal,
    destination,
    userLocation,
  } = useSmokeContext();
  const {
    addTransaction,
    deleteTransaction,
    data: transactions,
    acceptTransaction,
    getTransaction,
    singleData,
    setSingleData,
    completeTransaction,
  } = useCrudTransaction();
  const { addOnlineUser, deleteOnlineUser } = useAddOnline();

  // Constant Value

  const chargePerKilometer = 10;
  const baseFare = 30;
  const IS_RIDER = currentUser?.role;

  // Handle Disable Back Button
  useEffect(() => {
    setMapLoading(true);

    setTimeout(() => {
      setMapLoading(false);
    }, 3000);

    const backAction = () => {
      // Returning true prevents the default back button behavior
      return true;
    };

    // Add the back button event listener
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    // Clean up the listener on component unmount
    return () => backHandler.remove();
  }, []);

  // Calulate distance between two coords
  useEffect(() => {
    let output = 0;
    if (destination && bookLocation) {
      output = haversineDistance(bookLocation, destination);
    }
    setDistance(output);
  }, [bookLocation, destination]);

  // When app is back in home screen cancel the transaction
  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      subscription.remove(); // Cleanup listener on unmount
    };
  }, [appState]);

  //Watch user location and clean up
  useEffect(() => {
    let subscription = null;

    try {
      const startWatchingLocation = async () => {
        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 10000, // Update every 10 seconds
            distanceInterval: 1, // Update when the device has moved 1 meter
          },
          (location) => {
            const { longitude, latitude } = location.coords;
            // // For customer
            // if (IS_RIDER !== "Rider") {
            //   addOnlineUser({ longitude, latitude, currentUser });
            // }
            // //For rider
            // if (IS_RIDER && isOnline) {
            //   addOnlineUser({ longitude, latitude, currentUser });
            // }
            addOnlineUser({ longitude, latitude, currentUser });
          }
        );
        setWatchInstance(subscription);
      };
      startWatchingLocation();
    } catch (error) {
      console.log(error.message);
    }

    return () => {
      if (subscription) {
        subscription.remove();
        deleteOnlineUser(currentUser.id);
      }
    };
  }, []);

  //Watch to the transaction change data
  useEffect(() => {
    if (selectedTransaction) {
      getTransaction(selectedTransaction.id);
    }
  }, [selectedTransaction]);

  //Set the transaction count of rider

  useEffect(() => {
    const filter = transactions.filter((transaction) => {
      if (!transaction.status) {
        return transactions;
      }
    });

    console.log(transactions);
    setTransactionCount(filter.length);
  }, [transactions]);

  //Handle when user is not on in the app

  const handleAppStateChange = (nextAppState) => {
    if (appState === "active" && nextAppState.match(/inactive|background/)) {
      // deleteTransaction(currentUser);
      // setFindingRider(false);
      deleteOnlineUser(currentUser.id);
      if (watchInstance) {
        watchInstance.remove();
      }
    }

    setAppState(nextAppState); // Update the current state
  };

  const handleAddTransaction = async () => {
    if (bookLocation && destination) {
      const transaction = {
        origin: {
          latitude: bookLocation?.latitude,
          longitude: bookLocation?.longitude,
          address: bookLocation?.address,
        },
        destination: {
          latitude: destination?.latitude,
          longitude: destination?.longitude,
          address: destination?.address,
        },
        currentUser: currentUser,
        distance,
        serviceType: serviceType,
        totalPrice: distance * chargePerKilometer + baseFare,
        deliveryNotes,
        storeName,
      };
      setFindingRider(true);
      const output = await addTransaction(transaction);
      setSelectedTransaction(output);
      setTransactionRemarksModal(false);
      setDeliveryNotes([]);
    } else {
      Toast.show({
        type: "info",
        text1: "Please select drop off location",
      });
    }
  };

  return (
    <>
      {mapLoading && (
        <View
          style={{
            backgroundColor: "#00000099",
            flex: 1,
            height: "100%",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            zIndex: 9999,
          }}
        >
          <LottieView
            autoPlay
            style={{ width: 200, height: 200 }}
            source={require("../assets/maps.json")}
          />
        </View>
      )}
      <View
        style={{
          flex: 1,
          marginTop: Constants.statusBarHeight,
          backgroundColor: "#FAF5FC",
        }}
      >
        <StatusBar style="dark" translucent />

        {/* Sum Modal */}

        <BottomModal
          heightPx={700}
          modalVisible={sumModal}
          closeModal={() => setSumModal(false)}
        >
          <TransactionSummary />
        </BottomModal>
        {/* Pick a service Modal */}

        <BottomModal
          heightPx={270}
          modalVisible={serviceModal}
          closeModal={() => setServiceModal(false)}
        >
          <PickServiceContent
            setFindingRider={setFindingRider}
            setSingleData={setSingleData}
            setSelectedTransaction={setSelectedTransaction}
            setServiceType={setServiceType}
            setPahatodModal={setPahatodModal}
            setServiceModal={setServiceModal}
          />
        </BottomModal>

        {/* Transaction Remarks Modal */}

        <BottomModal
          heightPx={500}
          modalVisible={transactionRemarksModal}
          closeModal={() => {
            setTransactionRemarksModal(false);
            setProof(null);
          }}
        >
          <OrderNotes
            chargePerKilometer={chargePerKilometer}
            baseFare={baseFare}
            handleAddTransaction={handleAddTransaction}
            setTransactionRemarksModal={setTransactionRemarksModal}
            deliveryNotes={deliveryNotes}
            setDeliveryNotes={setDeliveryNotes}
            serviceType={serviceType}
            setViewTransactionModal={setViewTransactionModal}
          />
        </BottomModal>

        {/* Transaction Remarks Details */}

        <BottomModal
          heightPx={600}
          modalVisible={transactionDetailsModal}
          closeModal={() => {
            setTransactionDetailsModal(false);
            setProof(null);
          }}
        >
          {singleData && (
            <OrderNotes
              chargePerKilometer={chargePerKilometer}
              baseFare={baseFare}
              singleData={singleData}
              IS_RIDER={IS_RIDER}
              handleAddTransaction={handleAddTransaction}
              setTransactionDetailsModal={setTransactionDetailsModal}
              setTransactionRemarksModal={setTransactionRemarksModal}
              setPahatodModal={setPahatodModal}
              deliveryNotes={singleData.deliveryNotes}
              setDeliveryNotes={setDeliveryNotes}
              serviceType={serviceType}
              viewOnly={true}
              navigataion={navigation}
              setSelectedTransaction={setSelectedTransaction}
              setViewTransactionModal={setViewTransactionModal}
            />
          )}
        </BottomModal>

        {/* Transaction Modal */}
        <ScreenModal
          modalVisible={transactionModal}
          closeModal={() => setTransactionModal(false)}
        >
          <TransactionContent
            setViewTransactionModal={setViewTransactionModal}
            transactions={transactions}
            setSelectedTransaction={setSelectedTransaction}
            setTransactionModal={setTransactionModal}
          />
        </ScreenModal>

        {/* History Modal */}
        <ScreenModal
          modalVisible={historyModal}
          closeModal={() => setHistoryModal(false)}
        >
          <HistoryContent
            setSelectedLocation={setSelectedLocation}
            setFindingRider={setFindingRider}
            setPahatodModal={setPahatodModal}
            setHistoryModal={setHistoryModal}
            IS_RIDER={IS_RIDER}
            transactions={transactions}
            setSelectedTransaction={setSelectedTransaction}
            setTransactionModal={setTransactionModal}
            setViewTransactionModal={setViewTransactionModal}
          />
        </ScreenModal>

        {/* Notification Modal */}
        <ScreenModal
          modalVisible={notificationModal}
          closeModal={() => setNotificationModal(false)}
        >
          <NotificationContent />
        </ScreenModal>

        {/* Wallet Modal */}
        <ScreenModal
          modalVisible={walletModal}
          closeModal={() => setWalletModal(false)}
        >
          <Wallet />
        </ScreenModal>

        {/* Message Modal */}
        <ScreenModal
          modalVisible={messageModal}
          closeModal={() => {
            setMessageModal(false);
            setMessageUserInfo(null);
          }}
        >
          <Message
            IS_RIDER={IS_RIDER}
            singleData={singleData}
            currentUser={currentUser}
          />
        </ScreenModal>

        {/* Conversation Modal */}
        <ScreenModal
          modalVisible={conversationModal}
          closeModal={() => setConversationModal(false)}
        >
          <ConversationList
            IS_RIDER={IS_RIDER}
            setMessageModal={setMessageModal}
            currentUser={currentUser}
          />
        </ScreenModal>

        {/* {IS_RIDER && <PopupModal visible={false} />} */}

        <View style={{ flex: 1, position: "relative" }}>
          <BearRiderMap
            mapRef={mapRef}
            location={userLocation}
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
            selectedTransaction={selectedTransaction}
            isOnline={isOnline}
            IS_RIDER={IS_RIDER}
            singleData={singleData}
            pahatodInputRef={pahatodInputRef}
          />

          {/* App Header */}

          <MapHeader
            IS_RIDER={IS_RIDER}
            location={userLocation}
            mapRef={mapRef}
            navigation={navigation}
            isOnline={isOnline}
            setIsOnline={setIsOnline}
            setNoficationModal={setNotificationModal}
          />
          {/* Pick a service Button Customer*/}
          {!pahatodModal && !IS_RIDER && showBook && (
            <PickServiceButton
              setPahatodModal={setPahatodModal}
              singleData={singleData}
              setSingleData={setSingleData}
              setServiceModal={setServiceModal}
              setSelectedTransaction={setSelectedTransaction}
              setViewTransactionModal={setViewTransactionModal}
            />
          )}

          {viewRiderState && (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                position: "absolute",
                bottom: 40,
              }}
            >
              {/* View Transaction Button */}
              <TouchableOpacity
                onPress={() => {
                  setPahatodModal(true);
                  setFindingRider(true);
                }}
                style={{
                  width: 150,
                  height: 50,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 8, // Rounded corners, not circular
                  borderColor: "#003082",
                  borderWidth: 2,
                  backgroundColor: "#B80B00",
                  marginHorizontal: 10, // Spacing between buttons
                  shadowColor: "#000",
                  shadowOpacity: 0.2,
                  shadowOffset: { width: 0, height: 2 },
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 16,
                    fontWeight: "600",
                  }}
                >
                  View Transaction
                </Text>
              </TouchableOpacity>

              {/* Back Button */}
              <TouchableOpacity
                onPress={() => {
                  setSingleData(null);
                  setSelectedTransaction(null);
                  setBookLocation(null);
                  setShowBook(true);
                  setViewRiderState(false);
                }}
                style={{
                  width: 150,
                  height: 50,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 8, // Rounded corners
                  borderColor: "#003082",
                  borderWidth: 2,
                  backgroundColor: "#003082",
                  marginHorizontal: 10, // Spacing between buttons
                  shadowColor: "#000",
                  shadowOpacity: 0.2,
                  shadowOffset: { width: 0, height: 2 },
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 16,
                    fontWeight: "600",
                  }}
                >
                  Back
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Rider Accepeted View */}

          {singleData && IS_RIDER && (
            <BottomModal
              heightPx={560}
              modalVisible={viewTransactionModal}
              closeModal={() => setViewTransactionModal(false)}
            >
              <RiderAcceptedView
                setMessageModal={setMessageModal}
                location={location}
                setTransactionDetailsModal={setTransactionDetailsModal}
                setViewTransactionModal={setViewTransactionModal}
                singleData={singleData}
                chargePerKilometer={chargePerKilometer}
                baseFare={baseFare}
              />
            </BottomModal>
          )}
          {/* Rider bottom navigation */}

          {IS_RIDER && (
            <RiderBottomNavigation
              setViewTransactionModal={setViewTransactionModal}
              location={location}
              isOnline={isOnline}
              singleData={singleData}
              setTransactionModal={setTransactionModal}
              setSingleData={setSingleData}
              setSelectedTransaction={setSelectedTransaction}
              acceptTransaction={acceptTransaction}
              selectedTransaction={selectedTransaction}
            />
          )}

          {/* Pahatod UI Customer POV */}

          {pahatodModal && (
            <PahatodCustomerView
              navigation={navigation}
              serviceType={serviceType}
              location={location}
              setSelectedLocation={setSelectedLocation}
              setSelectedTransaction={setSelectedTransaction}
              selectedLocation={selectedLocation}
              findingRider={findingRider}
              setFindingRider={setFindingRider}
              pahatodInputRef={pahatodInputRef}
              handleAddTransaction={handleAddTransaction}
              setPahatodModal={setPahatodModal}
              mapRef={mapRef}
              singleData={singleData}
              distance={distance}
              chargePerKilometer={chargePerKilometer}
              setSingleData={setSingleData}
              deleteTransaction={deleteTransaction}
              completeTransaction={completeTransaction}
              currentUser={currentUser}
              setTransactionRemarksModal={setTransactionRemarksModal}
              setTransactionDetailsModal={setTransactionDetailsModal}
              setMessageModal={setMessageModal}
              baseFare={baseFare}
              IS_RIDER={IS_RIDER}
            />
          )}
        </View>
      </View>
    </>
  );
};

export default Home;
