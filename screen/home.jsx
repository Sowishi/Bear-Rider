import { StatusBar } from "expo-status-bar";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  Modal,
  Pressable,
  TextInput,
  Button,
  Vibration,
  Platform,
} from "react-native";
import Constants from "expo-constants";
import { useEffect, useRef, useState } from "react";
import { database } from "../firebase";
import LottieView from "lottie-react-native";
import { showToast } from "../components/toast";
import { get, onValue, ref } from "firebase/database";
import { FontAwesome } from "@expo/vector-icons";
import ConnectionModal from "../components/connectionModal";
import { useSmokeContext } from "../utils/appContext";
import { BackHandler } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MapView, { Callout } from "react-native-maps";
import { Marker, Circle, Polyline } from "react-native-maps";
import SmallButton from "../components/smallButton";
import { PROVIDER_GOOGLE } from "react-native-maps";
import { Entypo } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";

const Home = ({ route, navigation }) => {
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [mapType, setMapType] = useState("standard");
  const [deviceValue, setDeviceValue] = useState(null);
  const [distance, setDistance] = useState();
  const [danger, setDanger] = useState(false);
  const [sound, setSound] = useState();
  const [pauseSMS, setPauseSMS] = useState(false);

  const { uid, updateUid, auth, MASTER_NAME, SLAVE_NAME, RADIUS } =
    useSmokeContext();

  const splash = useRef();
  const mapRef = useRef();

  const ONE_SECOND_IN_MS = 1000;

  const PATTERN = [
    1 * ONE_SECOND_IN_MS,
    2 * ONE_SECOND_IN_MS,
    3 * ONE_SECOND_IN_MS,
  ];

  // Displaying the animated loader then fetching uid and and deviceValue

  useEffect(() => {
    if (splash.current !== null) {
      splash.current.play();
    }
    setTimeout(() => {
      setLoading(false);
    }, 2000);

    fetchUidValue();
    fetchUid();
  }, [uid]);

  //Disable the back button functionality

  useEffect(() => {
    async function saveData() {
      await AsyncStorage.setItem("user", JSON.stringify(auth));
    }
    saveData();
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        return true;
      }
    );

    return () => {
      backHandler.remove();
    };
  }, []);

  //For calculating the distance of basepoint and patient by harvistine formula

  useEffect(() => {
    calculateDistance();
  }, [deviceValue]);

  //For the unloading of the sound

  useEffect(() => {
    return sound
      ? () => {
          console.log("Unloading Sound");
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  async function fetchUid() {
    const userRef = ref(database, `users/${auth.id}`);
    const snapshot = await get(userRef);
    const data = snapshot.val();
    if (data.uid == undefined) {
      updateUid(null);
    } else {
      updateUid(data.uid, "device value");
    }
  }

  function fetchUidValue() {
    const dataRef = ref(database, `/uids/${uid}`);

    onValue(dataRef, (snapshot) => {
      const data = snapshot.val();
      setDeviceValue(data);
    });
  }

  function jumpToMarker(coordinate) {
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      });
    }
  }

  function vibrate(counter) {
    if (counter > 5) {
      return;
    }
    Vibration.vibrate(PATTERN);

    setTimeout(() => {
      vibrate(counter + 1);
    }, 2000);
  }

  async function handleSMS() {
    console.log("SMS called");
    const phone = deviceValue.phone.trim();
    const message = `Warning! Patient is out of reach. Patient Name: ${deviceValue.slaveName}Location: ${deviceValue.slave.lat},${deviceValue.slave.long} Note: Copy the location and paste to this link 
https://www.google.com/maps/`;
    const response = await fetch(
      `https://api.semaphore.co/api/v4/messages?apikey=214fc12c7e55e526e6b6f7941239ed04&number=${phone}&message=${message}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const output = await response.json();
    console.log(output);
  }

  function calculateDistance() {
    if (deviceValue && uid !== null) {
      const output = haversineDistance(deviceValue.master, deviceValue.slave);
      setDistance(parseInt(output));
      if (output > RADIUS) {
        if (pauseSMS == false) {
          handleSMS();
          setPauseSMS(true);
          setTimeout(() => {
            setPauseSMS(false);
          }, 60000);
        }
        showToast("error", "Slave is out of reach!");
        setDanger(true);
        playSound();
        vibrate(0);
      } else {
        setDanger(false);
      }
    }
  }

  function haversineDistance(coord1, coord2) {
    function toRadians(degrees) {
      return degrees * (Math.PI / 180);
    }

    const R = 6371; // Earth radius in kilometers
    const dLat = toRadians(coord2.lat - coord1.lat);
    const dLon = toRadians(coord2.long - coord1.long);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(coord1.lat)) *
        Math.cos(toRadians(coord2.lat)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c * 1000; // Distance in meters

    return distance;
  }

  async function playSound() {
    console.log("Loading Sound");
    const { sound } = await Audio.Sound.createAsync(
      require("../assets/warning-2.mp3")
    );
    setSound(sound);

    console.log("Playing Sound");
    await sound.playAsync();
  }

  return (
    <View
      style={{
        flex: 1,
        marginTop: Constants.statusBarHeight,
        backgroundColor: "#FAF5FC",
      }}
    >
      <StatusBar backgroundColor={"#4C3488"} style="light" />

      <ConnectionModal
        navigation={navigation}
        uid={uid}
        updateUid={updateUid}
        modalVisible={modalVisible}
        closeModal={() => setModalVisible(false)}
        setMapType={setMapType}
      ></ConnectionModal>
      {loading && (
        <View
          style={{
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <LottieView
            style={{
              width: "70%",
              height: "70%",
            }}
            ref={splash}
            source={require("../assets/maps.json")}
          />
        </View>
      )}

      <View style={{ flex: 1 }}>
        {uid !== undefined && (
          <View
            style={{
              flex: 1,
              backgroundColor: "white",
              position: "relative",
            }}
          >
            {/* User Control Navigation */}
            <View
              style={{
                position: "absolute",
                top: 20,
                right: 10,
                zIndex: 2,
                backgroundColor: "#fefefe99",
                padding: 5,
                borderRadius: 5,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(true);
                }}
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FontAwesome name="user-circle" size={30} color="#F77000" />
              </TouchableOpacity>
            </View>

            {/* Bottom Navigation      */}
            {uid !== null && (
              <View
                style={{
                  position: "absolute",
                  bottom: 20,
                  zIndex: 2,
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    backgroundColor: "#fefefe99",
                    width: "90%",
                    padding: 10,
                    flexDirection: "row",
                    justifyContent: "space-around",
                    borderRadius: 5,
                  }}
                >
                  <Text style={{ fontWeight: "bold" }}>
                    Patient Distance: {distance} meters
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: "#fefefe99",
                    width: "90%",
                    padding: 10,
                    flexDirection: "row",
                    justifyContent: "space-around",
                    borderRadius: 5,
                  }}
                >
                  <SmallButton
                    event={() => {
                      jumpToMarker({
                        latitude: deviceValue.master.lat,
                        longitude: deviceValue.master.long,
                      });
                    }}
                    text="Base Point"
                    bgColor={"#F77000"}
                  />
                  <SmallButton
                    event={() => {
                      jumpToMarker({
                        latitude: deviceValue.slave.lat,
                        longitude: deviceValue.slave.long,
                      });
                    }}
                    text="Patient"
                    bgColor={"#232D3F"}
                  />
                </View>
              </View>
            )}

            {/* The warning message at the top of the map */}

            {danger && (
              <View
                style={{
                  position: "absolute",
                  top: 70,
                  zIndex: 2,
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    backgroundColor: "#F7000099",
                    width: "90%",
                    padding: 10,
                    flexDirection: "row",
                    justifyContent: "space-around",
                    borderRadius: 5,
                  }}
                >
                  <Text style={{ color: "white", fontSize: 16 }}>
                    {SLAVE_NAME} is out of reach.{" "}
                    <Entypo name="warning" size={16} color="white" />
                  </Text>
                </View>

                <LottieView
                  style={{
                    width: 70,
                    height: 70,
                  }}
                  autoPlay
                  source={require("../assets/alert.json")}
                />
              </View>
            )}
            {uid == null && (
              <LinearGradient
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                colors={["#4C3488", "#AFBAF8"]}
              >
                <Text
                  style={{
                    fontSize: 40,
                    color: "white",
                    textAlign: "center",
                    marginBottom: 10,
                  }}
                >
                  Please scan your device 🕵️
                </Text>
                <SmallButton
                  event={() => {
                    setModalVisible(true);
                  }}
                  text="Scan"
                  bgColor={"#232D3F"}
                />
              </LinearGradient>
            )}

            {/* The maps */}

            {deviceValue !== null &&
              uid !== null &&
              deviceValue.master &&
              deviceValue.slave && (
                <MapView
                  showsTraffic={true}
                  provider={PROVIDER_GOOGLE}
                  ref={mapRef}
                  mapType={mapType}
                  showsMyLocationButton={true}
                  style={{ flex: 1, minHeight: 500, minWidth: 500 }}
                  initialRegion={{
                    latitude: deviceValue.master.lat,
                    longitude: deviceValue.master.long,
                    latitudeDelta: 0.1,
                    longitudeDelta: 0.1,
                  }}
                >
                  <Marker
                    coordinate={{
                      latitude: deviceValue.master.lat,
                      longitude: deviceValue.master.long,
                    }}
                    title={MASTER_NAME}
                    description={`Patient Distance: ${distance} meters`}
                    pinColor="#F77000"
                  />

                  <Marker
                    coordinate={{
                      latitude: deviceValue.slave.lat,
                      longitude: deviceValue.slave.long,
                    }}
                    title={SLAVE_NAME}
                    description="Patient Device"
                    pinColor="#232D3F"
                  />
                  <Circle
                    center={{
                      latitude: deviceValue.master.lat,
                      longitude: deviceValue.master.long,
                    }}
                    radius={RADIUS}
                    fillColor="#CC000040"
                    strokeColor="#CC000040"
                  />
                  <Polyline
                    coordinates={[
                      {
                        latitude: deviceValue.master.lat,
                        longitude: deviceValue.master.long,
                      },
                      {
                        latitude: deviceValue.slave.lat,
                        longitude: deviceValue.slave.long,
                      },
                    ]}
                    strokeWidth={5}
                    geodesic={true}
                    strokeColor="#E4005E"
                    lineDashPattern={[2]}
                  ></Polyline>
                </MapView>
              )}
          </View>
        )}
      </View>
    </View>
  );
};

export default Home;
