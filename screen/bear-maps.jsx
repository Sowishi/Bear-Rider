import LottieView from "lottie-react-native";
import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Text, Button, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import maps from "../assets/maps.json";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import * as Location from "expo-location";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";
import { TouchableOpacity } from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import { useSmokeContext } from "../utils/appContext";

const BearMaps = ({ navigation, route }) => {
  const mapRef = useRef();
  const refRBSheet = useRef();
  const { type } = route.params;
  const {
    setMessageInfo,
    currentUser,
    setBookLocation,
    bookLocationRef,
    setViewRiderState,
    setShowBook,
  } = useSmokeContext();
  const [region, setRegion] = useState({
    latitude: 14.0996,
    longitude: 122.955,
    latitudeDelta: 0.3,
    longitudeDelta: 0.5,
  });

  const [selectedLocation, setSelectedLocation] = useState({
    latitude: region.latitude,
    longitude: region.longitude,
  });

  const [address, setAddress] = useState("");

  const handleRegionChangeComplete = (newRegion) => {
    setRegion(newRegion);
    setSelectedLocation({
      latitude: newRegion.latitude,
      longitude: newRegion.longitude,
    });
  };

  const reverseGeocode = async (latitude, longitude) => {
    try {
      const geocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      if (geocode.length > 0) {
        const address = `${geocode[0].street}, ${geocode[0].city}, ${geocode[0].region}, ${geocode[0].postalCode}, ${geocode[0].country}`;
        setAddress(address);
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  useEffect(() => {
    reverseGeocode(region.latitude, region.longitude);
  }, [region]);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        initialRegion={region}
        onRegionChangeComplete={handleRegionChangeComplete}
      ></MapView>
      <View style={styles.markerFixed}>
        <LottieView
          style={{ width: 100, height: 100 }}
          autoPlay
          source={maps}
        />
      </View>
      <View style={{ position: "absolute", top: 50, width: "100%" }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            width: "100%",
            paddingHorizontal: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
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
        </View>
      </View>
      <View
        style={{
          position: "absolute",
          bottom: 0,
          height: 280,
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
            <View
              style={{
                width: 300,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              <Entypo name="location-pin" size={24} color="red" />
              <View>
                <Text
                  style={{ fontSize: 15, marginLeft: 5, fontWeight: "bold" }}
                >
                  Selected Location
                </Text>
                <Text style={{ fontSize: 13, marginLeft: 5 }}>{address}</Text>
              </View>
            </View>
            <View
              style={{
                width: 300,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
                marginTop: 10,
              }}
            >
              <Entypo name="location-pin" size={24} color="black" />
              <View>
                <Text
                  style={{ fontSize: 15, marginLeft: 5, fontWeight: "bold" }}
                >
                  Current Location
                </Text>
                <Text style={{ fontSize: 13, marginLeft: 5 }}>{address}</Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => refRBSheet.current.open()}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 10,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <View>
                  <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                    Saved Places
                  </Text>
                </View>
              </View>
              <View
                style={{
                  backgroundColor: "#FFF5F6",
                  padding: 5,
                  borderRadius: 100,
                }}
              >
                <AntDesign name="arrowright" size={24} color="black" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                if (type == "pointA") {
                  setBookLocation({ ...selectedLocation, address });
                }
                if (type == "pointB") {
                  setLocation({ ...selectedLocation, address });
                }
                navigation.goBack();
              }}
              style={{
                width: "100%",
                backgroundColor: "#232323",
                paddingVertical: 15,
                marginTop: 20,
                borderRadius: 20,
              }}
            >
              <Text style={{ color: "white", textAlign: "center" }}>
                {selectedLocation ? "Choose this destination" : "loading..."}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <RBSheet
        height={500}
        ref={refRBSheet}
        useNativeDriver={false}
        draggable
        customStyles={{
          wrapper: {
            backgroundColor: "transparent",
          },
          draggableIcon: {
            backgroundColor: "#000",
          },
        }}
        customModalProps={{
          animationType: "slide",
          statusBarTranslucent: true,
        }}
        customAvoidingViewProps={{
          enabled: false,
        }}
      >
        <Text>fkjfkd</Text>
      </RBSheet>
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

export default BearMaps;
