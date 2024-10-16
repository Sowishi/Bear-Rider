import { StatusBar } from "expo-status-bar";
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

const Home = ({ route, navigation }) => {
  //Other State
  const [distance, setDistance] = useState(0);
  const [appState, setAppState] = useState(AppState.currentState);
  const [watchInstance, setWatchInstance] = useState(null);
  const [deliveryNotes, setDeliveryNotes] = useState([]);

  //Boolean State
  const [isOnline, setIsOnline] = useState(false);
  const [findingRider, setFindingRider] = useState(false);

  // Modal State
  const [serviceModal, setServiceModal] = useState(false);
  const [pahatodModal, setPahatodModal] = useState(false);
  const [serviceType, setServiceType] = useState(null);
  const [transactionModal, setTransactionModal] = useState(false);
  const [notificationModal, setNotificationModal] = useState(false);
  const [transactionRemarksModal, setTransactionRemarksModal] = useState(false);
  const [transactionDetailsModal, setTransactionDetailsModal] = useState(false);
  const [viewTransactionModal, setViewTransactionModal] = useState(false);
  //Location State
  const [location, setLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  //Refs
  const mapRef = useRef();
  const googlePlacesRef = useRef();
  const pahatodInputRef = useRef();

  // Hooks
  const { historyModal, setHistoryModal, currentUser, setTransactionCount } =
    useSmokeContext();
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

  // Request Permission and Get location
  useEffect(() => {
    googlePlacesRef.current?.setAddressText("Daet Camarines Norte");
    handleLocationRequestAndPermission();

    if (currentUser.role == "Rider") {
      if (currentUser.riderStatus == "Pending") {
        navigation.navigate("RiderPending");
      }
    }
  }, []);

  // Handle Disable Back Button
  useEffect(() => {
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
    if (selectedLocation) {
      output = haversineDistance(location, selectedLocation);
    }
    setDistance(output);
  }, [selectedLocation]);

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
    setTransactionCount(filter.length);
  }, [transactions]);

  //Handle when user is not on in the app

  const handleAppStateChange = (nextAppState) => {
    if (appState === "active" && nextAppState.match(/inactive|background/)) {
      // deleteTransaction(currentUser);
      setFindingRider(false);
      deleteOnlineUser(currentUser.id);
      if (watchInstance) {
        watchInstance.remove();
      }
    }

    setAppState(nextAppState); // Update the current state
  };

  const handleLocationRequestAndPermission = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});

    const lat = location?.coords.latitude;
    const long = location?.coords.longitude;

    const address = await reverseGeocode(lat, long);

    setLocation({ latitude: lat, longitude: long, address });
  };

  const handleAddTransaction = async () => {
    if (selectedLocation) {
      const transaction = {
        origin: {
          latitude: location?.latitude,
          longitude: location?.longitude,
          address: location?.address,
        },
        destination: {
          latitude: selectedLocation?.latitude,
          longitude: selectedLocation?.longitude,
          address: selectedLocation?.address,
        },
        currentUser: currentUser,
        distance,
        serviceType: serviceType,
        totalPrice: distance * chargePerKilometer + baseFare,
        deliveryNotes,
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

  //Components
  const reverseGeocode = async (latitude, longitude) => {
    try {
      const geocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      if (geocode.length > 0) {
        const address = `${geocode[0].street}, ${geocode[0].city}, ${geocode[0].region}, ${geocode[0].postalCode}, ${geocode[0].country}`;
        return address;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  return (
    <View
      style={{
        flex: 1,
        marginTop: Constants.statusBarHeight,
        backgroundColor: "#FAF5FC",
      }}
    >
      <StatusBar backgroundColor={"white"} style="dark" />

      {/* Pick a service Modal */}

      <BottomModal
        heightPx={270}
        modalVisible={serviceModal}
        closeModal={() => setServiceModal(false)}
      >
        <PickServiceContent
          setServiceType={setServiceType}
          setPahatodModal={setPahatodModal}
          setServiceModal={setServiceModal}
        />
      </BottomModal>

      {/* Transaction Remarks Modal */}

      <BottomModal
        heightPx={500}
        modalVisible={transactionRemarksModal}
        closeModal={() => setTransactionRemarksModal(false)}
      >
        <OrderNotes
          handleAddTransaction={handleAddTransaction}
          setTransactionRemarksModal={setTransactionRemarksModal}
          deliveryNotes={deliveryNotes}
          setDeliveryNotes={setDeliveryNotes}
          serviceType={serviceType}
        />
      </BottomModal>

      {/* Transaction Remarks Details */}

      <BottomModal
        heightPx={700}
        modalVisible={transactionDetailsModal}
        closeModal={() => setTransactionDetailsModal(false)}
      >
        {singleData && (
          <OrderNotes
            singleData={singleData}
            IS_RIDER={IS_RIDER}
            handleAddTransaction={handleAddTransaction}
            setTransactionDetailsModal={setTransactionDetailsModal}
            setTransactionRemarksModal={setTransactionRemarksModal}
            deliveryNotes={singleData.deliveryNotes}
            setDeliveryNotes={setDeliveryNotes}
            serviceType={serviceType}
            viewOnly={true}
            navigataion={navigation}
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

      <View style={{ flex: 1, position: "relative" }}>
        {/* Maps View */}
        {location && (
          <BearRiderMap
            mapRef={mapRef}
            location={location}
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
            selectedTransaction={selectedTransaction}
            isOnline={isOnline}
            IS_RIDER={IS_RIDER}
            singleData={singleData}
            pahatodInputRef={pahatodInputRef}
          />
        )}

        {/* App Header */}

        {location && (
          <MapHeader
            IS_RIDER={IS_RIDER}
            location={location}
            mapRef={mapRef}
            navigation={navigation}
            isOnline={isOnline}
            setIsOnline={setIsOnline}
            setNoficationModal={setNotificationModal}
          />
        )}

        {/* Pick a service Button Customer*/}
        {!pahatodModal && !IS_RIDER && (
          <PickServiceButton setServiceModal={setServiceModal} />
        )}
        {/* Rider Accepeted View */}

        {singleData && IS_RIDER && (
          <BottomModal
            modalVisible={viewTransactionModal}
            closeModal={() => setViewTransactionModal(false)}
          >
            <RiderAcceptedView
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
            baseFare={baseFare}
          />
        )}
      </View>
    </View>
  );
};

export default Home;
