import {
  View,
  Text,
  ImageBackground,
  ScrollView,
  RefreshControl,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import bg1 from "../assets/bear1.png";
import Entypo from "@expo/vector-icons/Entypo";
import { TouchableOpacity } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import BearTypes from "../components/bearType";
import { useSmokeContext } from "../utils/appContext";
import * as Location from "expo-location";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Constants from "expo-constants";
import BearHeader from "../components/bearHeader";
import { StatusBar } from "expo-status-bar";
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

  function greetUser() {
    const currentHour = new Date().getHours();

    if (currentHour >= 5 && currentHour < 12) {
      return "Good Morning!";
    } else if (currentHour >= 12 && currentHour < 17) {
      return "Good Afternoon!";
    } else if (currentHour >= 17 && currentHour < 21) {
      return "Good Evening!";
    } else {
      return "Good Midnight!"; // For late-night hours
    }
  }

  return (
    <>
      <StatusBar backgroundColor="#B80B00" style="light" />
      <ScrollView
        style={{ marginTop: Constants.statusBarHeight }}
        contentContainerStyle={{ flexGrow: 1, backgroundColor: "white" }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <BearHeader navigation={navigation} />
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
              colors={["rgba(0, 0, 0, 0.8)", "rgba(0, 0, 0, 0.4)"]}
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
                paddingHorizontal: 10,
                width: "100%",
              }}
            >
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "flex-start",
                  flex: 1,
                  paddingHorizontal: 10,
                }}
              >
                <Text
                  style={{ fontSize: 30, color: "white", fontWeight: "bold" }}
                >
                  {greetUser()}
                  {" " + currentUser?.firstName}
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
                    borderRadius: 5,
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
                    Book Now
                  </Text>
                  <Entypo name="map" size={24} color="#AA2D31" />
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>

          <View style={{ flex: 1, backgroundColor: "white" }}>
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
                  borderRadius: 5,
                  marginTop: -30,
                }}
              >
                <FontAwesome
                  name="dot-circle-o"
                  size={24}
                  color="red"
                  style={{ marginRight: 5 }}
                />
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
                <View
                  style={{
                    backgroundColor: "black",
                    borderRadius: 100,
                    width: 30,
                    height: 30,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Entypo name="location-pin" size={20} color="white" />
                </View>
                <View style={{ marginLeft: 10 }}>
                  <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                    Pin Location
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
            <TouchableOpacity
              style={{
                padding: 15,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
              onPress={() => navigation.navigate("savedPlaces")}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  width: 240,
                }}
              >
                <Entypo name="location-pin" size={24} color="red" />

                <View style={{ marginLeft: 10 }}>
                  <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                    Saved Places
                  </Text>
                  <Text style={{ fontStyle: "italic", fontSize: 12 }}>
                    Saved your places for easy access
                  </Text>
                </View>
              </View>
              <View
                style={{
                  backgroundColor: "#FEF3F7",
                  padding: 7,
                  borderRadius: 100,
                }}
              >
                <AntDesign name="arrowright" size={24} color="black" />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default BearHome;
