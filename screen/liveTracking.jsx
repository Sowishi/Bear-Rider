import LottieView from "lottie-react-native";
import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Text, Button, Alert, Image } from "react-native";
import MapView, { Marker } from "react-native-maps";
import maps from "../assets/riding.json";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import * as Location from "expo-location";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";
import { TouchableOpacity } from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import { useSmokeContext } from "../utils/appContext";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { set } from "firebase/database";
import SearchLocation from "./serachLocation";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { retroMapStyle } from "../utils/retroMapStyle";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { StatusBar } from "expo-status-bar";
import useCrudTransaction from "../hooks/useCrudTransaction";
import useAddOnline from "../hooks/useAddOnline";
import MapViewDirections from "react-native-maps-directions";
import { FontAwesome } from "@expo/vector-icons";

const LiveTracking = ({ navigation, route }) => {
  const mapRef = useRef();
  const { selectedTransaction, userLocation, currentUser } = useSmokeContext();
  const {
    getTransaction,
    markTransit,
    markNearby,
    confirmPickup,
    confirmDropOff,
  } = useCrudTransaction();
  const [transaction, setTransaction] = useState();
  const [region, setRegion] = useState({
    latitude: userLocation?.latitude,
    longitude: userLocation?.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.03,
  });
  useEffect(() => {
    getTransaction(selectedTransaction.id, setTransaction);
  }, []);

  const jumpToMarker = (coords) => {
    mapRef.current?.animateToRegion(
      { ...coords, latitudeDelta: 0.001, longitudeDelta: 0.001 },
      1000
    );
  };

  const { onlineUsers } = useAddOnline();
  const matchedRider = onlineUsers.find(
    (user) => user.currentUser.id === transaction.rider.id
  );
  const matchedUser = onlineUsers.find(
    (user) => user.currentUser.id === transaction.currentUser.id
  );

  useEffect(() => {
    if (matchedRider) {
      jumpToMarker({
        latitude: matchedRider.latitude,
        longitude: matchedRider.longitude,
      });
    }
  }, []);

  const MarkerRider = () => {
    return (
      <LottieView
        source={require("../assets/riding.json")}
        autoPlay
        style={{ width: 70, height: 70 }}
      />
    );
  };

  const MarkerUser = () => {
    return (
      <Image
        source={require("../assets/user.png")}
        autoPlay
        style={{ width: 50, height: 50 }}
      />
    );
  };

  const isRider = currentUser?.role === "Rider";

  const getTransactionStatusLabel = (status) => {
    if (status === "Accepted") {
      return isRider
        ? {
            title: "Transaction Accepted",
            sub: "You have accepted the transaction",
          }
        : {
            title: "Processing",
            sub: "Your rider is processing your transaction",
          };
    }
    if (status === "Transit") {
      return isRider
        ? {
            title: "In Transit",
            sub: "You are on your way to the customer",
          }
        : {
            title: "In Transit",
            sub: "Your rider is on the way",
          };
    }
    if (status === "Nearby") {
      return isRider
        ? {
            title: "Near Destination",
            sub: "You are close to the customer's location",
          }
        : {
            title: "Rider is Near",
            sub: "Waiting for you",
          };
    }
    if (status === "Pickup") {
      return isRider
        ? {
            title: "Pickup Confirmed",
            sub: "You have picked up the order",
          }
        : {
            title: "Confirmed Pickup",
            sub: "You are now with your rider",
          };
    }
    if (status === "DropOff") {
      return isRider
        ? {
            title: "Drop-Off Complete",
            sub: "You have drop off the customer",
          }
        : {
            title: "Confirmed Drop-Off",
            sub: "Your are now in your destination",
          };
    }
    if (status === "Complete") {
      return isRider
        ? {
            title: "Transaction Complete",
            sub: "You have successfully completed the delivery",
          }
        : {
            title: "Transaction Complete",
            sub: "The transaction is complete",
          };
    }

    // Default case for unmatched or undefined statuses
    return {
      title: "Unknown Status",
      sub: "Status is undefined or invalid",
    };
  };

  if (currentUser && transaction && matchedRider) {
    return (
      <View style={styles.container}>
        <StatusBar translucent style="dark" />

        <MapView
          customMapStyle={retroMapStyle}
          ref={mapRef}
          style={StyleSheet.absoluteFillObject}
          initialRegion={region}
        >
          <>
            {/* Customer Location */}
            <Marker
              children={<MarkerUser />}
              onPress={() =>
                jumpToMarker({
                  latitude: matchedUser?.latitude,
                  longitude: matchedUser?.longitude,
                })
              }
              coordinate={{
                latitude: matchedUser?.latitude,
                longitude: matchedUser?.longitude,
              }}
              title="Customer Location"
              description={
                transaction?.currentUser?.firstName +
                " " +
                transaction?.currentUser?.lastName
              }
              pinColor={"#B80B00"}
            />

            {/* Customer Destination */}
            <Marker
              onPress={() =>
                jumpToMarker({
                  latitude: transaction.destination?.latitude,
                  longitude: transaction.destination?.longitude,
                })
              }
              coordinate={{
                latitude: transaction.destination?.latitude,
                longitude: transaction.destination?.longitude,
              }}
              title="Destination"
              pinColor={"#003082"}
            />

            {/* Rider Location */}
            <Marker
              children={<MarkerRider />}
              onPress={() =>
                jumpToMarker({
                  latitude: matchedRider?.latitude,
                  longitude: matchedRider?.longitude,
                })
              }
              coordinate={{
                latitude: matchedRider?.latitude, // Fallback to 0 if undefined
                longitude: matchedRider?.longitude, // Fallback to 0 if undefined
              }}
              title="Rider"
              description={
                transaction?.rider?.firstName +
                " " +
                transaction?.rider?.lastName
              }
              pinColor={"#B80B00"}
            ></Marker>

            {/* Rider to Customer */}
            {matchedRider && matchedUser && (
              <MapViewDirections
                strokeWidth={4}
                strokeColor="#FFC30E"
                origin={{
                  latitude: matchedUser?.latitude,
                  longitude: matchedUser?.longitude,
                }}
                destination={{
                  latitude: matchedRider?.latitude,
                  longitude: matchedRider?.longitude,
                }}
                apikey={"AIzaSyDJ92GRaQrePL4SXQEXF0qNVdAsbVhseYI"}
              />
            )}

            {matchedRider && matchedUser && (
              <MapViewDirections
                strokeWidth={4}
                strokeColor="#003082"
                origin={
                  isRider
                    ? {
                        latitude: matchedRider?.latitude,
                        longitude: matchedRider?.longitude,
                      }
                    : {
                        latitude: matchedUser?.latitude,
                        longitude: matchedUser?.longitude,
                      }
                }
                destination={{
                  latitude: transaction.destination?.latitude,
                  longitude: transaction.destination?.longitude,
                }}
                apikey={"AIzaSyDJ92GRaQrePL4SXQEXF0qNVdAsbVhseYI"}
              />
            )}
          </>
        </MapView>

        <View style={{ position: "absolute", top: 50, width: "100%" }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              width: "100%",
              paddingHorizontal: 20,
              flexDirection: "row",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("LiveTransaction");
              }}
              style={{
                backgroundColor: "white",
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,

                elevation: 5,
                padding: 10,
                borderRadius: 100,
              }}
            >
              <AntDesign name="arrowleft" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => refRBSheet.current.open()}
              style={{
                backgroundColor: "white",
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,

                elevation: 5,
                padding: 10,
                borderRadius: 100,
                marginLeft: 10,
                flex: 1,
                paddingVertical: 13,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  textAlign: "left",
                  fontWeight: "bold",
                  paddingHorizontal: 10,
                }}
              >
                Live Tracking
              </Text>
              <FontAwesome5
                name="circle"
                size={17}
                color="red"
                style={{ marginRight: 5 }}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            position: "absolute",
            bottom: 0,
            minHeight: 200,
            backgroundColor: "white",
            width: "100%",
            borderTopLeftRadius: 50,
            borderTopRightRadius: 50,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            <View style={{ padding: 20 }}>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 20,
                }}
              >
                <View
                  style={{ height: 5, width: 100, backgroundColor: "gray" }}
                ></View>
              </View>

              {!isRider && (
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 18,
                    marginBottom: 10,
                    fontWeight: "bold",
                  }}
                >
                  {getTransactionStatusLabel(transaction.status).sub}
                </Text>
              )}
              {isRider && transaction.status == "Accepted" && (
                <TouchableOpacity
                  onPress={() => {
                    markTransit(transaction.id);
                  }}
                  style={{
                    backgroundColor: "#AA2D31",
                    paddingVertical: 10,
                    borderRadius: 10,
                    marginTop: 10,
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      color: "white",
                      fontSize: 20,
                      fontWeight: "bold",
                    }}
                  >
                    START RIDE
                  </Text>
                </TouchableOpacity>
              )}
              {isRider && transaction.status === "Transit" && (
                <TouchableOpacity
                  onPress={() => {
                    markNearby(transaction.id);
                  }}
                  style={{
                    backgroundColor: "#AA2D31",
                    paddingVertical: 10,
                    borderRadius: 10,
                    marginTop: 10,
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      color: "white",
                      fontSize: 20,
                      fontWeight: "bold",
                    }}
                  >
                    MARK NEARBY
                  </Text>
                </TouchableOpacity>
              )}
              {isRider && transaction.status === "Nearby" && (
                <TouchableOpacity
                  onPress={() => {
                    confirmPickup(transaction.id);
                  }}
                  style={{
                    backgroundColor: "#AA2D31",
                    paddingVertical: 10,
                    borderRadius: 10,
                    marginTop: 10,
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      color: "white",
                      fontSize: 20,
                      fontWeight: "bold",
                    }}
                  >
                    Confirmed Pickup
                  </Text>
                </TouchableOpacity>
              )}
              {isRider && transaction.status === "Pickup" && (
                <TouchableOpacity
                  onPress={() => {
                    confirmDropOff(transaction.id);
                  }}
                  style={{
                    backgroundColor: "#AA2D31",
                    paddingVertical: 10,
                    borderRadius: 10,
                    marginTop: 10,
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      color: "white",
                      fontSize: 20,
                      fontWeight: "bold",
                    }}
                  >
                    Confirmed Drop Off
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={() => setSelected("selectedLocation")}
                style={{
                  width: "100%",

                  marginVertical: 5,
                  paddingHorizontal: 10,
                  paddingVertical: 10,
                  borderRadius: 10,
                }}
              >
                <View
                  style={{
                    width: 300,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                >
                  <Entypo name="message" size={20} color="black" />
                  <View>
                    <Text
                      style={{
                        fontSize: 13,
                        marginLeft: 5,
                        fontWeight: "bold",
                      }}
                    >
                      Message
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setSelected("currentLocation");
                  jumpToMarker(userLocation);
                }}
                style={{
                  width: "100%",
                  paddingHorizontal: 10,
                  paddingVertical: 10,
                  borderRadius: 10,
                }}
              >
                <View
                  style={{
                    width: 300,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                >
                  <MaterialIcons name="phone" size={20} color="black" />
                  <View>
                    <Text
                      style={{
                        fontSize: 13,
                        marginLeft: 5,
                        fontWeight: "bold",
                      }}
                    >
                      Call
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  markerFixed: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: -50,
    marginTop: -80,
  },
});

export default LiveTracking;
