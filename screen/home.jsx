import { StatusBar } from "expo-status-bar";
import { Text, TextInput, View } from "react-native";
import Constants from "expo-constants";

import MapView, { Callout, Marker } from "react-native-maps";
import { PROVIDER_GOOGLE } from "react-native-maps";
import Entypo from "@expo/vector-icons/Entypo";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import Button from "../components/button";
import BottomModal from "../components/bottomModal";

const Home = ({ route, navigation }) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [address, setAddress] = useState(null);
  const [serviceModal, setServiceModal] = useState(false);

  const mapRef = useRef();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      let output = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      setAddress(output[0]);
    })();
  }, []);

  const jumpToMarker = () => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: location?.coords.latitude,
          longitude: location?.coords.longitude,
          latitudeDelta: 0.001, // Adjust zoom level as needed
          longitudeDelta: 0.001,
        },
        1000
      ); // Duration in milliseconds
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

      <BottomModal
        heightPx={270}
        modalVisible={serviceModal}
        closeModal={() => setServiceModal(false)}
      >
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text style={{ fontSize: 25, marginBottom: 10 }}>Pick a service</Text>
          <Button width={300} text="Pahatod Services" bgColor={"#B80B00"} />
          <Button width={300} text="Padara Services" bgColor={"#B80B00"} />
        </View>
      </BottomModal>

      <View style={{ flex: 1, position: "relative" }}>
        <MapView
          ref={mapRef}
          showsTraffic={true}
          provider={PROVIDER_GOOGLE}
          showsMyLocationButton={true}
          style={{ flex: 1, minHeight: 500, minWidth: 500 }}
          initialRegion={{
            latitude: 14.0996,
            longitude: 122.955,
            latitudeDelta: 0.5,
            longitudeDelta: 0.1,
          }}
          region={{
            latitude: location?.coords.latitude,
            longitude: location?.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          {location && (
            <Marker
              onPress={jumpToMarker}
              coordinate={{
                latitude: location?.coords.latitude,
                longitude: location?.coords.longitude,
              }}
              title="Your Location"
              description="This is where you are"
            />
          )}
        </MapView>
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
          <FontAwesome
            onPress={() => navigation.navigate("User")}
            name="user-circle-o"
            size={27}
            color="#B80B00"
          />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.8,
              shadowRadius: 2,
              elevation: 3,
              paddingHorizontal: 10,
              backgroundColor: "white",
              borderRadius: 10,
              flex: 1,
              marginHorizontal: 25,
            }}
          >
            <TextInput
              value={address?.formattedAddress}
              onChangeText={(text) => setAddress(text)}
              placeholder="Your Location"
              style={{
                flex: 1,
                paddingVertical: 7,
                paddingHorizontal: 13,
              }}
            />
          </View>
          <FontAwesome
            onPress={() => navigation.navigate("Notification")}
            name="bell"
            size={24}
            color="#B80B00"
          />
        </View>
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
              backgroundColor: "#626B7B",
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
              Choose a Service{" "}
              <AntDesign name="right" size={24} color="black" />
            </Text>
            <Button
              event={() => setServiceModal(true)}
              text="Book"
              bgColor={"#B80B00"}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default Home;
