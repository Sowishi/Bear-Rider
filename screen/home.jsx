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
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

const Home = ({ route, navigation }) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [address, setAddress] = useState(null);
  const [serviceModal, setServiceModal] = useState(false);

  const mapRef = useRef();

  const center = {
    lat: 14.0996, // Approximate center latitude of Camarines Norte
    lng: 122.955, // Approximate center longitude of Camarines Norte
  };

  const radius = 50000;

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

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
          <Button
            width={300}
            text="Pahatod Services"
            bgColor={"#B80B00"}
            event={() => {
              alert(JSON.stringify(location));
            }}
          />
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
        ></MapView>
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
            renderLeftButton={() => (
              <FontAwesome
                onPress={() => navigation.navigate("User")}
                name="user-circle-o"
                size={27}
                color="#B80B00"
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
              // 'details' is provided when fetchDetails = true
              console.log(data, details);
            }}
            query={{
              key: "AIzaSyDJ92GRaQrePL4SXQEXF0qNVdAsbVhseYI",
              language: "en",
              components: "country:ph",
              location: `${center.lat},${center.lng}`,
              radius: radius,
            }}
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
