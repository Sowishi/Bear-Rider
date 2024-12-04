import {
  View,
  Text,
  ImageBackground,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import TypeWriter from "react-native-typewriter";
import { LinearGradient } from "expo-linear-gradient";
import bg1 from "../assets/bear1.png";
import Entypo from "@expo/vector-icons/Entypo";
import { TouchableOpacity } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import BearTypes from "../components/bearType";
import { useSmokeContext } from "../utils/appContext";
import * as Location from "expo-location";

const BearHome = ({ navigation }) => {
  const { setUserLocation, currentUser, userLocation } = useSmokeContext();
  const [refreshing, setRefreshing] = useState(false); // State for refreshing

  useEffect(() => {
    handleLocationRequestAndPermission();

    if (currentUser.role === "Rider" && currentUser.riderStatus === "Pending") {
      navigation.navigate("RiderPending");
    }
  }, []);

  const handleLocationRequestAndPermission = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const lat = location?.coords.latitude;
      const long = location?.coords.longitude;
      const address = await reverseGeocode(lat, long);

      setUserLocation({ latitude: lat, longitude: long, address });
    } catch (error) {
      console.error(error);
    }
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

  const onRefresh = async () => {
    setRefreshing(true);
    await handleLocationRequestAndPermission(); // Re-fetch location
    setRefreshing(false);
  };

  return (
    <>
      <StatusBar translucent style="light" />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={{ flex: 1 }}>
          <ImageBackground
            source={bg1}
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundPostion: "center",
            }}
          >
            <LinearGradient
              colors={["rgba(0, 0, 0, 0.6)", "rgba(0, 0, 0, 0.4)"]}
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                justifyContent: "center",
                alignItems: "center",
              }}
            />
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "flex-start",
                paddingHorizontal: 10,
              }}
            >
              <Text style={{ fontSize: 30, color: "white", fontWeight: "bol" }}>
                Bear Rider Express
              </Text>
              <Text style={{ color: "white", marginTop: 10 }}>
                "Bear Rider Express: Your Trusted Partner for Delivery and
                Transportation in Daet, Camarines Norte!"
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("drawer")}
                style={{
                  backgroundColor: "white",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 10,
                  marginTop: 10,
                }}
              >
                <Text
                  style={{
                    color: "#AA2D31",
                    fontSize: 23,
                    fontWeight: "bold",
                    marginRight: 5,
                  }}
                >
                  Map
                </Text>
                <Entypo name="map" size={24} color="#AA2D31" />
              </TouchableOpacity>
            </View>
          </ImageBackground>

          <View style={{ flex: 1.5, backgroundColor: "white" }}>
            <View>
              <View
                style={{
                  backgroundColor: "white",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  paddingHorizontal: 10,
                  paddingVertical: 13,
                  marginHorizontal: 20,
                  borderRadius: 10,
                  marginTop: -30,
                }}
              >
                <Entypo name="location-pin" size={24} color="red" />
                <BearTypes />
              </View>
            </View>
            <TouchableOpacity
              style={{
                padding: 15,
                marginTop: 15,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
              onPress={() =>
                navigation.navigate("bearMap", { type: "currentLocation" })
              }
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  width: 240,
                }}
              >
                <AntDesign name="pushpin" size={24} color="black" />
                <View style={{ marginLeft: 10 }}>
                  <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                    Current Location
                  </Text>
                  <Text style={{ fontStyle: "italic", fontSize: 12 }}>
                    {userLocation ? userLocation.address : "fetching"}
                  </Text>
                </View>
              </View>
              <View>
                <AntDesign name="arrowright" size={24} color="black" />
              </View>
            </TouchableOpacity>
            {/* Additional UI */}
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default BearHome;
