import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import ExpoStatusBar from "expo-status-bar/build/ExpoStatusBar";

const ViewBearAsset = ({ route, navigation }) => {
  const { type } = route.params;

  const data = {
    saveLocation: {
      image: require("../assets/screenAssest/Save Location.png"),
      title: "Start saving your location to access them faster",
      goTo: "savedPlaces",
    },
    pinLocation: {
      image: require("../assets/screenAssest/Pin your location.png"),
      title: "Pin your current location",
      goTo: "bearMap",
      parameter: "currentLocation",
    },
    liveTracking: {
      image: require("../assets/screenAssest/Live Tracking.png"),
      title: "Start tracking realtime",
      goTo: "LiveTracking",
    },
    paymentMethod: {
      image: require("../assets/screenAssest/Add Payment.png"),
      title: "Add your payment method",
      goTo: "SelectPaymentMethod",
    },
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ExpoStatusBar backgroundColor="white" style="dark" />
      <View
        style={{
          padding: 30,
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Image style={{ width: 300, height: 300 }} source={data[type].image} />
        <Text style={{ fontSize: 25, fontWeight: "bold", textAlign: "center" }}>
          {data[type].title}
        </Text>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate(data[type].goTo, {
              type: data[type].parameter,
            });
          }}
          style={{
            width: "100%",
            backgroundColor: "#B80B00",
            paddingVertical: 15,
            marginTop: 20,
            borderRadius: 20,
            marginTop: 30,
          }}
        >
          <Text
            style={{
              color: "white",
              textAlign: "center",
              fontWeight: "bold",
              fontSize: 18,
            }}
          >
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ViewBearAsset;
