import { StatusBar } from "expo-status-bar";
import {
  Image,
  Text,
  TextInput,
  View,
  BackHandler,
  AppState,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Constants from "expo-constants";

import MapView, { Marker } from "react-native-maps";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";
import Button from "../components/button";
import BottomModal from "../components/bottomModal";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { useSmokeContext } from "../utils/appContext";
import redMarker from "../assets/red-marker.png";
import blueMarker from "../assets/blue-marker.png";
import MapViewDirections from "react-native-maps-directions";
import haversineDistance from "../utils/calculateDistance";
import Toast from "react-native-toast-message";
import LottieView from "lottie-react-native";
import useCrudTransaction from "../hooks/useCrudTransaction";
import useAddOnline from "../hooks/useAddOnline";

import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import ScreenModal from "../components/screenModal";
import AntDesign from "@expo/vector-icons/AntDesign";
import BearRiderMap from "../components/BearRiderMap";
import PickServiceContent from "../components/pickServiceContent";

const Home = ({ route, navigation }) => {
  //Other State
  const [distance, setDistance] = useState(0);
  const [appState, setAppState] = useState(AppState.currentState);
  const [watchInstance, setWatchInstance] = useState(null);

  //Boolean State
  const [isOnline, setIsOnline] = useState(false);
  const [findingRider, setFindingRider] = useState(false);

  // Modal State
  const [serviceModal, setServiceModal] = useState(false);
  const [pahatodModal, setPahatodModal] = useState(false);
  const [transactionModal, setTransactionModal] = useState(false);

  //Location State
  const [location, setLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  //Refs
  const mapRef = useRef();
  const googlePlacesRef = useRef();
  const pahatodInputRef = useRef();

  // Hooks
  const { historyModal, setHistoryModal, currentUser } = useSmokeContext();
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
  const center = {
    lat: 14.0996, // Approximate center latitude of Camarines Norte
    lng: 122.955, // Approximate center longitude of Camarines Norte
  };
  const radius = 50000;
  const chargePerKilometer = 10;
  const IS_RIDER = currentUser?.role;

  // Request Permission and Get location
  useEffect(() => {
    googlePlacesRef.current?.setAddressText("Daet Camarines Norte");
    handleLocationRequestAndPermission();
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
        // deleteOnlineUser(currentUser.id);
      }
    };
  }, []);

  useEffect(() => {
    if (selectedTransaction) {
      getTransaction(selectedTransaction.id);
    }
  }, [selectedTransaction]);

  console.log(singleData, "Lfdkl");

  //Handle when user is not on in the app

  const handleAppStateChange = (nextAppState) => {
    if (appState === "active" && nextAppState.match(/inactive|background/)) {
      // deleteTransaction(currentUser);
      setFindingRider(false);
      // deleteOnlineUser(currentUser.id);
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

  const jumpToMarker = (coords) => {
    mapRef.current?.animateToRegion(
      { ...coords, latitudeDelta: 0.009, longitudeDelta: 0.009 },
      1000
    );
  };

  const handleAddTransaction = () => {
    if (selectedLocation) {
      setFindingRider(true);
      addTransaction({
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
        serviceType: "Pahatod",
      });
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
          setPahatodModal={setPahatodModal}
          setServiceModal={setServiceModal}
        />
      </BottomModal>

      {/* Transaction Modal */}
      <ScreenModal
        modalVisible={transactionModal}
        closeModal={() => setTransactionModal(false)}
      >
        <View>
          <Text style={{ fontWeight: "bold", fontSize: 20 }}>
            Available Transaction
          </Text>
        </View>

        <ScrollView
          style={{
            flex: 1,
            width: "100%",
            minHeight: 200,
            marginTop: 30,
          }}
        >
          {transactions?.map((transaction) => {
            if (transaction.status !== "Accepted") {
              return (
                <View key={transaction.id} style={{ marginVertical: 10 }}>
                  <Text
                    style={{
                      fontSize: 15,
                      marginBottom: 5,
                      fontWeight: "bold",
                    }}
                  >
                    {transaction.currentUser.firstName}{" "}
                    {transaction.currentUser.lastName}
                  </Text>
                  <View style={{ flexDirection: "row" }}>
                    <Image
                      style={{ width: 20, height: 20, marginRight: 5 }}
                      source={redMarker}
                    />
                    <Text>{transaction.origin.address}</Text>
                  </View>
                  <View style={{ flexDirection: "row", marginTop: 5 }}>
                    <Image
                      style={{ width: 20, height: 20, marginRight: 5 }}
                      source={blueMarker}
                    />
                    <Text>{transaction.destination.address}</Text>
                  </View>
                  <Text style={{ marginVertical: 3 }}>
                    Service Type: {transaction.serviceType}{" "}
                  </Text>
                  <View
                    style={{ justifyContent: "center", alignItems: "center" }}
                  >
                    <Button
                      event={() => {
                        setSelectedTransaction(transaction);
                        setTransactionModal(false);
                      }}
                      icon="chevron-right"
                      text="View Transaction"
                      bgColor={"#B80B00"}
                    />
                  </View>
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      paddingVertical: 10,
                    }}
                  >
                    <View
                      style={{
                        width: 200,
                        height: 2,
                        backgroundColor: "gray",
                      }}
                    ></View>
                  </View>
                </View>
              );
            }
          })}
        </ScrollView>
      </ScreenModal>

      {/* History Modal */}
      <ScreenModal
        modalVisible={historyModal}
        closeModal={() => setHistoryModal(false)}
      >
        <View>
          <Text style={{ fontWeight: "bold", fontSize: 20 }}>
            Transaction History
          </Text>
        </View>
        {IS_RIDER && (
          <ScrollView
            style={{
              flex: 1,
              width: "100%",
              minHeight: 200,
              marginTop: 30,
            }}
          >
            {transactions?.map((transaction) => {
              if (
                transaction.status == "Accepted" &&
                transaction.rider.id == currentUser.id
              ) {
                return (
                  <View key={transaction.id} style={{ marginVertical: 10 }}>
                    <Text
                      style={{
                        fontSize: 15,
                        marginBottom: 5,
                        fontWeight: "bold",
                      }}
                    >
                      {transaction.currentUser.firstName}{" "}
                      {transaction.currentUser.lastName}
                    </Text>
                    <View style={{ flexDirection: "row" }}>
                      <Image
                        style={{ width: 20, height: 20, marginRight: 5 }}
                        source={redMarker}
                      />
                      <Text>{transaction.origin.address}</Text>
                    </View>
                    <View style={{ flexDirection: "row", marginTop: 5 }}>
                      <Image
                        style={{ width: 20, height: 20, marginRight: 5 }}
                        source={blueMarker}
                      />
                      <Text>{transaction.destination.address}</Text>
                    </View>
                    <Text style={{ marginVertical: 3 }}>
                      Service Type: {transaction.serviceType}{" "}
                    </Text>
                    <View
                      style={{ justifyContent: "center", alignItems: "center" }}
                    >
                      <Button
                        event={() => {
                          setSelectedTransaction(transaction);
                          setTransactionModal(false);
                          setHistoryModal(false);
                        }}
                        icon="chevron-right"
                        text="View Transaction"
                        bgColor={"#B80B00"}
                      />
                    </View>
                    <View
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        paddingVertical: 10,
                      }}
                    >
                      <View
                        style={{
                          width: 200,
                          height: 2,
                          backgroundColor: "gray",
                        }}
                      ></View>
                    </View>
                  </View>
                );
              }
            })}
          </ScrollView>
        )}

        {!IS_RIDER && (
          <ScrollView
            style={{
              flex: 1,
              width: "100%",
              minHeight: 200,
              marginTop: 30,
            }}
          >
            {transactions?.map((transaction) => {
              if (transaction.currentUser.id == currentUser.id) {
                return (
                  <View key={transaction.id} style={{ marginVertical: 10 }}>
                    <Text
                      style={{
                        fontSize: 15,
                        marginBottom: 5,
                        fontWeight: "bold",
                      }}
                    >
                      {transaction.currentUser.firstName}{" "}
                      {transaction.currentUser.lastName}
                    </Text>
                    <View style={{ flexDirection: "row" }}>
                      <Image
                        style={{ width: 20, height: 20, marginRight: 5 }}
                        source={redMarker}
                      />
                      <Text>{transaction.origin.address}</Text>
                    </View>
                    <View style={{ flexDirection: "row", marginTop: 5 }}>
                      <Image
                        style={{ width: 20, height: 20, marginRight: 5 }}
                        source={blueMarker}
                      />
                      <Text>{transaction.destination.address}</Text>
                    </View>
                    <Text style={{ marginVertical: 3 }}>
                      Service Type: {transaction.serviceType}
                    </Text>
                    <Text
                      style={{
                        marginVertical: 3,
                        color:
                          transaction.status == "Completed" ? "green" : "black",
                      }}
                    >
                      Status:{" "}
                      {transaction.status ? transaction.status : "Pending"}
                    </Text>
                    <View
                      style={{ justifyContent: "center", alignItems: "center" }}
                    >
                      {transaction.status !== "Completed" && (
                        <Button
                          event={() => {
                            setSelectedTransaction(transaction);
                            setPahatodModal(true);
                            setFindingRider(true);
                            setSelectedLocation(transaction.destination);
                            setTransactionModal(false);
                            setHistoryModal(false);
                          }}
                          icon="chevron-right"
                          text="View Transaction"
                          bgColor={"#B80B00"}
                        />
                      )}
                    </View>
                    <View
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        paddingVertical: 10,
                      }}
                    >
                      <View
                        style={{
                          width: 200,
                          height: 2,
                          backgroundColor: "gray",
                        }}
                      ></View>
                    </View>
                  </View>
                );
              }
            })}
          </ScrollView>
        )}
      </ScreenModal>

      <View style={{ flex: 1, position: "relative" }}>
        {/* Maps View */}
        {location && (
          <BearRiderMap
            location={location}
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
            selectedTransaction={selectedTransaction}
            isOnline={isOnline}
            IS_RIDER={IS_RIDER}
            pahatodInputRef={pahatodInputRef}
          />
        )}

        {/* App Header */}

        {location && (
          <>
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                flex: 1,
                width: "90%",
                marginHorizontal: 20,
                marginTop: 25,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <View
                  style={{
                    backgroundColor: "white",
                    padding: 2,
                    borderRadius: 10,
                  }}
                >
                  <Entypo
                    name="menu"
                    size={30}
                    color={IS_RIDER ? "#003082" : "#B80B00"}
                    onPress={() => {
                      navigation.openDrawer();
                    }}
                  />
                </View>
                <View
                  style={{
                    flex: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    marginHorizontal: 10,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      jumpToMarker({
                        latitude: location?.latitude,
                        longitude: location?.longitude,
                      });
                    }}
                  >
                    <Text style={{ fontSize: 12, fontWeight: "bold" }}>
                      Current Location
                    </Text>
                    <TextInput
                      editable={false}
                      value={location?.address}
                      style={{
                        backgroundColor: "white",
                        paddingVertical: 5,
                        borderRadius: 10,
                        paddingHorizontal: 5,
                      }}
                    />
                  </TouchableOpacity>
                </View>

                <View
                  style={{
                    backgroundColor: "white",
                    padding: 4,
                    borderRadius: 10,
                  }}
                >
                  {!IS_RIDER ? (
                    <FontAwesome
                      onPress={() => navigation.navigate("Notification")}
                      name="bell"
                      size={25}
                      color={"#B80B00"}
                    />
                  ) : (
                    <FontAwesome5
                      onPress={() => setIsOnline(!isOnline)}
                      name="power-off"
                      size={24}
                      color="#003082"
                    />
                  )}
                </View>
              </View>

              {IS_RIDER && (
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                    backgroundColor: "white",
                    marginTop: 10,
                    paddingVertical: 6,
                    borderRadius: 10,
                    marginHorizontal: 70,
                  }}
                >
                  <Text style={{ fontSize: 15, marginRight: 5 }}>
                    {isOnline ? "You're online" : "You're Offline"}
                  </Text>
                  <View
                    style={{
                      height: 15,
                      borderRadius: 300,
                      width: 15,
                      backgroundColor: isOnline ? "#08B783" : "#B80B00",
                    }}
                  ></View>
                </View>
              )}
            </View>
          </>
        )}

        {/* Pick a service Button Customer*/}
        {!pahatodModal && !IS_RIDER && (
          <View
            style={{
              backgroundColor: "#fefefe",
              height: 170,
              position: "absolute",
              bottom: 0,
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              borderTopLeftRadius: 50,
              borderTopRightRadius: 50,
            }}
          >
            <View
              style={{
                height: 6,
                width: 150,
                backgroundColor: "black",
                marginTop: 20,
                marginBottom: 30,
                borderRadius: 20,
              }}
            ></View>
            <View
              style={{
                marginVertical: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 20, marginBottom: 10 }}>
                Choose a Service
              </Text>
              <Button
                event={() => setServiceModal(true)}
                text="Book"
                bgColor={"#B80B00"}
              />
            </View>
          </View>
        )}

        {/* Rider bottom navigation */}

        {singleData && IS_RIDER && (
          <View
            style={{
              position: "absolute",
              backgroundColor: "white",
              bottom: 130,
              flex: 1,
              marginHorizontal: 20,
              minHeight: 50,
              width: "90%",
              paddingHorizontal: 20,
              paddingVertical: 20,
              borderRadius: 10,
            }}
          >
            <View>
              <Image
                style={{ width: 50, height: 50 }}
                source={{
                  uri: singleData?.currentUser.profilePic,
                }}
              />
              <Text style={{ fontSize: 15 }}>
                {singleData?.currentUser.firstName}{" "}
                {singleData?.currentUser.lastName}
              </Text>
              <View
                style={{
                  width: 100,
                  height: 2,
                  backgroundColor: "gray",
                  marginVertical: 4,
                }}
              ></View>
            </View>
            <View
              style={{
                borderRadius: 10,
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <View>
                <Text>Service Type: {singleData?.serviceType}</Text>
                <Text>Distance: {singleData?.distance} km</Text>
              </View>
              <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                Price: ₱{(singleData?.distance * chargePerKilometer).toFixed(2)}
              </Text>
            </View>
          </View>
        )}

        {IS_RIDER && (
          <View
            style={{
              position: "absolute",
              backgroundColor: "white",
              bottom: 20,
              flex: 1,
              marginHorizontal: 20,
              minHeight: 50,
              width: "90%",
              borderRadius: 10,
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "row",
              paddingHorizontal: 20,
              paddingVertical: 20,
            }}
          >
            {isOnline ? (
              <>
                {singleData ? (
                  <>
                    {singleData?.status == "Accepted" ? (
                      <>
                        <View
                          style={{
                            width: "100%",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <TouchableOpacity
                            style={{
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Button
                              event={() => {
                                setSelectedTransaction(null);
                                setSingleData(null);
                              }}
                              text="Close Modal"
                              bgColor={"#B80B00"}
                            />
                          </TouchableOpacity>
                        </View>
                      </>
                    ) : (
                      <>
                        <View
                          style={{
                            width: "50%",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <TouchableOpacity
                            onPress={() => {
                              setSelectedTransaction(null);
                              setSingleData(null);
                            }}
                            style={{
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <AntDesign
                              name="closecircle"
                              size={24}
                              color="red"
                            />
                            <Text style={{ fontSize: 10 }}>Reject Ride</Text>
                          </TouchableOpacity>
                        </View>

                        <View
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                            width: "50%",
                          }}
                        >
                          <TouchableOpacity
                            style={{
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                            onPress={() => {
                              acceptTransaction(
                                selectedTransaction,
                                currentUser
                              );
                            }}
                          >
                            <AntDesign
                              name="checkcircle"
                              size={24}
                              color="green"
                            />
                            <Text style={{ fontSize: 10 }}>Accept Ride</Text>
                          </TouchableOpacity>
                        </View>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <View
                      style={{
                        width: "33%",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => setTransactionModal(true)}
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FontAwesome
                          name="motorcycle"
                          size={30}
                          color="#003082"
                        />
                        <Text style={{ fontSize: 10 }}>Transaction</Text>
                      </TouchableOpacity>
                    </View>
                    <View
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        width: "33%",
                      }}
                    >
                      <FontAwesome name="bolt" size={30} color="#003082" />
                      <Text style={{ fontSize: 10 }}>Auto Accept</Text>
                    </View>
                    <View
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        width: "33%",
                      }}
                    >
                      <FontAwesome name="user" size={30} color="#003082" />
                      <Text style={{ fontSize: 10 }}>My Account</Text>
                    </View>
                  </>
                )}
              </>
            ) : (
              <>
                <Text style={{ fontSize: 13, textAlign: "center" }}>
                  You're offline, please turn the power button 🔴
                </Text>
              </>
            )}
          </View>
        )}

        {/* Pahatod UI Customer POV */}

        {pahatodModal && (
          <>
            <View
              style={{
                justifyContent: "flex-start",
                alignItems: "center",
                padding: 20,
                flex: 1,
                position: "absolute",
                bottom: 0,
                width: "100%",
                backgroundColor: "white",
                borderTopLeftRadius: 50,
                borderTopRightRadius: 50,
                paddingVertical: 30,
              }}
            >
              <Text
                style={{
                  fontSize: 25,
                  marginBottom: 10,
                  color: "black",
                  fontWeight: "bold",
                  marginBottom: 15,
                }}
              >
                Pahatod Service
              </Text>
              {!findingRider && (
                <>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.8,
                      shadowRadius: 2,
                      elevation: 3,
                      paddingHorizontal: 10,
                      backgroundColor: "#D3D3D3",
                      borderRadius: 10,
                      marginBottom: 20,
                    }}
                  >
                    <Image source={redMarker} />
                    <TextInput
                      editable={false}
                      onChangeText={(text) => setEmail(text)}
                      placeholder={location?.address}
                      style={{
                        flex: 1,
                        paddingVertical: 15,
                        paddingHorizontal: 10,
                      }}
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.8,
                      shadowRadius: 2,
                      elevation: 3,
                      paddingHorizontal: 10,
                      backgroundColor: "white",
                      borderRadius: 10,
                    }}
                  >
                    <GooglePlacesAutocomplete
                      ref={pahatodInputRef}
                      enablePoweredByContainer={false}
                      renderLeftButton={() => {
                        return <Image source={blueMarker} />;
                      }}
                      styles={{
                        textInputContainer: {
                          justifyContent: "center",
                          alignItems: "center",
                          width: "100%",
                          paddingVertical: 3,
                        },
                        textInput: { marginHorizontal: 10 },
                      }}
                      placeholder="Drop Off"
                      onPress={async (data, details = null) => {
                        const lat = details?.geometry?.location.lat;
                        const lng = details?.geometry?.location.lng;
                        const address = await reverseGeocode(lat, lng);

                        jumpToMarker({
                          longitude: lng,
                          latitude: lat,
                        });
                        setSelectedLocation({
                          latitude: lat,
                          longitude: lng,
                          address,
                        });
                      }}
                      fetchDetails={true}
                      GooglePlacesDetailsQuery={{ fields: "geometry" }}
                      query={{
                        key: "AIzaSyDJ92GRaQrePL4SXQEXF0qNVdAsbVhseYI",
                        language: "en",
                        components: "country:ph",
                      }}
                    />
                  </View>

                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "row",
                      marginLeft: 20,
                    }}
                  >
                    <Button
                      event={() => {
                        setPahatodModal(false);
                        setSelectedLocation(null);
                      }}
                      width={150}
                      style={{ marginTop: 20 }}
                      text="Cancel"
                      bgColor={"#00308299"}
                    />
                    <Button
                      event={handleAddTransaction}
                      width={150}
                      style={{ marginTop: 20 }}
                      text="Find a rider"
                      bgColor={"#B80B00"}
                    />
                  </View>
                </>
              )}
              {findingRider && (
                <>
                  {singleData?.status !== "Accepted" && (
                    <>
                      <LottieView
                        autoPlay
                        style={{ width: 100, height: 100 }}
                        source={require("../assets/maps.json")}
                      />

                      <Text
                        style={{
                          color: "black",
                          fontSize: 16,
                          marginBottom: 5,
                          textAlign: "center",
                        }}
                      >
                        Waiting for a rider
                      </Text>
                    </>
                  )}

                  {singleData && singleData?.status == "Accepted" && (
                    <>
                      <View style={{ width: "100%" }}>
                        <Image
                          style={{ width: 50, height: 50 }}
                          source={{ uri: singleData?.rider.profilePic }}
                        />
                        <Text style={{ fontSize: 15 }}>
                          {singleData?.rider.firstName}{" "}
                          {singleData.rider.lastName}
                        </Text>
                      </View>
                    </>
                  )}

                  <View
                    style={{
                      width: "100%",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingVertical: 10,
                    }}
                  >
                    {location && selectedLocation && (
                      <Text
                        style={{
                          color: "black",
                          fontSize: 12,
                        }}
                      >
                        Destination Distance: {distance} km
                      </Text>
                    )}
                    <Text
                      style={{
                        color: "black",
                        fontWeight: "bold",
                        fontSize: 20,
                      }}
                    >
                      Total: ₱{(distance * chargePerKilometer).toFixed(2)}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row" }}>
                    <Button
                      width={150}
                      event={() => {
                        setFindingRider(false);
                        setPahatodModal(false);
                        setSelectedLocation(null);
                        setSelectedTransaction(null);
                        setSingleData(null);
                        // deleteTransaction(currentUser);
                      }}
                      text="Close Modal"
                      bgColor={"#00308299"}
                    />
                    {singleData?.status == "Accepted" ? (
                      <Button
                        width={150}
                        event={() => {
                          setFindingRider(false);
                          setPahatodModal(false);
                          setSelectedLocation(null);
                          setSelectedTransaction(null);
                          setSingleData(null);
                          completeTransaction(singleData);
                        }}
                        text="Complete Ride"
                        bgColor={"green"}
                      />
                    ) : (
                      <Button
                        width={150}
                        event={() => {
                          setFindingRider(false);
                          setPahatodModal(false);
                          setSelectedLocation(null);
                          deleteTransaction(singleData);
                          setSelectedTransaction(null);
                        }}
                        text="Cancel Ride"
                        bgColor={"#B80B00"}
                      />
                    )}
                  </View>
                </>
              )}
            </View>
          </>
        )}
      </View>
    </View>
  );
};

export default Home;
