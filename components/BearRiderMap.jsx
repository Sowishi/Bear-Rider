import MapView, { Marker } from "react-native-maps";
import { useSmokeContext } from "../utils/appContext";
import MapViewDirections from "react-native-maps-directions";
import { Image, Text, View, Dimensions } from "react-native";
import people from "../assets/icons8-human-24 1.png";
import rider from "../assets/motorcyle.png";
import shop from "../assets/image 14.png";
import { useEffect, useRef, useState } from "react";
import { PROVIDER_GOOGLE } from "react-native-maps";
import useAddOnline from "../hooks/useAddOnline";
import * as Location from "expo-location";
import LottieView from "lottie-react-native";
import { riderMapStyle } from "../utils/riderMapStyle";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { StatusBar } from "expo-status-bar";

const BearRiderMap = ({
  location,
  selectedLocation,
  setSelectedLocation,
  selectedTransaction,
  isOnline,
  IS_RIDER,
  pahatodInputRef,
  mapRef,
  singleData,
}) => {
  const { mapView } = useSmokeContext();
  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

  const jumpToMarker = (coords) => {
    mapRef.current?.animateToRegion(
      { ...coords, latitudeDelta: 0.009, longitudeDelta: 0.009 },
      1000
    );
  };

  return (
    <>
      <StatusBar style="dark" translucent />

      <MapView
        customMapStyle={IS_RIDER ? riderMapStyle : ""}
        mapType={mapView}
        showsBuildings
        showsUserLocation
        ref={mapRef}
        showsTraffic={true}
        provider={PROVIDER_GOOGLE}
        style={{ flex: 1, minHeight: screenHeight, minWidth: screenWidth }}
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
        {/* Current Location */}
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
            pinColor={"#B80B00"}
          />
        )}
      </MapView>
    </>
  );
};

export default BearRiderMap;
