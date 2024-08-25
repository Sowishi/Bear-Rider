import { StatusBar } from "expo-status-bar";
import {
  Image,
  Text,
  TextInput,
  View,
  BackHandler,
  AppState,
} from "react-native";
import Constants from "expo-constants";

import MapView, { Marker } from "react-native-maps";
import { PROVIDER_GOOGLE } from "react-native-maps";
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
import people from "../assets/user.png";
const Home = ({ route, navigation }) => {
  const [location, setLocation] = useState(null);
  const [searchLocation, setSearchLocation] = useState(null);
  const [serviceModal, setServiceModal] = useState(false);
  const [pahatodModal, setPahatodModal] = useState(false);
  const [findingRider, setFindingRider] = useState(false);
  const [distance, setDistance] = useState(0);
  const [appState, setAppState] = useState(AppState.currentState);

  const mapRef = useRef();
  const googlePlacesRef = useRef();
  const pahatodInputRef = useRef();

  // Constant Value
  const center = {
    lat: 14.0996, // Approximate center latitude of Camarines Norte
    lng: 122.955, // Approximate center longitude of Camarines Norte
  };
  const radius = 50000;
  const chargePerKilometer = 10;
  const IS_RIDER = true;

  const { mapView, currentUser } = useSmokeContext();
  const { addTransaction, deleteTransaction } = useCrudTransaction();
  const { addOnlineUser, deleteOnlineUser, onlineUsers } = useAddOnline();

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
    if (searchLocation) {
      output = haversineDistance(location, searchLocation);
    }
    setDistance(output);
  }, [searchLocation]);

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
            addOnlineUser({ longitude, latitude, currentUser });
          }
        );
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

  const handleAppStateChange = (nextAppState) => {
    if (appState === "active" && nextAppState.match(/inactive|background/)) {
      deleteTransaction(currentUser);
      setFindingRider(false);
      deleteOnlineUser(currentUser.id);
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

  const MarkerUserImage = () => {
    return <Image source={people} style={{ width: 50, height: 50 }} />;
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
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text style={{ fontSize: 25, marginBottom: 10 }}>Pick a service</Text>
          <Button
            width={300}
            text="Pahatod Services"
            bgColor={"#B80B00"}
            event={() => {
              setPahatodModal(true);
              setServiceModal(false);
            }}
          />
          <Button
            width={300}
            text="Padara Services"
            bgColor={"#B80B00"}
            event={() => {
              setServiceModal(false);
            }}
          />
        </View>
      </BottomModal>

      <View style={{ flex: 1, position: "relative" }}>
        {location && (
          <MapView
            mapType={mapView}
            showsBuildings
            showsUserLocation
            ref={mapRef}
            showsTraffic={true}
            provider={PROVIDER_GOOGLE}
            showsMyLocationButton={true}
            style={{ flex: 1, minHeight: 500, minWidth: 500 }}
            initialRegion={{
              latitude: 14.0996,
              longitude: 122.955,
              latitudeDelta: 0.8,
              longitudeDelta: 0.5,
            }}
            region={{
              latitude: location?.latitude,
              longitude: location?.longitude,
              latitudeDelta: 0.009,
              longitudeDelta: 0.009,
            }}
          >
            {location && (
              <Marker
                onPress={() =>
                  jumpToMarker({
                    latitude: location?.latitude,
                    longitude: location?.longitude,
                  })
                }
                coordinate={{
                  latitude: location?.latitude,
                  longitude: location?.longitude,
                }}
                title="Current Location"
                description="This is where you are"
              />
            )}
            {searchLocation && (
              <Marker
                draggable
                onDragEnd={async (event) => {
                  const { latitude, longitude } = event.nativeEvent.coordinate;
                  const address = await reverseGeocode(latitude, longitude);
                  pahatodInputRef.current?.setAddressText(address);

                  setSearchLocation({ latitude, longitude, address });
                }}
                onPress={() =>
                  jumpToMarker({
                    latitude: searchLocation?.latitude,
                    longitude: searchLocation?.longitude,
                  })
                }
                coordinate={{
                  latitude: searchLocation?.latitude,
                  longitude: searchLocation?.longitude,
                }}
                pinColor="#003082"
                title="Selected Location"
              />
            )}

            {location && searchLocation && (
              <MapViewDirections
                strokeWidth={4}
                strokeColor="#B80B00"
                origin={{
                  latitude: location?.latitude,
                  longitude: location?.longitude,
                }}
                destination={{
                  latitude: searchLocation?.latitude,
                  longitude: searchLocation?.longitude,
                }}
                apikey={"AIzaSyDJ92GRaQrePL4SXQEXF0qNVdAsbVhseYI"}
              />
            )}

            {onlineUsers.length >= 1 && (
              <>
                {onlineUsers?.map((user) => {
                  if (user.currentUser.id !== currentUser.id) {
                    return (
                      <Marker
                        children={<MarkerUserImage />}
                        pinColor="yellow"
                        key={user.id}
                        onPress={() =>
                          jumpToMarker({
                            latitude: user.latitude,
                            longitude: user.longitude,
                          })
                        }
                        coordinate={{
                          latitude: user.latitude,
                          longitude: user.longitude,
                        }}
                        title={currentUser.firstName}
                        description="Customer"
                      />
                    );
                  }
                })}
              </>
            )}
          </MapView>
        )}

        {/* App Header */}

        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginHorizontal: 20,
            marginTop: 25,
          }}
        >
          <GooglePlacesAutocomplete
            ref={googlePlacesRef}
            renderLeftButton={() => (
              <Entypo
                name="location-pin"
                size={30}
                color="#B80B00"
                onPress={() => {
                  jumpToMarker({
                    latitude: location?.latitude,
                    longitude: location?.longitude,
                  });
                }}
              />
            )}
            renderRightButton={() => (
              <FontAwesome
                onPress={() => navigation.navigate("Notification")}
                name="bell"
                size={24}
                color="#B80B00"
              />
            )}
            styles={{
              textInputContainer: {
                justifyContent: "center",
                alignItems: "center",
              },
              textInput: { marginHorizontal: 10 },
            }}
            placeholder="Search"
            onPress={(data, details = null) => {
              const lat = details?.geometry?.location.lat;
              const lng = details?.geometry?.location.lng;
              jumpToMarker({
                longitude: lng,
                latitude: lat,
              });
              setSearchLocation({
                latitude: lat,
                longitude: lng,
              });
            }}
            fetchDetails={true}
            GooglePlacesDetailsQuery={{ fields: "geometry" }}
            query={{
              key: "AIzaSyDJ92GRaQrePL4SXQEXF0qNVdAsbVhseYI",
              language: "en",
              components: "country:ph",
              location: `${center.lat},${center.lng}`,
              radius: radius,
            }}
          />
        </View>

        {/* Pick a service Button */}
        {!pahatodModal && (
          <View
            style={{
              backgroundColor: "#fefefe99",
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
                backgroundColor: "#2099B699",
                borderTopLeftRadius: 50,
                borderTopRightRadius: 50,
                paddingVertical: 30,
              }}
            >
              <Text
                style={{
                  fontSize: 25,
                  marginBottom: 10,
                  color: "white",
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
                      onPress={(data, details = null) => {
                        const lat = details?.geometry?.location.lat;
                        const lng = details?.geometry?.location.lng;
                        jumpToMarker({
                          longitude: lng,
                          latitude: lat,
                        });
                        setSearchLocation({
                          latitude: lat,
                          longitude: lng,
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
                        setSearchLocation(null);
                      }}
                      width={150}
                      style={{ marginTop: 20 }}
                      text="Cancel"
                      bgColor={"#00308299"}
                    />
                    <Button
                      event={() => {
                        if (searchLocation) {
                          setFindingRider(true);
                          addTransaction({
                            origin: {
                              latitude: location?.latitude,
                              longitude: location?.longitude,
                            },
                            destination: {
                              latitude: searchLocation?.latitude,
                              longitude: searchLocation?.longitude,
                            },
                            currentUser: currentUser,
                            distance,
                          });
                        } else {
                          Toast.show({
                            type: "info",
                            text1: "Please select drop off location",
                          });
                        }
                      }}
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
                  <LottieView
                    autoPlay
                    style={{ width: 100, height: 100 }}
                    source={require("../assets/maps.json")}
                  />

                  <Text
                    style={{
                      color: "white",
                      fontSize: 16,
                      marginBottom: 5,
                      textAlign: "center",
                    }}
                  >
                    Waiting for a rider, don't leave the app
                  </Text>
                  <View
                    style={{
                      width: "100%",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingVertical: 10,
                    }}
                  >
                    {location && searchLocation && (
                      <Text
                        style={{
                          color: "white",
                          fontSize: 20,
                        }}
                      >
                        Distance: {distance} km
                      </Text>
                    )}
                    <Text
                      style={{
                        color: "white",
                        fontWeight: "bold",
                        fontSize: 20,
                      }}
                    >
                      Total: ₱{(distance * chargePerKilometer).toFixed(2)}
                    </Text>
                  </View>
                  <Button
                    event={() => {
                      setFindingRider(false);
                      deleteTransaction(currentUser);
                    }}
                    text="Cancel Ride"
                    bgColor={"#B80B00"}
                  />
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
