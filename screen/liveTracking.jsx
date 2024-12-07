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

const LiveTracking = ({ navigation, route }) => {
  const mapRef = useRef();
  const { selectedTransaction, userLocation } = useSmokeContext();
  const { getTransaction } = useCrudTransaction();
  const [transaction, setTransaction] = useState();
  const [region, setRegion] = useState({
    latitude: userLocation.latitude,
    longitude: userLocation.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.03,
  });
  useEffect(() => {
    getTransaction(selectedTransaction.id, setTransaction);
  }, []);

  const jumpToMarker = (coords) => {
    mapRef.current?.animateToRegion(
      { ...coords, latitudeDelta: 0.009, longitudeDelta: 0.009 },
      1000
    );
  };

  const { onlineUsers } = useAddOnline();
  const matchedUser = onlineUsers.find(
    (user) => user.currentUser.id === transaction.rider.id
  );

  useEffect(() => {
    if (matchedUser) {
      jumpToMarker({
        latitude: matchedUser.latitude,
        longitude: matchedUser.longitude,
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

  return (
    <View style={styles.container}>
      <StatusBar translucent style="dark" />

      <MapView
        customMapStyle={retroMapStyle}
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        initialRegion={region}
      >
        <Marker
          onPress={() =>
            jumpToMarker({
              latitude: userLocation?.latitude,
              longitude: userLocation?.longitude,
            })
          }
          coordinate={{
            latitude: userLocation?.latitude,
            longitude: userLocation?.longitude,
          }}
          title="Current Location"
          description="This is where you are"
          pinColor={"#B80B00"}
        />
        <Marker
          children={<MarkerRider />}
          onPress={() =>
            jumpToMarker({
              latitude: matchedUser?.latitude,
              longitude: matchedUser?.longitude,
            })
          }
          coordinate={{
            latitude: matchedUser?.latitude || 0, // Fallback to 0 if undefined
            longitude: matchedUser?.longitude || 0, // Fallback to 0 if undefined
          }}
          title="Rider"
          description={
            transaction?.rider?.firstName + " " + transaction?.rider?.lastName
          }
          pinColor={"#B80B00"}
        ></Marker>
        <MapViewDirections
          strokeWidth={4}
          strokeColor="#FFC30E"
          origin={{
            latitude: userLocation?.latitude,
            longitude: userLocation?.longitude,
          }}
          destination={{
            latitude: matchedUser?.latitude,
            longitude: matchedUser?.longitude,
          }}
          apikey={"AIzaSyDJ92GRaQrePL4SXQEXF0qNVdAsbVhseYI"}
        />
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
              navigation.pop(2);
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
    </View>
  );
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
